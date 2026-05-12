"use client";

import { Trophy, Timer, AlertTriangle, Gauge, Car, Thermometer, Wind, CloudSnow } from "lucide-react";
import { useUserBalance } from "@/hooks/useUserData";
import { useAuth } from "@/lib/auth-context";
import { logBet } from "@/lib/firestore";
import { useState } from "react";

export default function BettingArena() {
  const { balance, loading: balanceLoading, refreshBalance } = useUserBalance();
  const { user } = useAuth();
  const [betAmounts] = useState<Record<string, string>>({});
  const [submitting] = useState<Record<string, boolean>>({});
  const [errors] = useState<Record<string, string>>({});

  // Betting functionality ready for future implementation
  // Users can view their balance and betting categories
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
              U
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
                    Live Telemetry
                  </span>
                  <span className="text-on-surface-variant font-mono text-[12px] uppercase">
                    Circuit: Suzuka International
                  </span>
                </div>
                <h1 className="font-headline text-5xl md:text-6xl text-on-surface uppercase italic font-black">
                  Grand Prix Final
                </h1>
                <p className="text-on-surface-variant max-w-xl text-lg">
                  Precision engineering meets high-stakes risk. Lock your
                  tactical predictions before the engines roar at the starting
                  line.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-mono text-[12px] text-on-surface-variant uppercase">
                  Betting Closes In
                </span>
                <div className="flex gap-2">
                  <div className="bg-surface-container-highest px-3 py-2 rounded border border-outline-variant/30">
                    <span className="font-mono text-2xl font-bold text-tertiary">
                      08
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-outline-variant self-center">
                    :
                  </span>
                  <div className="bg-surface-container-highest px-3 py-2 rounded border border-outline-variant/30">
                    <span className="font-mono text-2xl font-bold text-tertiary">
                      42
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Betting Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Category: Race Winner */}
          <div className="glass-card group hover:border-primary/50 transition-all duration-300 p-6 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Trophy className="text-primary w-6 h-6" />
                </div>
                <span className="bg-primary/20 text-primary font-mono text-xl px-3 py-1 rounded-full font-bold">
                  5X
                </span>
              </div>
              <h3 className="font-headline text-2xl text-on-surface uppercase mb-2 font-bold">
                Race Winner
              </h3>
              <p className="text-on-surface-variant text-base mb-8">
                Predict the ultimate champion of the Suzuka Grand Prix Circuit.
              </p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-primary font-bold">
                  PC
                </span>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-4 pl-12 pr-4 font-mono text-xl text-on-surface focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  max="500"
                  min="50"
                  placeholder="0.00"
                  type="number"
                />
                <label className="absolute -top-2 left-3 bg-background px-2 text-[10px] font-mono text-outline uppercase">
                  Amount (50-500)
                </label>
              </div>
              <button className="w-full py-4 bg-primary text-on-primary font-headline text-base uppercase italic tracking-tighter rounded-lg hover:brightness-110 active:scale-95 transition-all font-bold">
                Lock Prediction
              </button>
            </div>
          </div>

          {/* Category: Fastest Lap */}
          <div className="glass-card group hover:border-tertiary/50 transition-all duration-300 p-6 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center border border-tertiary/20">
                  <Timer className="text-tertiary w-6 h-6" />
                </div>
                <span className="bg-tertiary/20 text-tertiary font-mono text-xl px-3 py-1 rounded-full font-bold">
                  3X
                </span>
              </div>
              <h3 className="font-headline text-2xl text-on-surface uppercase mb-2 font-bold">
                Fastest Lap
              </h3>
              <p className="text-on-surface-variant text-base mb-8">
                Identify the rider who will clock the absolute minimum lap
                time.
              </p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-tertiary font-bold">
                  PC
                </span>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-4 pl-12 pr-4 font-mono text-xl text-on-surface focus:ring-2 focus:ring-tertiary/50 focus:border-tertiary outline-none transition-all"
                  max="500"
                  min="50"
                  placeholder="0.00"
                  type="number"
                />
                <label className="absolute -top-2 left-3 bg-background px-2 text-[10px] font-mono text-outline uppercase">
                  Amount (50-500)
                </label>
              </div>
              <button className="w-full py-4 border border-tertiary text-tertiary font-headline text-base uppercase italic tracking-tighter rounded-lg hover:bg-tertiary/10 active:scale-95 transition-all font-bold">
                Lock Prediction
              </button>
            </div>
          </div>

          {/* Category: Most Accidents */}
          <div className="glass-card group hover:border-error/50 transition-all duration-300 p-6 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center border border-error/20">
                  <AlertTriangle className="text-error w-6 h-6" />
                </div>
                <span className="bg-error/20 text-error font-mono text-xl px-3 py-1 rounded-full font-bold">
                  3X
                </span>
              </div>
              <h3 className="font-headline text-2xl text-on-surface uppercase mb-2 font-bold">
                Most Accidents
              </h3>
              <p className="text-on-surface-variant text-base mb-8">
                Predict which aggressive rider will face the most incidents
                today.
              </p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-error font-bold">
                  PC
                </span>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-4 pl-12 pr-4 font-mono text-xl text-on-surface focus:ring-2 focus:ring-error/50 focus:border-error outline-none transition-all"
                  max="500"
                  min="50"
                  placeholder="0.00"
                  type="number"
                />
                <label className="absolute -top-2 left-3 bg-background px-2 text-[10px] font-mono text-outline uppercase">
                  Amount (50-500)
                </label>
              </div>
              <button className="w-full py-4 border border-error text-error font-headline text-base uppercase italic tracking-tighter rounded-lg hover:bg-error/10 active:scale-95 transition-all font-bold">
                Lock Prediction
              </button>
            </div>
          </div>

          {/* Category: Slowest Lap */}
          <div className="glass-card group hover:border-secondary/50 transition-all duration-300 p-6 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20">
                  <Gauge className="text-secondary w-6 h-6" />
                </div>
                <span className="bg-secondary/20 text-secondary font-mono text-xl px-3 py-1 rounded-full font-bold">
                  2X
                </span>
              </div>
              <h3 className="font-headline text-2xl text-on-surface uppercase mb-2 font-bold">
                Slowest Lap
              </h3>
              <p className="text-on-surface-variant text-base mb-8">
                The underdog prediction. Identify the maximum registered lap
                time.
              </p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-secondary font-bold">
                  PC
                </span>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-4 pl-12 pr-4 font-mono text-xl text-on-surface focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                  max="500"
                  min="50"
                  placeholder="0.00"
                  type="number"
                />
                <label className="absolute -top-2 left-3 bg-background px-2 text-[10px] font-mono text-outline uppercase">
                  Amount (50-500)
                </label>
              </div>
              <button className="w-full py-4 border border-secondary text-secondary font-headline text-base uppercase italic tracking-tighter rounded-lg hover:bg-secondary/10 active:scale-95 transition-all font-bold">
                Lock Prediction
              </button>
            </div>
          </div>

          {/* Category: Trash Car */}
          <div className="glass-card group hover:border-primary/50 transition-all duration-300 p-6 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Car className="text-primary w-6 h-6" />
                </div>
                <span className="bg-primary/20 text-primary font-mono text-xl px-3 py-1 rounded-full font-bold">
                  5X
                </span>
              </div>
              <h3 className="font-headline text-2xl text-on-surface uppercase mb-2 font-bold">
                Trash Car
              </h3>
              <p className="text-on-surface-variant text-base mb-8">
                High risk: Predict the machine that will suffer total engine
                failure.
              </p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-primary font-bold">
                  PC
                </span>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-4 pl-12 pr-4 font-mono text-xl text-on-surface focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  max="500"
                  min="50"
                  placeholder="0.00"
                  type="number"
                />
                <label className="absolute -top-2 left-3 bg-background px-2 text-[10px] font-mono text-outline uppercase">
                  Amount (50-500)
                </label>
              </div>
              <button className="w-full py-4 bg-primary text-on-primary font-headline text-base uppercase italic tracking-tighter rounded-lg hover:brightness-110 active:scale-95 transition-all font-bold">
                Lock Prediction
              </button>
            </div>
          </div>

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
        <button className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
          <span className="font-mono text-[10px] uppercase mt-1">
            Dashboard
          </span>
        </button>
        <button className="flex flex-col items-center justify-center text-primary bg-primary/10 rounded-full px-4 py-1 active:scale-90 duration-150 ease-out">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
          </svg>
          <span className="font-mono text-[10px] uppercase mt-1">Betting</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z" />
          </svg>
          <span className="font-mono text-[10px] uppercase mt-1">Leaders</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
          </svg>
          <span className="font-mono text-[10px] uppercase mt-1">Results</span>
        </button>
      </nav>
    </div>
  );
}
