import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc, Firestore, writeBatch } from 'firebase/firestore';
import { getFirebaseApp } from './firebase';
import { retryWithBackoff, isRetryableError } from './retry';
import { logInfo, logError, logWarn, startTimer } from './logger';

let db: Firestore | null = null;

// Get Firestore instance
const getDb = (): Firestore | null => {
  if (!db) {
    const app = getFirebaseApp();
    if (app) {
      db = getFirestore(app);
    }
  }
  return db;
};

// User creation logging with default PitCoin balance
export const logUserCreation = async (userId: string, email: string) => {
  try {
    await retryWithBackoff(async () => {
      const database = getDb();
      if (!database) throw new Error('Firestore not initialized');

      await addDoc(collection(database, 'users'), {
        userId,
        email,
        createdAt: serverTimestamp(),
        pitcoinBalance: 2000,
        totalBets: 0,
        totalEarnings: 0,
        totalWins: 0,
        winRate: 0,
        status: 'active',
      });
      
      logInfo('User created', { userId, email });
    });
  } catch (error) {
    logError('Error creating user', { userId, email, error });
    throw error;
  }
};

// Betting limits constants
const MIN_BET_AMOUNT = 50;
const MAX_BET_AMOUNT = 500;

// Risk control constants
const MAX_ODDS_MULTIPLIER = 5.0; // Maximum odds multiplier (5x)
const MAX_PAYOUT_PER_BET = 2500; // Maximum payout per single bet (500 * 5 = 2500)
const MAX_DAILY_PAYOUT_PER_USER = 10000; // Maximum daily payout per user
const MAX_MARKET_EXPOSURE = 50000; // Maximum total exposure per market

// Team Names for Pit Mafiua Racing League
export const MOTOGP_RIDERS = [
  'APEX 5',
  'FORCE-BLR',
  'MAREVICKS',
  'ORION',
  'SKIBDI RACER',
  'THEONEPEICEISREAL',
];

// Bet logging with PitCoin deduction and betting limits validation
export const logBet = async (userId: string, betData: {
  marketType: string;
  selection: string;
  stakeAmount: number;
  odds: number;
  potentialReturn: number;
  raceEvent: string;
  marketId?: string;
  betType?: string;
}) => {
  const endTimer = startTimer('logBet');
  try {
    await retryWithBackoff(async () => {
      const database = getDb();
      if (!database) throw new Error('Firestore not initialized');

    // RULE 1: Validate betting limits (50-500 PitCoins per bet)
    if (betData.stakeAmount < MIN_BET_AMOUNT) {
      throw new Error(`Minimum bet amount is ${MIN_BET_AMOUNT} PitCoins`);
    }
    if (betData.stakeAmount > MAX_BET_AMOUNT) {
      throw new Error(`Maximum bet amount is ${MAX_BET_AMOUNT} PitCoins`);
    }

    // RULE 2: Validate max odds (5x maximum)
    if (betData.odds > MAX_ODDS_MULTIPLIER) {
      throw new Error(`Maximum odds multiplier is ${MAX_ODDS_MULTIPLIER}x`);
    }

    // RULE 3: Validate max payout per bet
    if (betData.potentialReturn > MAX_PAYOUT_PER_BET) {
      throw new Error(`Maximum payout per bet is ${MAX_PAYOUT_PER_BET} PC (max ${MAX_ODDS_MULTIPLIER}x odds)`);
    }

    // RULE 4: Check market exposure
    if (betData.marketId) {
      const marketBetsQuery = query(
        collection(database, 'bets'),
        where('marketId', '==', betData.marketId),
        where('status', '==', 'pending')
      );
      const marketBetsSnapshot = await getDocs(marketBetsQuery);
      
      const currentExposure = marketBetsSnapshot.docs.reduce((sum, doc) => {
        return sum + (doc.data().potentialReturn || 0);
      }, 0);

      if (currentExposure + betData.potentialReturn > MAX_MARKET_EXPOSURE) {
        throw new Error(`Market exposure limit reached. This market is temporarily closed.`);
      }
    }

    // RULE 5: Check daily payout limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const dailyBetsQuery = query(
      collection(database, 'bets'),
      where('userId', '==', userId),
      where('submissionTime', '>=', todayTimestamp),
      where('status', '==', 'won')
    );
    const dailyBetsSnapshot = await getDocs(dailyBetsQuery);
    
    const dailyPayouts = dailyBetsSnapshot.docs.reduce((sum, doc) => {
      return sum + (doc.data().potentialReturn || 0);
    }, 0);

    if (dailyPayouts + betData.potentialReturn > MAX_DAILY_PAYOUT_PER_USER) {
      throw new Error(`Daily payout limit reached (${MAX_DAILY_PAYOUT_PER_USER} PC). Try again tomorrow.`);
    }

    // Check if user already has an active bet on this market
    if (betData.marketId) {
      const existingBetQuery = query(
        collection(database, 'bets'),
        where('userId', '==', userId),
        where('marketId', '==', betData.marketId),
        where('status', '==', 'pending')
      );
      const existingBetSnapshot = await getDocs(existingBetQuery);
      
      if (!existingBetSnapshot.empty) {
        throw new Error('You already have an active bet on this market. Wait for it to end before placing another bet.');
      }
    }

    // First, get user's current balance
    const userQuery = query(collection(database, 'users'), where('userId', '==', userId));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      throw new Error('User not found');
    }

    const userDoc = querySnapshot.docs[0];
    const currentBalance = userDoc.data().pitcoinBalance || 0;

    // Check if user has enough balance
    if (currentBalance < betData.stakeAmount) {
      throw new Error('Insufficient PitCoin balance');
    }

    // Create bet record with submission timestamp for tie-breaker
    const betRef = await addDoc(collection(database, 'bets'), {
      userId,
      marketId: betData.marketId || null,
      marketType: betData.marketType,
      betType: betData.betType || 'race-winner',
      selection: betData.selection,
      stakeAmount: betData.stakeAmount,
      odds: betData.odds,
      potentialReturn: betData.potentialReturn,
      raceEvent: betData.raceEvent,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      submissionTime: Date.now(),
    });

    // Deduct PitCoin from user balance
    const newBalance = currentBalance - betData.stakeAmount;
    await updateDoc(userDoc.ref, {
      pitcoinBalance: newBalance,
      totalBets: (userDoc.data().totalBets || 0) + 1,
      lastBetAt: serverTimestamp(),
    });

      logInfo('Bet logged successfully', { betId: betRef.id, userId, newBalance });
      return { betId: betRef.id, newBalance };
    });
  } catch (error) {
    logError('Error logging bet', { userId, error });
    throw error;
  } finally {
    endTimer();
  }
};

// Get user's current PitCoin balance
export const getUserBalance = async (userId: string): Promise<number> => {
  try {
    return await retryWithBackoff(async () => {
      const database = getDb();
      if (!database) return 0;

      const userQuery = query(collection(database, 'users'), where('userId', '==', userId));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data().pitcoinBalance || 0;
      }
      return 0;
    });
  } catch (error) {
    logError('Error fetching user balance', { userId, error });
    return 0;
  }
};

// Update bet result and adjust balance if won
export const updateBetResult = async (betId: string, result: 'won' | 'lost', userId?: string) => {
  try {
    await retryWithBackoff(async () => {
      const database = getDb();
      if (!database) throw new Error('Firestore not initialized');

    const betRef = doc(database, 'bets', betId);
    const betDoc = await getDocs(query(collection(database, 'bets'), where('userId', '==', userId)));

    if (result === 'won' && userId) {
      // Get bet details
      const bet = betDoc.docs.find(d => d.id === betId)?.data();
      if (bet) {
        // Get user and add winnings
        const userQuery = query(collection(database, 'users'), where('userId', '==', userId));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const currentBalance = userDoc.data().pitcoinBalance || 0;
          const winnings = bet.potentialReturn;

          await updateDoc(userDoc.ref, {
            pitcoinBalance: currentBalance + winnings,
            totalEarnings: (userDoc.data().totalEarnings || 0) + winnings,
            totalWins: (userDoc.data().totalWins || 0) + 1,
          });
        }
      }
    }

      await updateDoc(betRef, {
        status: result,
        updatedAt: serverTimestamp(),
      });

      logInfo('Bet result updated', { betId, result, userId });
    });
  } catch (error) {
    logError('Error updating bet result', { betId, result, error });
  }
};

// Get user statistics
export const getUserStats = async (userId: string) => {
  try {
    const database = getDb();
    if (!database) return null;

    const userQuery = query(collection(database, 'users'), where('userId', '==', userId));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error('✗ Error fetching user stats:', error);
    return null;
  }
};

// Get user bets
export const getUserBets = async (userId: string) => {
  try {
    const database = getDb();
    if (!database) return [];

    const betsQuery = query(collection(database, 'bets'), where('userId', '==', userId));
    const querySnapshot = await getDocs(betsQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('✗ Error fetching user bets:', error);
    return [];
  }
};

// ============================================
// TIE-BREAKER ALGORITHM
// ============================================
// Rule: If two or more participants have the same PitCoin balance:
// 1. Most Correct Predictions (highest number of won bets)
// 2. Correct Race Winner Prediction (priority to who predicted Race Winner correctly)
// 3. Earliest Submission Time (who submitted bets earlier)

interface LeaderboardUser {
  id: string;
  userId: string;
  email: string;
  pitcoinBalance: number;
  totalBets: number;
  totalWins: number;
  totalEarnings: number;
  correctPredictions: number;
  hasRaceWinnerCorrect: boolean;
  earliestBetTime: number;
  [key: string]: any;
}

const applyTieBreakerRules = (users: LeaderboardUser[]): LeaderboardUser[] => {
  return users.sort((a, b) => {
    // Primary sort: PitCoin balance (descending)
    if (a.pitcoinBalance !== b.pitcoinBalance) {
      return b.pitcoinBalance - a.pitcoinBalance;
    }

    // TIE-BREAKER RULE #1: Most Correct Predictions
    if (a.correctPredictions !== b.correctPredictions) {
      return b.correctPredictions - a.correctPredictions;
    }

    // TIE-BREAKER RULE #2: Correct Race Winner Prediction
    if (a.hasRaceWinnerCorrect !== b.hasRaceWinnerCorrect) {
      return a.hasRaceWinnerCorrect ? -1 : 1; // true comes first
    }

    // TIE-BREAKER RULE #3: Earliest Submission Time
    return a.earliestBetTime - b.earliestBetTime; // Earlier time wins
  });
};

// Get leaderboard with tie-breaker rules applied
export const getLeaderboard = async (limit: number = 10) => {
  try {
    const database = getDb();
    if (!database) return [];

    const usersRef = collection(database, 'users');
    const usersQuery = query(usersRef);
    const usersSnapshot = await getDocs(usersQuery);

    // Fetch all bets to calculate tie-breaker metrics
    const betsRef = collection(database, 'bets');
    const betsSnapshot = await getDocs(betsRef);
    const allBets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const users: LeaderboardUser[] = await Promise.all(
      usersSnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        const userId = userData.userId;

        // Get user's bets
        const userBets = allBets.filter((bet: any) => bet.userId === userId);

        // Calculate correct predictions (won bets)
        const correctPredictions = userBets.filter((bet: any) => bet.status === 'won').length;

        // Check if user has correct Race Winner prediction
        const hasRaceWinnerCorrect = userBets.some(
          (bet: any) => 
            bet.status === 'won' && 
            (bet.marketType?.toLowerCase().includes('race winner') || 
             bet.marketType?.toLowerCase().includes('winner'))
        );

        // Get earliest bet submission time
        const betTimes = userBets
          .map((bet: any) => bet.submissionTime || bet.createdAt?.toMillis?.() || Date.now())
          .filter(time => time > 0);
        const earliestBetTime = betTimes.length > 0 ? Math.min(...betTimes) : Date.now();

        return {
          id: userDoc.id,
          userId: userData.userId,
          email: userData.email,
          pitcoinBalance: userData.pitcoinBalance || 0,
          totalBets: userData.totalBets || 0,
          totalWins: userData.totalWins || 0,
          totalEarnings: userData.totalEarnings || 0,
          winRate: userData.winRate || 0,
          status: userData.status || 'active',
          correctPredictions,
          hasRaceWinnerCorrect,
          earliestBetTime,
          createdAt: userData.createdAt,
        };
      })
    );

    // Apply tie-breaker rules and limit results
    const sortedUsers = applyTieBreakerRules(users);
    return sortedUsers.slice(0, limit);
  } catch (error) {
    console.error('✗ Error fetching leaderboard:', error);
    return [];
  }
};

// ============================================
// ADMIN FUNCTIONS
// ============================================

// Get all users with their current stakes
export const getAllActiveBettors = async () => {
  try {
    const database = getDb();
    if (!database) return [];

    const usersRef = collection(database, 'users');
    const querySnapshot = await getDocs(usersRef);

    const bettors = await Promise.all(
      querySnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        
        // Get user's active bets
        const betsQuery = query(
          collection(database, 'bets'),
          where('userId', '==', userData.userId),
          where('status', '==', 'pending')
        );
        const betsSnapshot = await getDocs(betsQuery);
        
        // Calculate total current stake
        const currentStake = betsSnapshot.docs.reduce((sum, betDoc) => {
          return sum + (betDoc.data().stakeAmount || 0);
        }, 0);

        // Get primary bet info
        const primaryBet = betsSnapshot.docs[0]?.data();

        return {
          id: userDoc.id,
          userId: userData.userId,
          email: userData.email,
          balance: userData.pitcoinBalance || 0,
          currentStake,
          betSelection: primaryBet?.selection || 'N/A',
          status: userData.status || 'active',
          totalBets: userData.totalBets || 0,
        };
      })
    );

    return bettors.filter(b => b.currentStake > 0 || b.totalBets > 0);
  } catch (error) {
    console.error('✗ Error fetching active bettors:', error);
    return [];
  }
};

// Get total pool liquidity (sum of all pending bets)
export const getTotalPoolLiquidity = async (): Promise<number> => {
  try {
    const database = getDb();
    if (!database) return 0;

    const betsQuery = query(collection(database, 'bets'), where('status', '==', 'pending'));
    const querySnapshot = await getDocs(betsQuery);

    return querySnapshot.docs.reduce((sum, doc) => {
      return sum + (doc.data().stakeAmount || 0);
    }, 0);
  } catch (error) {
    console.error('✗ Error calculating pool liquidity:', error);
    return 0;
  }
};

// Get active bettors count
export const getActiveBettorsCount = async (): Promise<number> => {
  try {
    const database = getDb();
    if (!database) return 0;

    const betsQuery = query(collection(database, 'bets'), where('status', '==', 'pending'));
    const querySnapshot = await getDocs(betsQuery);

    // Get unique user IDs
    const uniqueUsers = new Set(querySnapshot.docs.map(doc => doc.data().userId));
    return uniqueUsers.size;
  } catch (error) {
    console.error('✗ Error counting active bettors:', error);
    return 0;
  }
};

// Create a new betting market (admin only)
export const createBettingMarket = async (marketData: {
  betName: string;
  summary: string;
  startTime: string;
  duration: string;
  raceEvent: string;
  icon?: string;
  color?: string;
  odds?: number;
  betType?: string; // NEW: race-winner, podium, top5, fastest-lap
  selectionType?: string; // NEW: single, multiple, numeric
  maxSelections?: number; // NEW: For podium (3), top5 (5)
}) => {
  const endTimer = startTimer('createBettingMarket');
  try {
    return await retryWithBackoff(async () => {
      const database = getDb();
      if (!database) throw new Error('Firestore not initialized');

      const marketRef = await addDoc(collection(database, 'betting_markets'), {
        ...marketData,
        betType: marketData.betType || 'race-winner',
        selectionType: marketData.selectionType || 'single',
        maxSelections: marketData.maxSelections || 1,
        status: 'open',
        createdAt: serverTimestamp(),
        totalStake: 0,
        participantCount: 0,
      });

      logInfo('Betting market created', { marketId: marketRef.id, betName: marketData.betName });
      return { marketId: marketRef.id };
    });
  } catch (error) {
    logError('Error creating betting market', { marketData, error });
    throw error;
  } finally {
    endTimer();
  }
};

// Finalize bet results (admin only)
export const finalizeBetResults = async (betData: {
  betName: string;
  summary: string;
  winningSelection: string;
}) => {
  try {
    const database = getDb();
    if (!database) throw new Error('Firestore not initialized');

    // Find all bets matching this selection
    const betsQuery = query(
      collection(database, 'bets'),
      where('selection', '==', betData.winningSelection),
      where('status', '==', 'pending')
    );
    const querySnapshot = await getDocs(betsQuery);

    // Process each winning bet
    const payoutPromises = querySnapshot.docs.map(async (betDoc) => {
      const bet = betDoc.data();
      const userId = bet.userId;

      // Update bet status to won
      await updateDoc(betDoc.ref, {
        status: 'won',
        updatedAt: serverTimestamp(),
      });

      // Get user and add winnings
      const userQuery = query(collection(database, 'users'), where('userId', '==', userId));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const currentBalance = userDoc.data().pitcoinBalance || 0;
        const winnings = bet.potentialReturn;

        await updateDoc(userDoc.ref, {
          pitcoinBalance: currentBalance + winnings,
          totalEarnings: (userDoc.data().totalEarnings || 0) + winnings,
          totalWins: (userDoc.data().totalWins || 0) + 1,
        });
      }
    });

    await Promise.all(payoutPromises);

    // Mark all losing bets as lost
    const allBetsQuery = query(collection(database, 'bets'), where('status', '==', 'pending'));
    const allBetsSnapshot = await getDocs(allBetsQuery);

    const losingBetsPromises = allBetsSnapshot.docs.map(async (betDoc) => {
      await updateDoc(betDoc.ref, {
        status: 'lost',
        updatedAt: serverTimestamp(),
      });
    });

    await Promise.all(losingBetsPromises);

    console.log('✓ Bet results finalized and payouts processed');
    return { success: true, winnersCount: querySnapshot.docs.length };
  } catch (error) {
    console.error('✗ Error finalizing bet results:', error);
    throw error;
  }
};

// Toggle betting status (open/close)
export const toggleBettingStatus = async (status: 'open' | 'closed') => {
  try {
    const database = getDb();
    if (!database) throw new Error('Firestore not initialized');

    // Store global betting status
    await addDoc(collection(database, 'system_status'), {
      bettingStatus: status,
      updatedAt: serverTimestamp(),
    });

    console.log(`✓ Betting status set to: ${status}`);
    return { status };
  } catch (error) {
    console.error('✗ Error toggling betting status:', error);
    throw error;
  }
};

// Get system logs
export const getSystemLogs = async (limit: number = 10) => {
  try {
    const database = getDb();
    if (!database) return [];

    const logsRef = collection(database, 'system_logs');
    const querySnapshot = await getDocs(logsRef);

    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => {
        const timeA = a.timestamp?.toMillis() || 0;
        const timeB = b.timestamp?.toMillis() || 0;
        return timeB - timeA;
      })
      .slice(0, limit);
  } catch (error) {
    console.error('✗ Error fetching system logs:', error);
    return [];
  }
};

// Add system log entry
export const addSystemLog = async (logData: {
  type: 'SYS' | 'API' | 'WARN' | 'ERROR';
  message: string;
}) => {
  try {
    const database = getDb();
    if (!database) throw new Error('Firestore not initialized');

    await addDoc(collection(database, 'system_logs'), {
      ...logData,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('✗ Error adding system log:', error);
  }
};

// Ban/unban user (admin only)
export const toggleUserStatus = async (userId: string, status: 'active' | 'suspended') => {
  try {
    const database = getDb();
    if (!database) throw new Error('Firestore not initialized');

    const userQuery = query(collection(database, 'users'), where('userId', '==', userId));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      await updateDoc(userDoc.ref, {
        status,
        updatedAt: serverTimestamp(),
      });
      console.log(`✓ User ${userId} status updated to: ${status}`);
    }
  } catch (error) {
    console.error('✗ Error toggling user status:', error);
    throw error;
  }
};

// Get all active betting markets
export const getActiveBettingMarkets = async () => {
  try {
    const database = getDb();
    if (!database) return [];

    const marketsRef = collection(database, 'betting_markets');
    const q = query(marketsRef, where('status', '==', 'open'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('✗ Error fetching betting markets:', error);
    return [];
  }
};

// Get ALL betting markets (for admin panel)
export const getAllBettingMarkets = async () => {
  try {
    const database = getDb();
    if (!database) return [];

    const marketsRef = collection(database, 'betting_markets');
    const querySnapshot = await getDocs(marketsRef);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('✗ Error fetching all betting markets:', error);
    return [];
  }
};

// Check if user has active bet on a specific market
export const checkUserHasActiveBet = async (userId: string, marketId: string): Promise<boolean> => {
  try {
    const database = getDb();
    if (!database) return false;

    const betsQuery = query(
      collection(database, 'bets'),
      where('userId', '==', userId),
      where('marketId', '==', marketId),
      where('status', '==', 'pending')
    );
    const querySnapshot = await getDocs(betsQuery);

    return !querySnapshot.empty;
  } catch (error) {
    console.error('✗ Error checking user bet:', error);
    return false;
  }
};

// Get user's active bet on a specific market
export const getUserActiveBet = async (userId: string, marketId: string) => {
  try {
    const database = getDb();
    if (!database) return null;

    const betsQuery = query(
      collection(database, 'bets'),
      where('userId', '==', userId),
      where('marketId', '==', marketId),
      where('status', '==', 'pending')
    );
    const querySnapshot = await getDocs(betsQuery);

    if (!querySnapshot.empty) {
      const betDoc = querySnapshot.docs[0];
      return { id: betDoc.id, ...betDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('✗ Error fetching user bet:', error);
    return null;
  }
};

// Close a specific betting market (admin only)
export const closeBettingMarket = async (marketId: string) => {
  try {
    return await retryWithBackoff(async () => {
      const database = getDb();
      if (!database) throw new Error('Firestore not initialized');

      const marketRef = doc(database, 'betting_markets', marketId);
      await updateDoc(marketRef, {
        status: 'closed',
        closedAt: serverTimestamp(),
      });

      logInfo('Betting market closed', { marketId });
      return { success: true };
    });
  } catch (error) {
    logError('Error closing betting market', { marketId, error });
    throw error;
  }
};

// Reopen a specific betting market (admin only)
export const reopenBettingMarket = async (marketId: string) => {
  try {
    return await retryWithBackoff(async () => {
      const database = getDb();
      if (!database) throw new Error('Firestore not initialized');

      const marketRef = doc(database, 'betting_markets', marketId);
      await updateDoc(marketRef, {
        status: 'open',
        reopenedAt: serverTimestamp(),
      });

      logInfo('Betting market reopened', { marketId });
      return { success: true };
    });
  } catch (error) {
    logError('Error reopening betting market', { marketId, error });
    throw error;
  }
};

// Delete a specific betting market (admin only)
export const deleteBettingMarket = async (marketId: string) => {
  try {
    return await retryWithBackoff(async () => {
      const database = getDb();
      if (!database) throw new Error('Firestore not initialized');

      // Get all bets for this market
      const betsQuery = query(
        collection(database, 'bets'),
        where('marketId', '==', marketId),
        where('status', '==', 'pending')
      );
      const betsSnapshot = await getDocs(betsQuery);

      // Refund all pending bets
      const refundPromises = betsSnapshot.docs.map(async (betDoc) => {
        const bet = betDoc.data();
        const userId = bet.userId;
        const stakeAmount = bet.stakeAmount;

        // Get user and refund stake
        const userQuery = query(collection(database, 'users'), where('userId', '==', userId));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const currentBalance = userDoc.data().pitcoinBalance || 0;

          await updateDoc(userDoc.ref, {
            pitcoinBalance: currentBalance + stakeAmount,
          });
        }

        // Mark bet as cancelled
        await updateDoc(betDoc.ref, {
          status: 'cancelled',
          updatedAt: serverTimestamp(),
        });
      });

      await Promise.all(refundPromises);

      // Delete the market
      const marketRef = doc(database, 'betting_markets', marketId);
      await updateDoc(marketRef, {
        status: 'deleted',
        deletedAt: serverTimestamp(),
      });

      logInfo('Betting market deleted and bets refunded', { 
        marketId, 
        refundedBets: betsSnapshot.docs.length 
      });
      return { success: true, refundedBets: betsSnapshot.docs.length };
    });
  } catch (error) {
    logError('Error deleting betting market', { marketId, error });
    throw error;
  }
};

// Helper function to normalize team names
const normalizeRiderName = (name: string): string => {
  return name.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');
};

// Helper function to parse comma-separated selections
const parseSelection = (selection: string): string[] => {
  return selection.split(',').map(s => normalizeRiderName(s)).filter(s => s.length > 0);
};

// Helper function to compare selections
const compareSelections = (userSelection: string, winningSelection: string, betType: string): boolean => {
  if (betType === 'podium' || betType === 'top5') {
    const userList = parseSelection(userSelection);
    const winningList = parseSelection(winningSelection);
    
    // Must have correct number of selections
    const expectedCount = betType === 'podium' ? 3 : 5;
    if (userList.length !== expectedCount || winningList.length !== expectedCount) {
      return false;
    }
    
    // All must match in order
    for (let i = 0; i < expectedCount; i++) {
      if (userList[i] !== winningList[i]) {
        return false;
      }
    }
    return true;
  } else {
    // Single selection - normalize and compare
    return normalizeRiderName(userSelection) === normalizeRiderName(winningSelection);
  }
};

// Finalize specific market results with first-bet-wins logic (admin only)
export const finalizeMarketResults = async (marketId: string, winningSelection: string) => {
  const endTimer = startTimer('finalizeMarketResults');
  try {
    return await retryWithBackoff(async () => {
      const database = getDb();
      if (!database) throw new Error('Firestore not initialized');

    // Get market to check bet type
    const marketRef = doc(database, 'betting_markets', marketId);
    const marketDoc = await getDocs(query(collection(database, 'betting_markets'), where('__name__', '==', marketId)));
    const market = marketDoc.docs[0]?.data();
    const betType = market?.betType || 'race-winner';

    // Find all bets for this market
    const allBetsQuery = query(
      collection(database, 'bets'),
      where('marketId', '==', marketId),
      where('status', '==', 'pending')
    );
    const allBetsSnapshot = await getDocs(allBetsQuery);

    // Filter winning bets using enhanced comparison
    const winningBets = allBetsSnapshot.docs
      .filter(doc => compareSelections(doc.data().selection, winningSelection, betType))
      .map(doc => ({ id: doc.id, ref: doc.ref, ...doc.data() as any }))
      .sort((a: any, b: any) => {
        const timeA = a.submissionTime || a.createdAt?.toMillis?.() || 0;
        const timeB = b.submissionTime || b.createdAt?.toMillis?.() || 0;
        return timeA - timeB;
      });

    if (winningBets.length === 0) {
      console.log('No winning bets found for this selection');
      
      // Mark all bets as lost
      const losingBetsPromises = allBetsSnapshot.docs.map(async (betDoc) => {
        await updateDoc(betDoc.ref, {
          status: 'lost',
          updatedAt: serverTimestamp(),
        });
      });

      await Promise.all(losingBetsPromises);

      // Update market status
      await updateDoc(marketRef, {
        status: 'finalized',
        winningSelection,
        finalizedAt: serverTimestamp(),
      });

      return { success: true, winnersCount: 0 };
    }

    // FIRST-BET-WINS LOGIC: Only the FIRST bet wins
    const firstWinningBet = winningBets[0];
    const userId = firstWinningBet.userId;
    const winnings = firstWinningBet.potentialReturn;

    // Update the winning bet
    await updateDoc(firstWinningBet.ref, {
      status: 'won',
      updatedAt: serverTimestamp(),
    });

    // Get user and add winnings
    const userQuery = query(collection(database, 'users'), where('userId', '==', userId));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      const currentBalance = userDoc.data().pitcoinBalance || 0;

      await updateDoc(userDoc.ref, {
        pitcoinBalance: currentBalance + winnings,
        totalEarnings: (userDoc.data().totalEarnings || 0) + winnings,
        totalWins: (userDoc.data().totalWins || 0) + 1,
      });
    }

    // Mark all other bets as lost
    const losingBetsPromises = allBetsSnapshot.docs
      .filter(doc => doc.id !== firstWinningBet.id)
      .map(async (betDoc) => {
        await updateDoc(betDoc.ref, {
          status: 'lost',
          updatedAt: serverTimestamp(),
        });
      });

    await Promise.all(losingBetsPromises);

    // Update market status
    await updateDoc(marketRef, {
      status: 'finalized',
      winningSelection,
      finalizedAt: serverTimestamp(),
    });

      logInfo('Market results finalized', { marketId, winningSelection, winnersCount: 1, winnerUserId: userId });
      return { success: true, winnersCount: 1, winnerUserId: userId };
    });
  } catch (error) {
    logError('Error finalizing market results', { marketId, winningSelection, error });
    throw error;
  } finally {
    endTimer();
  }
};

// ============================================
// STANDINGS FUNCTIONS
// ============================================

// Get driver standings
export const getDriverStandings = async () => {
  try {
    const database = getDb();
    if (!database) return [];

    const driversRef = collection(database, 'driver_standings');
    const querySnapshot = await getDocs(driversRef);

    const drivers = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (b.points || 0) - (a.points || 0));

    return drivers;
  } catch (error) {
    console.error('✗ Error fetching driver standings:', error);
    return [];
  }
};

// Get constructor standings
export const getConstructorStandings = async () => {
  try {
    const database = getDb();
    if (!database) return [];

    const constructorsRef = collection(database, 'constructor_standings');
    const querySnapshot = await getDocs(constructorsRef);

    const constructors = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (b.points || 0) - (a.points || 0));

    return constructors;
  } catch (error) {
    console.error('✗ Error fetching constructor standings:', error);
    return [];
  }
};

// Add or update driver standing (admin only)
export const updateDriverStanding = async (driverData: {
  name: string;
  team: string;
  points: number;
  position: number;
  positionChange?: number;
  consistency?: number;
  avgPosition?: string;
  avatar?: string;
  nationality?: string;
}) => {
  try {
    const database = getDb();
    if (!database) throw new Error('Firestore not initialized');

    // Check if driver exists
    const driversRef = collection(database, 'driver_standings');
    const q = query(driversRef, where('name', '==', driverData.name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Update existing driver
      const driverDoc = querySnapshot.docs[0];
      await updateDoc(driverDoc.ref, {
        ...driverData,
        updatedAt: serverTimestamp(),
      });
      console.log('✓ Driver standing updated:', driverData.name);
    } else {
      // Create new driver
      await addDoc(driversRef, {
        ...driverData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log('✓ Driver standing created:', driverData.name);
    }

    return { success: true };
  } catch (error) {
    console.error('✗ Error updating driver standing:', error);
    throw error;
  }
};

// Add or update constructor standing (admin only)
export const updateConstructorStanding = async (constructorData: {
  name: string;
  points: number;
  position: number;
  positionChange?: number;
  wins?: number;
  podiums?: number;
  logo?: string;
}) => {
  try {
    const database = getDb();
    if (!database) throw new Error('Firestore not initialized');

    // Check if constructor exists
    const constructorsRef = collection(database, 'constructor_standings');
    const q = query(constructorsRef, where('name', '==', constructorData.name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Update existing constructor
      const constructorDoc = querySnapshot.docs[0];
      await updateDoc(constructorDoc.ref, {
        ...constructorData,
        updatedAt: serverTimestamp(),
      });
      console.log('✓ Constructor standing updated:', constructorData.name);
    } else {
      // Create new constructor
      await addDoc(constructorsRef, {
        ...constructorData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log('✓ Constructor standing created:', constructorData.name);
    }

    return { success: true };
  } catch (error) {
    console.error('✗ Error updating constructor standing:', error);
    throw error;
  }
};

export { getDb };

// ============================================
// PARLAY / MULTI-BET SYSTEM
// ============================================

export interface ParlaySelection {
  marketId: string;
  marketName: string;
  selection: string;
  odds: number;
}

export interface Parlay {
  id?: string;
  userId: string;
  selections: ParlaySelection[];
  combinedOdds: number;
  stakeAmount: number;
  potentialReturn: number;
  status: 'pending' | 'won' | 'lost';
  raceEvent: string;
  submissionTime: number;
  createdAt?: any;
  updatedAt?: any;
}

// Create a parlay bet
export const createParlay = async (userId: string, parlayData: {
  selections: ParlaySelection[];
  stakeAmount: number;
  raceEvent: string;
}) => {
  const endTimer = startTimer('createParlay');
  try {
    return await retryWithBackoff(async () => {
      const database = getDb();
      if (!database) throw new Error('Firestore not initialized');

    // Validate minimum 2 selections
    if (parlayData.selections.length < 2) {
      throw new Error('Parlay must have at least 2 selections');
    }

    // Validate maximum 5 selections
    if (parlayData.selections.length > 5) {
      throw new Error('Parlay can have maximum 5 selections');
    }

    // Calculate combined odds (multiply all odds, but cap at 5x)
    let combinedOdds = parlayData.selections.reduce((acc, sel) => acc * sel.odds, 1);
    combinedOdds = Math.min(combinedOdds, MAX_ODDS_MULTIPLIER); // Cap at 5x

    const potentialReturn = parlayData.stakeAmount * combinedOdds;

    // Validate betting limits
    if (parlayData.stakeAmount < MIN_BET_AMOUNT) {
      throw new Error(`Minimum bet amount is ${MIN_BET_AMOUNT} PitCoins`);
    }
    if (parlayData.stakeAmount > MAX_BET_AMOUNT) {
      throw new Error(`Maximum bet amount is ${MAX_BET_AMOUNT} PitCoins`);
    }
    if (potentialReturn > MAX_PAYOUT_PER_BET) {
      throw new Error(`Maximum payout is ${MAX_PAYOUT_PER_BET} PC (max ${MAX_ODDS_MULTIPLIER}x odds)`);
    }

    // Check user balance
    const userQuery = query(collection(database, 'users'), where('userId', '==', userId));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      throw new Error('User not found');
    }

    const userDoc = querySnapshot.docs[0];
    const currentBalance = userDoc.data().pitcoinBalance || 0;

    if (currentBalance < parlayData.stakeAmount) {
      throw new Error('Insufficient PitCoin balance');
    }

    // Create parlay record
    const parlayRef = await addDoc(collection(database, 'parlays'), {
      userId,
      selections: parlayData.selections,
      combinedOdds,
      stakeAmount: parlayData.stakeAmount,
      potentialReturn,
      raceEvent: parlayData.raceEvent,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      submissionTime: Date.now(),
    });

    // Deduct balance
    const newBalance = currentBalance - parlayData.stakeAmount;
    await updateDoc(userDoc.ref, {
      pitcoinBalance: newBalance,
      totalBets: (userDoc.data().totalBets || 0) + 1,
      lastBetAt: serverTimestamp(),
    });

      logInfo('Parlay created', { parlayId: parlayRef.id, userId, selectionsCount: parlayData.selections.length, combinedOdds });
      return { parlayId: parlayRef.id, newBalance, combinedOdds };
    });
  } catch (error) {
    logError('Error creating parlay', { userId, error });
    throw error;
  } finally {
    endTimer();
  }
};

// Get user's active parlays
export const getUserParlays = async (userId: string) => {
  try {
    const database = getDb();
    if (!database) return [];

    const parlaysQuery = query(
      collection(database, 'parlays'),
      where('userId', '==', userId),
      where('status', '==', 'pending')
    );
    const querySnapshot = await getDocs(parlaysQuery);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('✗ Error fetching parlays:', error);
    return [];
  }
};
