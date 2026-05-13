"use client";

import { useEffect, useState } from 'react';
import { getLeaderboard } from '@/lib/firestore';

interface LeaderboardEntry {
  id: string;
  userId: string;
  email: string;
  pitcoinBalance: number;
  totalEarnings: number;
  totalWins: number;
  totalBets: number;
  winRate: number;
  status?: string;
  correctPredictions?: number;
  hasRaceWinnerCorrect?: boolean;
  earliestBetTime?: number;
  createdAt?: any;
}

export function useLeaderboard(limit: number = 1000) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard(limit);
        setLeaderboard(data as LeaderboardEntry[]);
        setError(null);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Refresh leaderboard every 5 seconds for real-time updates
    const interval = setInterval(fetchLeaderboard, 5000);

    return () => clearInterval(interval);
  }, [limit]);

  const refreshLeaderboard = async () => {
    try {
      const data = await getLeaderboard(limit);
      setLeaderboard(data as LeaderboardEntry[]);
    } catch (err) {
      console.error('Error refreshing leaderboard:', err);
    }
  };

  return { leaderboard, loading, error, refreshLeaderboard };
}
