import { useState, useEffect } from 'react';
import { useBettingMarkets } from './useBettingMarkets';

interface BettingWindowTime {
  hours: number;
  minutes: number;
  isOpen: boolean;
  closingSoon: boolean; // Less than 1 hour remaining
}

export function useBettingWindow() {
  const { markets, loading } = useBettingMarkets();
  const [windowTime, setWindowTime] = useState<BettingWindowTime>({
    hours: 0,
    minutes: 0,
    isOpen: false,
    closingSoon: false,
  });

  useEffect(() => {
    const calculateWindowTime = () => {
      if (markets.length === 0) {
        setWindowTime({
          hours: 0,
          minutes: 0,
          isOpen: false,
          closingSoon: false,
        });
        return;
      }

      // Find the earliest closing market
      const now = Date.now();
      let earliestClosingTime = Infinity;

      markets.forEach(market => {
        if (market.startTime) {
          const closingTime = new Date(market.startTime).getTime();
          if (closingTime > now && closingTime < earliestClosingTime) {
            earliestClosingTime = closingTime;
          }
        }
      });

      if (earliestClosingTime === Infinity) {
        setWindowTime({
          hours: 0,
          minutes: 0,
          isOpen: false,
          closingSoon: false,
        });
        return;
      }

      const timeRemaining = earliestClosingTime - now;
      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const closingSoon = timeRemaining < 3600000; // Less than 1 hour

      setWindowTime({
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        isOpen: timeRemaining > 0,
        closingSoon,
      });
    };

    calculateWindowTime();
    const interval = setInterval(calculateWindowTime, 1000);

    return () => clearInterval(interval);
  }, [markets]);

  return { windowTime, loading };
}
