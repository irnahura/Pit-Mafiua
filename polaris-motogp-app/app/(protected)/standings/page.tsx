"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useUserBalance } from "@/hooks/useUserData";
import { useStandings } from "@/hooks/useStandings";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";

export default function StandingsPage() {
  const { user } = useAuth();
  const { balance, loading: balanceLoading } = useUserBalance();
  const { drivers, constructors, loading, error } = useStandings();
  const [activeTab, setActiveTab] = useState<"drivers" | "constructors">("drivers");

  const getPositionChange = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-secondary" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-error" />;
    return <Minus className="w-4 h-4 text-outline" />;
  };

  const getPodiumClass = (position: number) => {
    if (position === 1) return "border-l-4 border-l-primary bg-primary/5";
    if (position === 2) return "border-l-4 border-l-tertiary bg-tertiary/5";
    if (position === 3) return "border-l-4 border-l-secondary bg-secondary/5";
    return "";
  };

  return (
    <div className="bg-background text-on-background min-h-screen telemetry-grid pb-24">
      {/* Top Navigation */}
      <header className="fixed top-0 z-50 flex justify-between items-center w-full px-8 md:px-16 h-16 bg-background/80 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-headline text-xl font-black tracking-tighter text-primary hover:text-primary/80 transition-colors">
            POLARIS
          </Link>
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
        {/* Hero Section */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="font-headline text-5xl md:text-6xl text-on-surface uppercase italic font-black tracking-tight">
              World Standing
            </h1>
          </div>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Live championship rankings updated after every race. Track driver and constructor performance throughout the season.
          </p>
        </section>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("drivers")}
            className={`flex-1 py-4 rounded-lg font-headline text-xl uppercase font-bold transition-all ${
              activeTab === "drivers"
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            Drivers
          </button>
          <button
            onClick={() => setActiveTab("constructors")}
            className={`flex-1 py-4 rounded-lg font-headline text-xl uppercase font-bold transition-all ${
              activeTab === "constructors"
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            Constructors
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-on-surface-variant font-mono text-sm">Loading standings...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-card p-6 rounded-xl border-l-4 border-l-error text-center">
            <p className="text-error font-mono">{error}</p>
          </div>
        )}

        {/* Drivers Tab */}
        {!loading && !error && activeTab === "drivers" && (
          <div className="space-y-6">
            {/* Podium - Top 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {drivers.slice(0, 3).map((driver, index) => (
                <div
                  key={driver.id}
                  className={`glass-card p-6 rounded-xl relative overflow-hidden ${getPodiumClass(index + 1)}`}
                >
                  {/* Position Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-surface-container-highest border-2 border-primary flex items-center justify-center">
                    <span className="font-headline text-2xl font-black text-primary">{index + 1}</span>
                  </div>

                  {/* Driver Avatar */}
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-surface-container-highest border-4 border-primary/30 flex items-center justify-center overflow-hidden">
                    {driver.avatar ? (
                      <img src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-headline text-4xl font-black text-primary">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>

                  {/* Driver Info */}
                  <div className="text-center">
                    <h3 className="font-headline text-2xl font-bold text-on-surface uppercase mb-1">
                      {driver.name}
                    </h3>
                    <p className="text-on-surface-variant font-mono text-sm mb-4">{driver.team}</p>
                    
                    {/* Points */}
                    <div className="bg-surface-container-highest rounded-lg p-4 mb-3">
                      <div className="font-headline text-4xl font-black text-primary mb-1">
                        {driver.points}
                      </div>
                      <div className="font-mono text-xs text-on-surface-variant uppercase">Points</div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-xs font-mono text-on-surface-variant">
                      <div>
                        <div className="text-on-surface font-bold">{driver.consistency}%</div>
                        <div>Consistency</div>
                      </div>
                      <div>
                        <div className="text-on-surface font-bold">{driver.avgPosition}</div>
                        <div>Avg Pos</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Full Rankings Table */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="bg-surface-container-highest px-6 py-4 border-b border-outline-variant/30">
                <h2 className="font-headline text-xl text-on-surface uppercase font-bold">
                  Full Rankings
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-container-low border-b border-outline-variant/30">
                    <tr>
                      <th className="px-6 py-4 text-left font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Driver
                      </th>
                      <th className="px-6 py-4 text-center font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-4 text-center font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Change
                      </th>
                      <th className="px-6 py-4 text-center font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Avg Pos
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {drivers.map((driver, index) => (
                      <tr
                        key={driver.id}
                        className={`hover:bg-surface-variant/20 transition-colors ${getPodiumClass(index + 1)}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-headline text-xl font-bold text-on-surface w-8">
                              {index + 1}
                            </span>
                            {getPositionChange(driver.positionChange || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                              {driver.avatar ? (
                                <img src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-headline text-sm font-black text-primary">
                                  {driver.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-headline text-base font-bold text-on-surface uppercase">
                                {driver.name}
                              </div>
                              <div className="font-mono text-xs text-on-surface-variant">{driver.team}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-headline text-2xl font-bold text-primary">
                            {driver.points}
                          </span>
                          <span className="font-mono text-xs text-on-surface-variant ml-1">PTS</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {getPositionChange(driver.positionChange || 0)}
                            <span className="font-mono text-sm text-on-surface">
                              {Math.abs(driver.positionChange || 0)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-mono text-base text-on-surface">{driver.avgPosition}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Constructors Tab */}
        {!loading && !error && activeTab === "constructors" && (
          <div className="space-y-6">
            {/* Top 3 Constructors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {constructors.slice(0, 3).map((constructor, index) => (
                <div
                  key={constructor.id}
                  className={`glass-card p-6 rounded-xl relative overflow-hidden ${getPodiumClass(index + 1)}`}
                >
                  {/* Position Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-surface-container-highest border-2 border-primary flex items-center justify-center">
                    <span className="font-headline text-2xl font-black text-primary">{index + 1}</span>
                  </div>

                  {/* Constructor Logo */}
                  <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-surface-container-highest border-4 border-primary/30 flex items-center justify-center overflow-hidden p-2">
                    {constructor.logo ? (
                      <img src={constructor.logo} alt={constructor.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="font-headline text-3xl font-black text-primary">
                        {constructor.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Constructor Info */}
                  <div className="text-center">
                    <h3 className="font-headline text-2xl font-bold text-on-surface uppercase mb-4">
                      {constructor.name}
                    </h3>
                    
                    {/* Points */}
                    <div className="bg-surface-container-highest rounded-lg p-4 mb-3">
                      <div className="font-headline text-4xl font-black text-primary mb-1">
                        {constructor.points}
                      </div>
                      <div className="font-mono text-xs text-on-surface-variant uppercase">Points</div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-xs font-mono text-on-surface-variant">
                      <div>
                        <div className="text-on-surface font-bold">{constructor.wins || 0}</div>
                        <div>Wins</div>
                      </div>
                      <div>
                        <div className="text-on-surface font-bold">{constructor.podiums || 0}</div>
                        <div>Podiums</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Full Constructor Rankings */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="bg-surface-container-highest px-6 py-4 border-b border-outline-variant/30">
                <h2 className="font-headline text-xl text-on-surface uppercase font-bold">
                  Constructor Standings
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-container-low border-b border-outline-variant/30">
                    <tr>
                      <th className="px-6 py-4 text-left font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Constructor
                      </th>
                      <th className="px-6 py-4 text-center font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-4 text-center font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Wins
                      </th>
                      <th className="px-6 py-4 text-center font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Podiums
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {constructors.map((constructor, index) => (
                      <tr
                        key={constructor.id}
                        className={`hover:bg-surface-variant/20 transition-colors ${getPodiumClass(index + 1)}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-headline text-xl font-bold text-on-surface w-8">
                              {index + 1}
                            </span>
                            {getPositionChange(constructor.positionChange || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-surface-container-highest border-2 border-primary/30 flex items-center justify-center overflow-hidden p-1">
                              {constructor.logo ? (
                                <img src={constructor.logo} alt={constructor.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="font-headline text-xs font-black text-primary">
                                  {constructor.name.substring(0, 2).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="font-headline text-base font-bold text-on-surface uppercase">
                              {constructor.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-headline text-2xl font-bold text-primary">
                            {constructor.points}
                          </span>
                          <span className="font-mono text-xs text-on-surface-variant ml-1">PTS</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-mono text-base text-on-surface">{constructor.wins || 0}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-mono text-base text-on-surface">{constructor.podiums || 0}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Analytics CTA */}
        <div className="glass-card p-8 rounded-xl text-center mt-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-surface-container-highest border-2 border-primary/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
          </div>
          <h3 className="font-headline text-2xl font-bold text-on-surface uppercase mb-2">
            Detailed Analytics
          </h3>
          <p className="text-on-surface-variant mb-6 max-w-md mx-auto">
            Unlock deep telemetry, tire wear stats, and sector-by-sector performance for every rider.
          </p>
          <button className="bg-primary text-on-primary font-headline text-base uppercase px-8 py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all font-bold">
            View Full Report
          </button>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-black/95 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center h-20 px-4">
        <Link href="/dashboard" className="flex flex-col items-center justify-center text-white/40">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
          <span className="font-mono text-[9px] uppercase mt-1 tracking-wider">Dashboard</span>
        </Link>
        <Link href="/betting" className="flex flex-col items-center justify-center text-white/40">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
          </svg>
          <span className="font-mono text-[9px] uppercase mt-1 tracking-wider">Prediction</span>
        </Link>
        <Link href="/standings" className="flex flex-col items-center justify-center text-primary bg-primary/10 rounded-full px-4 py-1">
          <Trophy className="w-5 h-5" />
          <span className="font-mono text-[9px] uppercase mt-1 tracking-wider">Standings</span>
        </Link>
        <Link href="/leaderboard" className="flex flex-col items-center justify-center text-white/40">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z" />
          </svg>
          <span className="font-mono text-[9px] uppercase mt-1 tracking-wider">Leaders</span>
        </Link>
      </nav>
    </div>
  );
}
