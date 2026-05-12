import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc, Firestore } from 'firebase/firestore';
import { getFirebaseApp } from './firebase';

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
    const database = getDb();
    if (!database) throw new Error('Firestore not initialized');

    await addDoc(collection(database, 'users'), {
      userId,
      email,
      createdAt: serverTimestamp(),
      pitcoinBalance: 2000, // Default starting balance
      totalBets: 0,
      totalEarnings: 0,
      totalWins: 0,
      winRate: 0,
      status: 'active',
    });
    console.log('✓ User logged in Firestore:', userId);
  } catch (error) {
    console.error('✗ Error logging user:', error);
  }
};

// Bet logging with PitCoin deduction
export const logBet = async (userId: string, betData: {
  marketType: string;
  selection: string;
  stakeAmount: number;
  odds: number;
  potentialReturn: number;
  raceEvent: string;
}) => {
  try {
    const database = getDb();
    if (!database) throw new Error('Firestore not initialized');

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

    // Create bet record
    const betRef = await addDoc(collection(database, 'bets'), {
      userId,
      marketType: betData.marketType,
      selection: betData.selection,
      stakeAmount: betData.stakeAmount,
      odds: betData.odds,
      potentialReturn: betData.potentialReturn,
      raceEvent: betData.raceEvent,
      status: 'pending', // pending, won, lost
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Deduct PitCoin from user balance
    const newBalance = currentBalance - betData.stakeAmount;
    await updateDoc(userDoc.ref, {
      pitcoinBalance: newBalance,
      totalBets: (userDoc.data().totalBets || 0) + 1,
      lastBetAt: serverTimestamp(),
    });

    console.log('✓ Bet logged:', betRef.id);
    console.log(`✓ PitCoin deducted. New balance: ${newBalance}`);
    return { betId: betRef.id, newBalance };
  } catch (error) {
    console.error('✗ Error logging bet:', error);
    throw error;
  }
};

// Get user's current PitCoin balance
export const getUserBalance = async (userId: string): Promise<number> => {
  try {
    const database = getDb();
    if (!database) return 0;

    const userQuery = query(collection(database, 'users'), where('userId', '==', userId));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().pitcoinBalance || 0;
    }
    return 0;
  } catch (error) {
    console.error('✗ Error fetching user balance:', error);
    return 0;
  }
};

// Update bet result and adjust balance if won
export const updateBetResult = async (betId: string, result: 'won' | 'lost', userId?: string) => {
  try {
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

    console.log('✓ Bet result updated:', betId);
  } catch (error) {
    console.error('✗ Error updating bet result:', error);
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

// Get leaderboard
export const getLeaderboard = async (limit: number = 10) => {
  try {
    const database = getDb();
    if (!database) return [];

    const usersRef = collection(database, 'users');
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (b.totalEarnings || 0) - (a.totalEarnings || 0))
      .slice(0, limit);

    return users;
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
}) => {
  try {
    const database = getDb();
    if (!database) throw new Error('Firestore not initialized');

    const marketRef = await addDoc(collection(database, 'betting_markets'), {
      ...marketData,
      status: 'open',
      createdAt: serverTimestamp(),
      totalStake: 0,
      participantCount: 0,
    });

    console.log('✓ Betting market created:', marketRef.id);
    return { marketId: marketRef.id };
  } catch (error) {
    console.error('✗ Error creating betting market:', error);
    throw error;
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

export { getDb };
