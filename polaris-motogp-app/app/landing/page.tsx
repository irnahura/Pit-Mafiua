"use client";

import { Zap, Star, Wallet, Info, Share2, Globe } from "lucide-react";
import RaceCountdown from "@/components/RaceCountdown";

export default function LandingPage() {
  return (
    <div className="bg-background text-on-background overflow-x-hidden telemetry-grid">
      <main className="pt-0">
        {/* Hero Section */}
        <section className="relative min-h-[795px] flex items-center justify-center px-8 md:px-16 overflow-hidden">
          {/* Background gradient - hero-gradient class */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at center, rgba(238, 183, 207, 0.1) 0%, rgba(22, 18, 20, 1) 100%)'
          }}></div>
          
          {/* Background image */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920')] bg-cover bg-center grayscale brightness-50 contrast-125"></div>
          </div>

          <div className="relative z-10 container mx-auto text-center max-w-5xl">
            <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 px-4 py-1 rounded-full mb-8">
              <Zap className="text-secondary w-4 h-4" />
              <span className="font-mono text-secondary uppercase tracking-[0.2em] text-[10px]">
                Grand Prix Season 2024
              </span>
            </div>
            <h1 className="font-headline text-6xl md:text-7xl font-black text-on-surface mb-6 leading-none">
              DOMINATE THE <br />
              <span className="text-primary italic text-glow">PITCOINS</span>{" "}
              LEAGUE
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
              Predict race telemetry, rider performance, and lap splits in the
              world's most advanced MotoGP prediction engine. Start with{" "}
              <span className="text-primary font-bold">2,000 PC</span> free.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <a href="/auth" className="px-12 py-5 bg-gradient-to-r from-[#eeb7cf] to-[#00cdfa] text-black font-headline text-xl rounded-lg shadow-[0_0_30px_rgba(238,183,207,0.3)] hover:scale-105 transition-transform uppercase active:scale-95 font-bold">
                Enter the Pit
              </a>
              <div className="flex flex-col items-start glass-card p-4 px-6 rounded-xl border border-primary/20">
                <span className="font-mono text-on-surface-variant text-[10px] uppercase tracking-wider mb-1">
                  Race Starts In
                </span>
                <RaceCountdown />
              </div>
            </div>
          </div>
        </section>

        {/* PitCoins Value Section */}
        <section className="py-24 px-8 md:px-16 bg-surface-container-lowest relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Starter Bank */}
              <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
                <Wallet className="text-primary w-10 h-10 mb-6" />
                <h3 className="font-headline text-2xl mb-4 uppercase font-bold">
                  Starter Bank
                </h3>
                <p className="text-on-surface-variant mb-6 leading-relaxed">
                  Every pilot starts with 2,000 free PitCoins. No deposits, no
                  risks—just pure tactical racing strategy.
                </p>
                <div className="font-mono text-primary text-xl font-bold">
                  +2,000 PC
                </div>
              </div>

              {/* Sprint Boost */}
              <div className="glass-card p-8 rounded-2xl relative border-t-2 border-t-tertiary-container group">
                <div className="absolute inset-0 bg-tertiary-container/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Zap className="text-tertiary-container w-10 h-10 mb-6" />
                <h3 className="font-headline text-2xl mb-4 uppercase font-bold">
                  Sprint Boost
                </h3>
                <p className="text-on-surface-variant mb-6 leading-relaxed">
                  Correctly predict the top 3 qualifiers to activate the Sprint
                  Multiplier for the main race.
                </p>
                <div className="font-mono text-tertiary-container text-3xl font-black">
                  3X RETURN
                </div>
              </div>

              {/* Grand Slam */}
              <div className="glass-card p-8 rounded-2xl relative border-t-2 border-t-primary group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Star className="text-primary w-10 h-10 mb-6" />
                <h3 className="font-headline text-2xl mb-4 uppercase font-bold">
                  Grand Slam
                </h3>
                <p className="text-on-surface-variant mb-6 leading-relaxed">
                  Predict the exact lap-one leader and the final podium finish
                  to maximize your earnings.
                </p>
                <div className="font-mono text-primary text-3xl font-black">
                  5X RETURN
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid: About & How it Works */}
        <section className="py-24 px-8 md:px-16 bg-background">
          <div className="container mx-auto">
            <div className="mb-16">
              <h2 className="font-headline text-4xl md:text-5xl uppercase mb-4 font-bold">
                The Performance{" "}
                <span className="text-primary italic">League</span>
              </h2>
              <div className="w-24 h-1 bg-primary"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 md:h-[600px]">
              {/* Large Box: About */}
              <div className="md:col-span-2 md:row-span-2 glass-card rounded-2xl p-10 flex flex-col justify-end relative overflow-hidden group">
                <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800')] bg-cover bg-center opacity-20 grayscale group-hover:scale-110 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <span className="font-mono text-primary text-[10px] uppercase tracking-widest mb-4 block">
                    Event Manifesto
                  </span>
                  <h3 className="font-headline text-4xl mb-6 leading-tight uppercase font-bold">
                    Beyond <br />
                    The Apex
                  </h3>
                  <p className="text-lg text-on-surface-variant leading-relaxed">
                    Polaris is the premiere virtual arena for MotoGP
                    enthusiasts. We bridge the gap between spectator and
                    strategist by turning live race data into a competitive
                    prediction ecosystem where knowledge is your only currency.
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:bg-surface-container-high transition-colors">
                <div>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-mono text-primary mb-6 font-bold">
                    01
                  </div>
                  <h4 className="font-headline text-xl mb-2 uppercase font-bold">
                    Analyze
                  </h4>
                </div>
                <p className="text-on-surface-variant text-sm">
                  Review real-time rider telemetry and practice lap times.
                </p>
              </div>

              {/* Step 2 */}
              <div className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:bg-surface-container-high transition-colors">
                <div>
                  <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center font-mono text-tertiary-container mb-6 font-bold">
                    02
                  </div>
                  <h4 className="font-headline text-xl mb-2 uppercase font-bold">
                    Wager
                  </h4>
                </div>
                <p className="text-on-surface-variant text-sm">
                  Place your PitCoins on multiple race-day outcomes.
                </p>
              </div>

              {/* Step 3 (Long Horizontal) */}
              <div className="md:col-span-2 glass-card rounded-2xl p-8 flex items-center gap-8 group">
                <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-primary to-tertiary-container rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Star className="text-background w-12 h-12" />
                </div>
                <div>
                  <h4 className="font-headline text-xl mb-2 uppercase font-bold">
                    Climb the Grid
                  </h4>
                  <p className="text-on-surface-variant">
                    Win your bets to climb the global leaderboard and unlock
                    exclusive digital pit passes and season trophies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Warning Bar */}
        <div className="bg-primary/5 py-4 border-y border-primary/10">
          <div className="container mx-auto px-8 flex items-center justify-center gap-4">
            <Info className="text-primary w-5 h-5" />
            <p className="font-mono text-[11px] text-on-surface-variant/70 text-center tracking-tight uppercase">
              Notice: This is a fictional entertainment prediction game and not
              real-money gambling. No real currency is used or won.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest pt-20 pb-32 px-8 md:px-16 border-t border-outline-variant/10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="font-headline text-2xl font-black tracking-tighter text-primary mb-6">
              POLARIS
            </div>
            <p className="text-on-surface-variant max-w-sm mb-8">
              The ultimate MotoGP telemetry and prediction platform. Built for
              the fans who live for the milliseconds.
            </p>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-all"
                href="#"
              >
                <Share2 className="text-on-surface-variant w-5 h-5" />
              </a>
              <a
                className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-all"
                href="#"
              >
                <Globe className="text-on-surface-variant w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h5 className="font-mono text-primary uppercase mb-6 tracking-widest text-xs font-bold">
              Platform
            </h5>
            <ul className="space-y-4">
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Racing Stats
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Prediction Rules
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Leaderboards
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  API Access
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-primary uppercase mb-6 tracking-widest text-xs font-bold">
              Legal
            </h5>
            <ul className="space-y-4">
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Responsible Gaming
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-20 pt-8 border-t border-outline-variant/5 text-center">
          <p className="font-mono text-[10px] text-on-surface-variant/40 uppercase">
            © 2024 Polaris Racing Group. Not affiliated with Dorna Sports or
            MotoGP officially.
          </p>
        </div>
      </footer>
    </div>
  );
}
