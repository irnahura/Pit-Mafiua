"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function RaceCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = (): TimeLeft => {
      // Race date: May 13, 2026 at 00:00:00
      const raceDate = new Date('2026-05-13T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = raceDate - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex gap-2 font-headline text-2xl text-primary tracking-widest font-bold">
        <div>
          --<span className="text-xs ml-1 font-mono opacity-50 uppercase">D</span>
        </div>
        <div>
          --<span className="text-xs ml-1 font-mono opacity-50 uppercase">H</span>
        </div>
        <div>
          --<span className="text-xs ml-1 font-mono opacity-50 uppercase">M</span>
        </div>
        <div>
          --<span className="text-xs ml-1 font-mono opacity-50 uppercase">S</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 md:gap-4 font-headline text-xl md:text-2xl text-primary tracking-widest font-bold">
      <div>
        {String(timeLeft.days).padStart(2, '0')}
        <span className="text-xs ml-1 font-mono opacity-50 uppercase">D</span>
      </div>
      <div>
        {String(timeLeft.hours).padStart(2, '0')}
        <span className="text-xs ml-1 font-mono opacity-50 uppercase">H</span>
      </div>
      <div>
        {String(timeLeft.minutes).padStart(2, '0')}
        <span className="text-xs ml-1 font-mono opacity-50 uppercase">M</span>
      </div>
      <div>
        {String(timeLeft.seconds).padStart(2, '0')}
        <span className="text-xs ml-1 font-mono opacity-50 uppercase">S</span>
      </div>
    </div>
  );
}
