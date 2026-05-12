import { useState, useEffect } from 'react';
import { getDriverStandings, getConstructorStandings } from '@/lib/firestore';

export interface Driver {
  id: string;
  name: string;
  team: string;
  points: number;
  position: number;
  positionChange: number;
  consistency: number;
  avgPosition: string;
  avatar?: string;
  nationality?: string;
}

export interface Constructor {
  id: string;
  name: string;
  points: number;
  position: number;
  positionChange: number;
  wins: number;
  podiums: number;
  logo?: string;
}

export function useStandings() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const [driversData, constructorsData] = await Promise.all([
          getDriverStandings(),
          getConstructorStandings(),
        ]);
        
        setDrivers(driversData as Driver[]);
        setConstructors(constructorsData as Constructor[]);
        setError(null);
      } catch (err) {
        console.error('Error fetching standings:', err);
        setError('Failed to load standings');
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();

    // Refresh every 60 seconds
    const interval = setInterval(fetchStandings, 60000);

    return () => clearInterval(interval);
  }, []);

  return { drivers, constructors, loading, error };
}
