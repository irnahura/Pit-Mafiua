// Batched Firestore operations for better performance

import { writeBatch, doc, collection, updateDoc, DocumentReference } from 'firebase/firestore';
import { getDb } from './firestore';
import { logInfo, logError } from './logger';
import { retryWithBackoff } from './retry';

/**
 * Batch update multiple documents
 * Firestore allows max 500 operations per batch
 */
export async function batchUpdateDocuments(
  updates: Array<{ ref: DocumentReference; data: any }>
): Promise<void> {
  const database = getDb();
  if (!database) throw new Error('Firestore not initialized');

  const BATCH_SIZE = 500;
  const batches: Array<Array<typeof updates[0]>> = [];

  // Split into batches of 500
  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    batches.push(updates.slice(i, i + BATCH_SIZE));
  }

  try {
    await retryWithBackoff(async () => {
      for (const batch of batches) {
        const writeBatchOp = writeBatch(database);

        batch.forEach(({ ref, data }) => {
          writeBatchOp.update(ref, data);
        });

        await writeBatchOp.commit();
      }

      logInfo('Batch update completed', { 
        totalUpdates: updates.length, 
        batchCount: batches.length 
      });
    });
  } catch (error) {
    logError('Batch update failed', { error, updateCount: updates.length });
    throw error;
  }
}

/**
 * Batch settle multiple bets
 * Used for finalizing race results
 */
export async function batchSettleBets(
  betIds: string[],
  result: 'won' | 'lost'
): Promise<void> {
  const database = getDb();
  if (!database) throw new Error('Firestore not initialized');

  const updates = betIds.map(betId => ({
    ref: doc(database, 'bets', betId),
    data: {
      status: result,
      updatedAt: new Date(),
    },
  }));

  await batchUpdateDocuments(updates);
  logInfo('Batch bet settlement completed', { betCount: betIds.length, result });
}

/**
 * Batch update user balances
 * Used for mass payouts or adjustments
 */
export async function batchUpdateUserBalances(
  userUpdates: Array<{ userId: string; balanceChange: number }>
): Promise<void> {
  const database = getDb();
  if (!database) throw new Error('Firestore not initialized');

  try {
    await retryWithBackoff(async () => {
      const BATCH_SIZE = 500;
      
      for (let i = 0; i < userUpdates.length; i += BATCH_SIZE) {
        const batch = writeBatch(database);
        const chunk = userUpdates.slice(i, i + BATCH_SIZE);

        chunk.forEach(({ userId, balanceChange }) => {
          const userRef = doc(database, 'users', userId);
          batch.update(userRef, {
            pitcoinBalance: balanceChange,
            updatedAt: new Date(),
          });
        });

        await batch.commit();
      }

      logInfo('Batch balance update completed', { userCount: userUpdates.length });
    });
  } catch (error) {
    logError('Batch balance update failed', { error, userCount: userUpdates.length });
    throw error;
  }
}

/**
 * Batch create documents
 * Used for bulk data imports
 */
export async function batchCreateDocuments(
  collectionName: string,
  documents: any[]
): Promise<void> {
  const database = getDb();
  if (!database) throw new Error('Firestore not initialized');

  try {
    await retryWithBackoff(async () => {
      const BATCH_SIZE = 500;
      
      for (let i = 0; i < documents.length; i += BATCH_SIZE) {
        const batch = writeBatch(database);
        const chunk = documents.slice(i, i + BATCH_SIZE);

        chunk.forEach((docData) => {
          const docRef = doc(collection(database, collectionName));
          batch.set(docRef, {
            ...docData,
            createdAt: new Date(),
          });
        });

        await batch.commit();
      }

      logInfo('Batch create completed', { 
        collection: collectionName, 
        documentCount: documents.length 
      });
    });
  } catch (error) {
    logError('Batch create failed', { 
      error, 
      collection: collectionName, 
      documentCount: documents.length 
    });
    throw error;
  }
}

/**
 * Batch delete documents
 * Used for cleanup operations
 */
export async function batchDeleteDocuments(
  collectionName: string,
  documentIds: string[]
): Promise<void> {
  const database = getDb();
  if (!database) throw new Error('Firestore not initialized');

  try {
    await retryWithBackoff(async () => {
      const BATCH_SIZE = 500;
      
      for (let i = 0; i < documentIds.length; i += BATCH_SIZE) {
        const batch = writeBatch(database);
        const chunk = documentIds.slice(i, i + BATCH_SIZE);

        chunk.forEach((docId) => {
          const docRef = doc(database, collectionName, docId);
          batch.delete(docRef);
        });

        await batch.commit();
      }

      logInfo('Batch delete completed', { 
        collection: collectionName, 
        documentCount: documentIds.length 
      });
    });
  } catch (error) {
    logError('Batch delete failed', { 
      error, 
      collection: collectionName, 
      documentCount: documentIds.length 
    });
    throw error;
  }
}

/**
 * Example usage for settling all bets for a market
 */
export async function settleMarketBets(
  marketId: string,
  winningBetIds: string[],
  losingBetIds: string[]
): Promise<void> {
  try {
    // Settle winning bets
    if (winningBetIds.length > 0) {
      await batchSettleBets(winningBetIds, 'won');
    }

    // Settle losing bets
    if (losingBetIds.length > 0) {
      await batchSettleBets(losingBetIds, 'lost');
    }

    logInfo('Market settlement completed', {
      marketId,
      winnersCount: winningBetIds.length,
      losersCount: losingBetIds.length,
    });
  } catch (error) {
    logError('Market settlement failed', { marketId, error });
    throw error;
  }
}
