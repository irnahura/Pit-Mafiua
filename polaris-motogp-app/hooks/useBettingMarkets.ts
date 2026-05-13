import { useState, useEffect } from 'react';
import { getActiveBettingMarkets } from '@/lib/firestore';

export interface BettingMarket {
  id: string;
  betName: string;
  summary: string;
  startTime: string;
  duration: string;
  raceEvent: string;
  status: string;
  odds?: number;
  icon?: string;
  color?: string;
  createdAt?: any;
}

export function useBettingMarkets() {
  const [markets, setMarkets] = useState<BettingMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const data = await getActiveBettingMarkets();
      setMarkets(data as BettingMarket[]);
      setError(null);
    } catch (err) {
      console.error('Error fetching betting markets:', err);
      setError('Failed to load betting markets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMarkets, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { markets, loading, error, refreshMarkets: fetchMarkets };
}
