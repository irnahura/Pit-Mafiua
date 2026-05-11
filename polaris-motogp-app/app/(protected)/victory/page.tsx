"use client";

import { Award, Users, Settings, DollarSign, Gift } from "lucide-react";
import { useUserBalance } from "@/hooks/useUserData";

export default function VictoryPodium() {
  const { balance, loading } = useUserBalance();
  return (
    <div className="bg-background text-on-background overflow-x-hidden">
      {/* Top Navigation */}
      <header className="fixed top-0 z-[60] flex justify-between items-center w-full px-8 h-16 bg-background/80 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="font-headline text-xl font-black tracking-tighter text-primary">
          POLARIS
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-surface-variant/50 px-3 py-1.5 rounded-full flex items-center gap-2">
            <DollarSign className="text-primary w-4 h-4" />
            <span className="font-mono text-[12px] text-primary font-bold">
              {loading ? '...' : balance.toLocaleString()} PC
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-primary/30">
            <div className="w-full h-full flex items-center justify-center text-primary font-headline font-bold text-sm">
              U
            </div>
          </div>
        </div>
      </header>

      <main className="relative min-h-screen pt-16 pb-32 flex flex-col items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-tertiary/10 blur-[150px] rounded-full"></div>
          <div className="absolute inset-0 confetti-overlay opacity-30"></div>
        </div>

        <section className="relative z-10 w-full max-w-[1440px] px-8 flex flex-col items-center">
          {/* Title Section */}
          <div className="text-center mb-12">
            <span className="font-mono text-[12px] uppercase tracking-[0.3em] text-primary mb-4 block">
              Season Finale Victory
            </span>
            <h1 className="font-headline text-5xl md:text-6xl lg:text-[120px] uppercase text-on-background leading-none italic mb-2 victory-glow font-black">
              CHAMPION{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-primary">
                OF THE PIT
              </span>
            </h1>
          </div>

          {/* Podium Section */}
          <div className="relative w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            {/* Position 2 */}
            <div className="lg:col-span-3 flex flex-col items-center space-y-4 order-2 lg:order-1">
              <div className="glass-card w-full p-6 text-center rounded-xl">
                <span className="font-mono text-[12px] text-on-surface-variant mb-2 block uppercase">
                  Position
                </span>
                <div className="text-xl font-headline text-on-surface font-bold">
                  #2
                </div>
                <div className="text-base text-on-surface-variant">
                  Ghost_Rider
                </div>
              </div>
              <div className="w-full h-32 bg-surface-container-highest/40 rounded-t-xl border-x border-t border-outline-variant/30 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
              </div>
            </div>

            {/* Position 1 (Winner) */}
            <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
              <div className="relative w-full aspect-square max-w-[400px] mb-8 group">
                <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-pulse"></div>
                <div className="w-full h-full flex items-center justify-center relative z-10">
                  <Award
                    className="w-64 h-64 text-primary victory-glow"
                    strokeWidth={1}
                  />
                </div>
              </div>
              <div className="w-full h-56 bg-surface-container-highest rounded-t-xl border-x border-t border-primary/40 relative overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-primary via-tertiary to-primary"></div>
                <Award
                  className="text-primary w-16 h-16 mb-2"
                  fill="currentColor"
                />
                <div className="font-headline text-xl text-on-background font-bold">
                  YOU
                </div>
                <div className="font-mono text-[12px] text-primary uppercase">
                  Elite Tier Winner
                </div>
              </div>
            </div>

            {/* Position 3 */}
            <div className="lg:col-span-3 flex flex-col items-center space-y-4 order-3 lg:order-3">
              <div className="glass-card w-full p-6 text-center rounded-xl">
                <span className="font-mono text-[12px] text-on-surface-variant mb-2 block uppercase">
                  Position
                </span>
                <div className="text-xl font-headline text-on-surface font-bold">
                  #3
                </div>
                <div className="text-base text-on-surface-variant">
                  Nitro_Burn
                </div>
              </div>
              <div className="w-full h-24 bg-surface-container-highest/40 rounded-t-xl border-x border-t border-outline-variant/30 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tertiary/40 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <div className="glass-card p-8 rounded-xl flex flex-col items-center border-l-4 border-l-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <DollarSign className="w-20 h-20" />
              </div>
              <span className="font-mono text-[12px] text-on-surface-variant uppercase tracking-wider mb-2">
                Final PitCoin Balance
              </span>
              <div className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3 font-bold">
                {loading ? '...' : balance.toLocaleString()}
                <span className="font-mono text-[12px] bg-primary/10 px-2 py-1 rounded text-primary">
                  PC
                </span>
              </div>
            </div>
            <div className="glass-card p-8 rounded-xl flex flex-col items-center border-l-4 border-l-tertiary relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Gift className="w-20 h-20" />
              </div>
              <span className="font-mono text-[12px] text-on-surface-variant uppercase tracking-wider mb-2">
                Voucher Conversion (50%)
              </span>
              <div className="font-headline text-3xl md:text-4xl text-tertiary flex items-center gap-3 font-bold">
                ${loading ? '...' : ((balance * 0.5) / 2).toFixed(2)}
                <span className="font-mono text-[12px] bg-tertiary/10 px-2 py-1 rounded text-tertiary">
                  USD
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col md:flex-row gap-6 w-full max-w-4xl">
            <button className="flex-1 bg-gradient-to-r from-primary to-tertiary text-on-primary font-headline text-xl py-6 rounded-xl uppercase tracking-widest shadow-[0_0_30px_rgba(255,202,224,0.3)] hover:scale-[1.02] transition-transform active:scale-95 font-bold">
              Claim Your Rewards
            </button>
            <button className="px-12 border border-outline-variant py-6 rounded-xl font-headline text-xl uppercase tracking-widest hover:bg-surface-variant/50 transition-colors font-bold">
              Share Stats
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-full flex justify-around items-center h-20 px-4 bg-surface-container-lowest/90 backdrop-blur-2xl border-t border-primary/10 shadow-[0_-8px_24px_rgba(238,183,207,0.1)]">
        <a
          className="flex flex-col items-center justify-center text-primary bg-primary/10 rounded-full px-4 py-1 scale-90 duration-150 ease-out"
          href="/"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
          <span className="font-mono text-[10px] uppercase">Dashboard</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80"
          href="/betting"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
          </svg>
          <span className="font-mono text-[10px] uppercase">Betting</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80"
          href="/leaderboard"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z" />
          </svg>
          <span className="font-mono text-[10px] uppercase">Leaderboard</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80"
          href="#"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
          </svg>
          <span className="font-mono text-[10px] uppercase">Results</span>
        </a>
      </nav>

      {/* Desktop Side Navigation */}
      <div className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-8 z-50">
        <div className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center group-hover:bg-primary/20 transition-colors cursor-pointer">
            <Award className="text-primary w-6 h-6" />
          </div>
          <span className="font-mono text-[12px] opacity-0 group-hover:opacity-100 transition-opacity uppercase">
            League
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center group-hover:bg-primary/20 transition-colors cursor-pointer">
            <Users className="text-primary w-6 h-6" />
          </div>
          <span className="font-mono text-[12px] opacity-0 group-hover:opacity-100 transition-opacity uppercase">
            Crew
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center group-hover:bg-primary/20 transition-colors cursor-pointer">
            <Settings className="text-primary w-6 h-6" />
          </div>
          <span className="font-mono text-[12px] opacity-0 group-hover:opacity-100 transition-opacity uppercase">
            Settings
          </span>
        </div>
      </div>
    </div>
  );
}
