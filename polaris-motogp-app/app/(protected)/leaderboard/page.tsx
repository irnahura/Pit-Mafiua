"use client";

import { TrendingUp, TrendingDown, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";

export default function Leaderboard() {
  const { leaderboard, loading, error } = useLeaderboard(50);
  return (
    <div className="bg-background text-on-background min-h-screen pb-32 telemetry-grid">
      {/* Top Navigation */}
      <header className="sticky top-0 z-[60] bg-background/80 backdrop-blur-xl border-b border-outline-variant/20 flex justify-between items-center w-full px-8 md:px-16 h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden border border-primary/20">
            <div className="w-full h-full flex items-center justify-center text-primary font-headline font-bold text-sm">
              U
            </div>
          </div>
          <span className="font-headline text-xl font-black tracking-tighter text-primary">
            POLARIS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-surface-container rounded-full border border-outline-variant/30">
            <span className="font-mono text-[12px] text-primary font-bold">
              2,450 PC
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-8 md:px-16 py-8">
        {/* Hero Section / Title */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></span>
            <span className="font-mono text-[12px] uppercase tracking-widest text-tertiary">
              Live Telemetry
            </span>
          </div>
          <h1 className="font-headline text-5xl md:text-6xl italic uppercase font-black">
            Global Leaderboard
          </h1>
          <p className="text-on-surface-variant max-w-2xl mt-4 text-lg">
            Real-time ranking of the Polaris elite. Every prediction brings you
            closer to the podium. Momentum is everything.
          </p>
        </div>

        {/* Podium Section */}
        {loading ? (
          <div className="text-center py-16">
            <div className="font-mono text-white/40">Loading leaderboard...</div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="font-mono text-error">{error}</div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-16">
            <div className="font-mono text-white/40">No leaderboard data available yet.</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-end">
              {/* Rank 2 */}
              {leaderboard[1] && (
                <div className="order-2 md:order-1 glass-card p-8 rounded-xl podium-glow-2 border-b-4 border-tertiary/40 transform hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-full border-2 border-tertiary p-1">
                        <div className="w-full h-full rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary font-headline text-2xl font-bold">
                          {leaderboard[1].email?.[0]?.toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-tertiary text-on-tertiary font-headline text-xl px-4 py-0.5 rounded-full skew-x-[-12deg] font-bold">
                        2
                      </div>
                    </div>
                    <h3 className="font-headline text-2xl text-on-surface mb-1 font-bold uppercase truncate w-full">
                      {leaderboard[1].email?.split('@')[0] || 'User'}
                    </h3>
                    <p className="font-mono text-[12px] text-tertiary uppercase mb-4 tracking-[0.2em]">
                      {leaderboard[1].totalWins || 0} Correct Predictions
                    </p>
                    <div className="w-full py-3 bg-tertiary/10 rounded border border-tertiary/20">
                      <span className="font-mono text-xl text-tertiary font-bold">
                        {(leaderboard[1].pitcoinBalance || 0).toLocaleString()} PC
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Rank 1 */}
              {leaderboard[0] && (
                <div className="order-1 md:order-2 glass-card p-10 rounded-xl podium-glow-1 border-b-4 border-primary transform hover:-translate-y-4 transition-transform duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <Award className="text-primary w-10 h-10" fill="currentColor" />
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 rounded-full border-4 border-primary p-1.5 bg-gradient-to-tr from-primary/20 to-transparent">
                        <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-primary font-headline text-4xl font-black">
                          {leaderboard[0].email?.[0]?.toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-headline text-xl px-6 py-1 rounded-full skew-x-[-12deg] shadow-lg shadow-primary/20 font-bold">
                        1
                      </div>
                    </div>
                    <h3 className="font-headline text-3xl md:text-4xl text-on-surface mb-1 font-bold uppercase truncate w-full">
                      {leaderboard[0].email?.split('@')[0] || 'User'}
                    </h3>
                    <p className="font-mono text-[12px] text-primary uppercase mb-6 tracking-[0.2em]">
                      {leaderboard[0].totalWins || 0} Correct Predictions
                    </p>
                    <div className="w-full py-4 bg-primary/20 rounded border border-primary/30">
                      <span className="font-mono text-3xl md:text-4xl text-primary font-black">
                        {(leaderboard[0].pitcoinBalance || 0).toLocaleString()} PC
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Rank 3 */}
              {leaderboard[2] && (
                <div className="order-3 glass-card p-8 rounded-xl podium-glow-3 border-b-4 border-secondary/40 transform hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-full border-2 border-secondary p-1">
                        <div className="w-full h-full rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-headline text-2xl font-bold">
                          {leaderboard[2].email?.[0]?.toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary font-headline text-xl px-4 py-0.5 rounded-full skew-x-[-12deg] font-bold">
                        3
                      </div>
                    </div>
                    <h3 className="font-headline text-2xl text-on-surface mb-1 font-bold uppercase truncate w-full">
                      {leaderboard[2].email?.split('@')[0] || 'User'}
                    </h3>
                    <p className="font-mono text-[12px] text-secondary uppercase mb-4 tracking-[0.2em]">
                      {leaderboard[2].totalWins || 0} Correct Predictions
                    </p>
                    <div className="w-full py-3 bg-secondary/10 rounded border border-secondary/20">
                      <span className="font-mono text-xl text-secondary font-bold">
                        {(leaderboard[2].pitcoinBalance || 0).toLocaleString()} PC
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* F1 Style Timing Board */}
        <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
          <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-surface-container-highest/50 border-b border-outline-variant/20 font-mono text-[12px] text-on-surface-variant uppercase tracking-widest">
            <div className="col-span-1">Pos</div>
            <div className="col-span-1">Trend</div>
            <div className="col-span-4">User Identity</div>
            <div className="col-span-2 text-right">Accuracy</div>
            <div className="col-span-4 text-right">PitCoins</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-outline-variant/10">
            {loading ? (
              <div className="px-8 py-12 text-center font-mono text-white/40">
                Loading leaderboard data...
              </div>
            ) : leaderboard.slice(3).length === 0 ? (
              <div className="px-8 py-12 text-center font-mono text-white/40">
                No additional players yet
              </div>
            ) : (
              leaderboard.slice(3, 20).map((entry, index) => (
                <div key={entry.id} className="grid grid-cols-12 gap-4 px-8 py-5 telemetry-row items-center transition-colors">
                  <div className="col-span-1 font-mono text-xl text-on-surface-variant italic font-bold">
                    {String(index + 4).padStart(2, '0')}
                  </div>
                  <div className="col-span-1">
                    {index % 2 === 0 ? (
                      <TrendingUp className="text-secondary w-6 h-6" />
                    ) : index % 3 === 0 ? (
                      <TrendingDown className="text-error w-6 h-6" />
                    ) : (
                      <span className="text-on-surface-variant opacity-30">—</span>
                    )}
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden flex items-center justify-center">
                      <span className="text-primary font-headline text-sm font-bold">
                        {entry.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="font-headline text-xl text-on-surface uppercase tracking-tight font-bold truncate">
                      {entry.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <div className="col-span-2 text-right font-mono text-on-surface">
                    {entry.totalWins || 0} / {entry.totalBets || 0}
                  </div>
                  <div className="col-span-4 text-right font-mono text-xl text-primary tracking-tighter font-bold">
                    {(entry.pitcoinBalance || 0).toLocaleString()} <span className="text-xs ml-1 opacity-50">PC</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Pagination */}
          <div className="bg-surface-container-lowest/80 px-8 py-4 flex justify-between items-center border-t border-outline-variant/20">
            <span className="font-mono text-[12px] text-on-surface-variant">
              Showing 1-{Math.min(leaderboard.length, 20)} of {leaderboard.length} Players
            </span>
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center border border-outline-variant/30 rounded hover:bg-surface-variant/50 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-primary/10 border border-primary/30 rounded text-primary font-mono font-bold">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-outline-variant/30 rounded hover:bg-surface-variant/50 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-full bg-surface-container-lowest/90 backdrop-blur-2xl border-t border-primary/10 shadow-[0_-8px_24px_rgba(238,183,207,0.1)] flex justify-around items-center h-20 px-4">
        <a
          className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80 transition-colors"
          href="/"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
          <span className="font-mono text-[10px] uppercase mt-1">Dashboard</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80 transition-colors"
          href="/betting"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
          </svg>
          <span className="font-mono text-[10px] uppercase mt-1">Betting</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-primary bg-primary/10 rounded-full px-4 py-1 active:scale-90 duration-150 ease-out"
          href="/leaderboard"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z" />
          </svg>
          <span className="font-mono text-[10px] uppercase mt-1">
            Leaderboard
          </span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80 transition-colors"
          href="#"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
          </svg>
          <span className="font-mono text-[10px] uppercase mt-1">Results</span>
        </a>
      </nav>

      {/* Desktop Navigation Side Anchors */}
      <div className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 flex-col gap-6 p-6 z-40">
        <div className="glass-card p-3 rounded-full flex flex-col gap-8 border-primary/20">
          <a
            href="/"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
          </a>
          <a
            href="/betting"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
            </svg>
          </a>
          <a
            href="/leaderboard"
            className="text-primary bg-primary/10 p-2 rounded-full"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
