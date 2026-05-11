"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserStats, getUserBalance, getUserBets } from '@/lib/firestore';

interface UserData {
  pitcoinBalance: number;
  totalBets: number;
  totalEarnings: number;
  totalWins: number;
  winRate: number;
  status: string;
  email: string;
}

interface Bet {
  id: string;
  marketType: string;
  selection: string;
  stakeAmount: number;
  odds: number;
  potentialReturn: number;
  raceEvent: string;
  status: 'pending' | 'won' | 'lost';
  createdAt: any;
}

export function useUserData() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const stats = await getUserStats(user.uid);
        if (stats) {
          setUserData(stats as UserData);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return { userData, loading, error };
}

export function useUserBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBalance(0);
      setLoading(false);
      return;
    }

    const fetchBalance = async () => {
      try {
        setLoading(true);
        const userBalance = await getUserBalance(user.uid);
        setBalance(userBalance);
      } catch (err) {
        console.error('Error fetching balance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [user]);

  const refreshBalance = async () => {
    if (!user) return;
    const userBalance = await getUserBalance(user.uid);
    setBalance(userBalance);
  };

  return { balance, loading, refreshBalance };
}

export function useUserBets() {
  const { user } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBets([]);
      setLoading(false);
      return;
    }

    const fetchBets = async () => {
      try {
        setLoading(true);
        const userBets = await getUserBets(user.uid);
        setBets(userBets as Bet[]);
      } catch (err) {
        console.error('Error fetching bets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, [user]);

  return { bets, loading };
}
