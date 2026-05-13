"use client";

import { Trophy, Timer, AlertTriangle, Gauge, Car, Thermometer, Wind, CloudSnow, Target, Zap, Lock } from "lucide-react";
import { useUserBalance } from "@/hooks/useUserData";
import { useAuth } from "@/lib/auth-context";
import { useBettingMarkets } from "@/hooks/useBettingMarkets";
import { logBet, getUserActiveBet } from "@/lib/firestore";
import { useState, useEffect } from "react";

// Icon mapping for different bet types
const iconMap: Record<string, any> = {
  trophy: Trophy,
  timer: Timer,
  alert: AlertTriangle,
  gauge: Gauge,
  car: Car,
  target: Target,
  zap: Zap,
};

// Color mapping for different bet types
const colorMap: Record<string, string> = {
  primary: 'primary',
  tertiary: 'tertiary',
  error: 'error',
  secondary: 'secondary',
};

export default function BettingArena() {
  const { balance, loading: balanceLoading, refreshBalance } = useUserBalance();
  const { user } = useAuth();
  const { markets, loading: marketsLoading, error: marketsError } = useBettingMarkets();
  const [betAmounts, setBetAmounts] = useState<Record<string, string>>({});
  const [betSelections, setBetSelections] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});
  const [userActiveBets, setUserActiveBets] = useState<Record<string, any>>({});
  const [loadingBets, setLoadingBets] = useState(true);

  // Check for user's active bets on each market
  useEffect(() => {
    const checkUserBets = async () => {
      if (!user || markets.length === 0) {
        setLoadingBets(false);
        return;
      }

      try {
        const betsPromises = markets.map(market => 
          getUserActiveBet(user.uid, market.id)
        );
        const betsResults = await Promise.all(betsPromises);
        
        const betsMap: Record<string, any> = {};
        markets.forEach((market, index) => {
          if (betsResults[index]) {
            betsMap[market.id] = betsResults[index];
          }
        });
        
        setUserActiveBets(betsMap);
      } catch (error) {
        console.error('Error checking user bets:', error);
      } finally {
        setLoadingBets(false);
      }
    };

    checkUserBets();
  }, [user, markets]);

  // Calculate time remaining for each market
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const newTimeRemaining: Record<string, number> = {};
      
      markets.forEach(market => {
        if (market.startTime) {
          const startTime = new Date(market.startTime).getTime();
          const now = Date.now();
          const remaining = Math.max(0, startTime - now);
          newTimeRemaining[market.id] = remaining;
        }
      });
      
      setTimeRemaining(newTimeRemaining);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [markets]);

  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  };

  const handleBetAmountChange = (marketId: string, value: string) => {
    setBetAmounts(prev => ({ ...prev, [marketId]: value }));
    setErrors(prev => ({ ...prev, [marketId]: '' }));
  };

  const handleBetSelectionChange = (marketId: string, value: string) => {
    setBetSelections(prev => ({ ...prev, [marketId]: value }));
  };

  const handlePlaceBet = async (market: any) => {
    if (!user) {
      setErrors(prev => ({ ...prev, [market.id]: 'Please sign in to place bets' }));
      return;
    }

    // Check if user already has an active bet on this market
    if (userActiveBets[market.id]) {
      setErrors(prev => ({ ...prev, [market.id]: 'You already have an active bet on this market' }));
      return;
    }

    const amount = parseFloat(betAmounts[market.id] || '0');
    const selection = betSelections[market.id];

    // Validation
    if (!selection || selection.trim() === '') {
      setErrors(prev => ({ ...prev, [market.id]: 'Please enter your prediction' }));
      return;
    }

    // RULE: Betting Limits (50-500 PitCoins)
    if (isNaN(amount) || amount < 50) {
      setErrors(prev => ({ ...prev, [market.id]: 'Minimum bet is 50 PC' }));
      return;
    }

    if (amount > 500) {
      setErrors(prev => ({ ...prev, [market.id]: 'Maximum bet is 500 PC' }));
      return;
    }

    if (amount > balance) {
      setErrors(prev => ({ ...prev, [market.id]: 'Insufficient balance' }));
      return;
    }

    try {
      setSubmitting(prev => ({ ...prev, [market.id]: true }));
      setErrors(prev => ({ ...prev, [market.id]: '' }));

      const odds = market.odds || 2.5;
      const potentialReturn = amount * odds;

      await logBet(user.uid, {
        marketId: market.id, // Pass marketId for locking
        marketType: market.betName,
        betType: market.betType || 'race-winner',
        selection: selection,
        stakeAmount: amount,
        odds: odds,
        potentialReturn: potentialReturn,
        raceEvent: market.raceEvent || 'MotoGP 2026',
      });

      // Clear form
      setBetAmounts(prev => ({ ...prev, [market.id]: '' }));
      setBetSelections(prev => ({ ...prev, [market.id]: '' }));
      
      // Mark this market as having an active bet
      const newBet = await getUserActiveBet(user.uid, market.id);
      setUserActiveBets(prev => ({ ...prev, [market.id]: newBet }));
      
      // Refresh balance
      await refreshBalance();

      alert(`Bet placed successfully! Potential return: ${potentialReturn.toLocaleString()} PC`);
    } catch (error: any) {
      setErrors(prev => ({ ...prev, [market.id]: error.message || 'Failed to place bet' }));
    } finally {
      setSubmitting(prev => ({ ...prev, [market.id]: false }));
    }
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName?.toLowerCase()] || Trophy;
  };

  const getColorClass = (colorName: string) => {
    return colorMap[colorName?.toLowerCase()] || 'primary';
  };

  // Get the earliest closing time for the hero section
  const earliestClosingTime = markets.length > 0 
    ? Math.min(...Object.values(timeRemaining))
    : 0;
  const heroTime = formatTimeRemaining(earliestClosingTime);

  return (
    <div className="bg-background text-on-surface overflow-x-hidden telemetry-grid min-h-screen">
      {/* Top Navigation */}
      <header className="fixed top-0 z-50 flex justify-between items-center w-full px-8 md:px-16 h-16 bg-background/80 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="flex items-center gap-4">
          <span className="font-headline text-xl font-black tracking-tighter text-primary">
            POLARIS
          </span>
          <div className="hidden md:flex items-center gap-6 ml-8">
            <a
              className="text-on-surface-variant font-mono text-[10px] uppercase tracking-[0.2em] hover:text-primary/80 transition-colors"
              href="/dashboard"
            >
              Dashboard
            </a>
            <a
              className="text-primary font-bold font-mono text-[10px] uppercase tracking-[0.2em]"
              href="/betting"
            >
              Betting
            </a>
            <a
              className="text-on-surface-variant font-mono text-[10px] uppercase tracking-[0.2em] hover:text-primary/80 transition-colors"
              href="/leaderboard"
            >
              Leaderboard
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-surface-variant rounded-full border border-primary/20">
            <span className="font-mono text-[12px] text-primary font-bold">
              {balanceLoading ? '...' : balance.toLocaleString()} PC
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-primary/40">
            <div className="w-full h-full flex items-center justify-center text-primary font-headline font-bold text-sm">
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-8 md:px-16 max-w-[1440px] mx-auto">
        {/* Hero Race Status */}
        <section className="mb-12">
          <div className="glass-card p-6 md:p-8 rounded-xl border-l-4 border-l-tertiary-container overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg
                className="w-[120px] h-[120px]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
              </svg>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-tertiary-container text-on-tertiary font-mono text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-tighter telemetry-pulse">
                    {markets.length > 0 ? 'Live Betting' : 'No Active Bets'}
                  </span>
                  <span className="text-on-surface-variant font-mono text-[12px] uppercase">
                    {markets.length} Active Market{markets.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <h1 className="font-headline text-5xl md:text-6xl text-on-surface uppercase italic font-black">
                  Betting Arena
                </h1>
                <p className="text-on-surface-variant max-w-xl text-lg">
                  Precision engineering meets high-stakes risk. Lock your
                  tactical predictions before the betting window closes.
                </p>
              </div>
              {markets.length > 0 && (
                <div className="flex flex-col items-end gap-2">
                  <span className="font-mono text-[12px] text-on-surface-variant uppercase">
                    Next Closing In
                  </span>
                  <div className="flex gap-2">
                    <div className="bg-surface-container-highest px-3 py-2 rounded border border-outline-variant/30">
                      <span className="font-mono text-2xl font-bold text-tertiary">
                        {String(heroTime.hours).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-outline-variant self-center">
                      :
                    </span>
                    <div className="bg-surface-container-highest px-3 py-2 rounded border border-outline-variant/30">
                      <span className="font-mono text-2xl font-bold text-tertiary">
                        {String(heroTime.minutes).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Loading State */}
        {marketsLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-on-surface-variant font-mono text-sm">Loading betting markets...</p>
          </div>
        )}

        {/* Error State */}
        {marketsError && (
          <div className="glass-card p-6 rounded-xl border-l-4 border-l-error text-center">
            <AlertTriangle className="w-12 h-12 text-error mx-auto mb-4" />
            <p className="text-error font-mono">{marketsError}</p>
          </div>
        )}

        {/* Empty State */}
        {!marketsLoading && !marketsError && markets.length === 0 && (
          <div className="glass-card p-12 rounded-xl text-center">
            <Target className="w-16 h-16 text-on-surface-variant mx-auto mb-4 opacity-50" />
            <h3 className="font-headline text-2xl text-on-surface mb-2">No Active Betting Markets</h3>
            <p className="text-on-surface-variant">
              Check back soon! New betting opportunities will be added by race control.
            </p>
          </div>
        )}

        {/* Betting Grid */}
        {!marketsLoading && markets.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map((market) => {
              const IconComponent = getIconComponent(market.icon || 'trophy');
              const colorClass = getColorClass(market.color || 'primary');
              const odds = market.odds || 2.5;
              const time = formatTimeRemaining(timeRemaining[market.id] || 0);
              const isClosed = (timeRemaining[market.id] || 0) <= 0;
              const userBet = userActiveBets[market.id];
              const isLocked = !!userBet;

              return (
                <div
                  key={market.id}
                  className={`glass-card group hover:border-${colorClass}/50 transition-all duration-300 p-6 rounded-xl flex flex-col justify-between ${
                    isClosed || isLocked ? 'opacity-75' : ''
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-12 h-12 rounded-lg bg-${colorClass}/10 flex items-center justify-center border border-${colorClass}/20`}>
                        {isLocked ? (
                          <Lock className={`text-${colorClass} w-6 h-6`} />
                        ) : (
                          <IconComponent className={`text-${colorClass} w-6 h-6`} />
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`bg-${colorClass}/20 text-${colorClass} font-mono text-xl px-3 py-1 rounded-full font-bold`}>
                          {odds}X
                        </span>
                        {!isClosed && !isLocked && (
                          <span className="text-on-surface-variant font-mono text-[10px]">
                            {time.hours}h {time.minutes}m
                          </span>
                        )}
                        {isLocked && (
                          <span className="text-tertiary font-mono text-[10px] uppercase">
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="font-headline text-2xl text-on-surface uppercase mb-2 font-bold">
                      {market.betName}
                    </h3>
                    {market.betType && market.betType !== 'race-winner' && (
                      <div className="mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-1 rounded bg-tertiary/20 text-tertiary">
                          {market.betType === 'podium' && '🏆 Top 3'}
                          {market.betType === 'top5' && '🏆 Top 5'}
                          {market.betType === 'fastest-lap' && '⚡ Fastest Lap'}
                          {market.betType === 'pole-position' && '🎯 Pole Position'}
                        </span>
                      </div>
                    )}
                    <p className="text-on-surface-variant text-base mb-4">
                      {market.summary}
                    </p>
                    {market.betType === 'podium' && (
                      <p className="text-[10px] text-tertiary font-mono mb-4">
                        💡 Predict the top 3 finishers in order
                      </p>
                    )}
                    {market.betType === 'top5' && (
                      <p className="text-[10px] text-tertiary font-mono mb-4">
                        💡 Predict the top 5 finishers in order
                      </p>
                    )}
                  </div>

                  {/* Show locked bet info */}
                  {isLocked && userBet && (
                    <div className="space-y-3 bg-surface-container-highest/50 p-4 rounded-lg border border-tertiary/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-tertiary" />
                        <span className="font-mono text-[12px] text-tertiary uppercase font-bold">
                          Your Active Bet
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant text-sm">Prediction:</span>
                          <span className="text-on-surface font-semibold">{userBet.selection}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant text-sm">Stake:</span>
                          <span className="text-primary font-mono font-bold">{userBet.stakeAmount} PC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant text-sm">Potential Return:</span>
                          <span className="text-tertiary font-mono font-bold">{userBet.potentialReturn?.toLocaleString()} PC</span>
                        </div>
                      </div>
                      <p className="text-on-surface-variant text-[10px] font-mono mt-3 text-center">
                        Wait for this bet to end before placing another
                      </p>
                    </div>
                  )}

                  {/* Show betting form if not locked */}
                  {!isLocked && (
                    <div className="space-y-4">
                      {/* Prediction Input */}
                      <div className="relative">
                        <input
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                          placeholder={
                            market.betType === 'podium' ? 'e.g., Jorge Martin, Pecco Bagnaia, Marc Marquez' :
                            market.betType === 'top5' ? 'e.g., Martin, Bagnaia, Marquez, Binder, Bastianini' :
                            market.betType === 'fastest-lap' ? 'e.g., Jorge Martin' :
                            market.betType === 'pole-position' ? 'e.g., Pecco Bagnaia' :
                            'Enter your prediction...'
                          }
                          type="text"
                          value={betSelections[market.id] || ''}
                          onChange={(e) => handleBetSelectionChange(market.id, e.target.value)}
                          disabled={isClosed || submitting[market.id] || loadingBets}
                        />
                        <label className="absolute -top-2 left-3 bg-background px-2 text-[10px] font-mono text-outline uppercase">
                          {market.betType === 'podium' ? 'Top 3 Riders (comma separated)' :
                           market.betType === 'top5' ? 'Top 5 Riders (comma separated)' :
                           'Your Prediction'}
                        </label>
                      </div>

                      {/* Amount Input */}
                      <div className="relative">
                        <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-mono text-${colorClass} font-bold`}>
                          PC
                        </span>
                        <input
                          className={`w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-4 pl-12 pr-4 font-mono text-xl text-on-surface focus:ring-2 focus:ring-${colorClass}/50 focus:border-${colorClass} outline-none transition-all`}
                          max="500"
                          min="50"
                          placeholder="0.00"
                          type="number"
                          value={betAmounts[market.id] || ''}
                          onChange={(e) => handleBetAmountChange(market.id, e.target.value)}
                          disabled={isClosed || submitting[market.id] || loadingBets}
                        />
                        <label className="absolute -top-2 left-3 bg-background px-2 text-[10px] font-mono text-outline uppercase">
                          Amount (50-500)
                        </label>
                      </div>

                      {/* Error Message */}
                      {errors[market.id] && (
                        <p className="text-error text-sm font-mono">{errors[market.id]}</p>
                      )}

                      {/* Submit Button */}
                      <button
                        onClick={() => handlePlaceBet(market)}
                        disabled={isClosed || submitting[market.id] || loadingBets}
                        className={`w-full py-4 ${
                          colorClass === 'primary'
                            ? 'bg-primary text-on-primary'
                            : `border border-${colorClass} text-${colorClass} hover:bg-${colorClass}/10`
                        } font-headline text-base uppercase italic tracking-tighter rounded-lg hover:brightness-110 active:scale-95 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isClosed
                          ? 'Betting Closed'
                          : loadingBets
                          ? 'Loading...'
                          : submitting[market.id]
                          ? 'Placing Bet...'
                          : 'Lock Prediction'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Wallet Stats Card */}
            <div className="bg-surface-container-high border border-outline-variant/20 p-6 rounded-xl flex flex-col justify-center items-center text-center">
              <span className="font-mono text-[12px] text-on-surface-variant uppercase mb-4 tracking-widest">
                Available Capital
              </span>
              <div className="flex items-baseline gap-2 mb-2">
                <h2 className="font-headline text-5xl text-primary font-black">
                  {balanceLoading ? '...' : balance.toLocaleString()}
                </h2>
                <span className="font-mono text-xl text-primary/60 font-bold">
                  PC
                </span>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full mt-6 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-tertiary-container transition-all duration-500"
                  style={{ width: `${Math.min((balance / 2000) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="mt-4 text-on-surface-variant font-mono text-[10px] uppercase">
                {Math.min(Math.round((balance / 2000) * 100), 100)}% of Starting Balance
              </p>
            </div>
          </section>
        )}

        {/* Race Info Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-4 rounded-lg flex items-center gap-4">
            <Thermometer className="text-tertiary w-6 h-6" />
            <div>
              <div className="text-on-surface-variant font-mono text-[10px] uppercase">
                Track Temp
              </div>
              <div className="font-mono text-xl font-bold">32.4°C</div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-lg flex items-center gap-4">
            <Wind className="text-tertiary w-6 h-6" />
            <div>
              <div className="text-on-surface-variant font-mono text-[10px] uppercase">
                Wind Speed
              </div>
              <div className="font-mono text-xl font-bold">14 KM/H</div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-lg flex items-center gap-4">
            <CloudSnow className="text-tertiary w-6 h-6" />
            <div>
              <div className="text-on-surface-variant font-mono text-[10px] uppercase">
                Precipitation
              </div>
              <div className="font-mono text-xl font-bold">0.0%</div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-full bg-surface-container-lowest/90 backdrop-blur-2xl border-t border-primary/10 shadow-[0_-8px_24px_rgba(238,183,207,0.1)] flex justify-around items-center h-20 px-4">
        <a href="/dashboard" className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
          <span className="font-mono text-[10px] uppercase mt-1">
            Dashboard
          </span>
        </a>
        <a href="/betting" className="flex flex-col items-center justify-center text-primary bg-primary/10 rounded-full px-4 py-1 active:scale-90 duration-150 ease-out">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
          </svg>
          <span className="font-mono text-[10px] uppercase mt-1">Betting</span>
        </a>
        <a href="/leaderboard" className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z" />
          </svg>
          <span className="font-mono text-[10px] uppercase mt-1">Leaders</span>
        </a>
        <a href="/victory" className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
          </svg>
          <span className="font-mono text-[10px] uppercase mt-1">Results</span>
        </a>
      </nav>
    </div>
  );
}
