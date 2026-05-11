"use client";

import { DollarSign, TrendingUp, CheckCircle } from "lucide-react";
import { useUserData, useUserBalance, useUserBets } from "@/hooks/useUserData";

export default function DashboardPage() {
  const { userData, loading: userLoading } = useUserData();
  const { balance, loading: balanceLoading } = useUserBalance();
  const { bets, loading: betsLoading } = useUserBets();
  return (
    <div className="bg-background text-on-background min-h-screen telemetry-grid">
      {/* Main Content */}
      <main className="pt-24 px-8 md:px-16 max-w-[1400px] mx-auto space-y-6 pb-24">
        {/* Top Row: Balance & Live Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PitCoin Balance Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1518] to-[#0f0c0d] rounded-2xl p-8 relative overflow-hidden border border-[#eeb7cf]/10 card-pink-glow">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#eeb7cf]/10 blur-[120px] -mr-48 -mt-48"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="text-white/40 w-3 h-3" />
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
                  Available Liquidity
                </span>
              </div>
              <div className="flex items-baseline gap-3 mb-8">
                <h1 className="font-headline text-7xl font-black text-[#eeb7cf] tracking-tight pink-glow">
                  {balanceLoading ? '...' : balance.toLocaleString()}
                </h1>
                <span className="font-headline text-xl text-[#eeb7cf]/60 font-bold">
                  PITCOIN
                </span>
              </div>
              <div className="flex gap-3">
                <button className="bg-gradient-to-r from-[#c084d8] to-[#00cdfa] text-black px-6 py-2.5 rounded-lg font-mono text-[10px] uppercase tracking-[0.15em] font-bold hover:opacity-90 transition-opacity">
                  Deposit PC
                </button>
                <button className="border border-white/10 hover:border-white/20 text-white px-6 py-2.5 rounded-lg font-mono text-[10px] uppercase tracking-[0.15em] font-bold transition-colors">
                  Marketplace
                </button>
              </div>
            </div>
            {/* Telemetry Decoration */}
            <div className="absolute bottom-4 right-6 font-mono text-[8px] text-[#eeb7cf]/20 text-right space-y-0.5 tracking-wider">
              <div>SECURE_WALLET_V2.0.4</div>
              <div>ENCRYPTION: AES-256-GCM</div>
              <div>UPTIME: 99.998%</div>
            </div>
          </div>

          {/* Live/Countdown Widget */}
          <div className="bg-gradient-to-br from-[#1a1518] to-[#0f0c0d] rounded-2xl p-6 flex flex-col justify-between border border-[#eeb7cf]/10 card-pink-glow">
            <div>
              <span className="inline-flex items-center gap-2 px-2 py-1 bg-secondary/10 border border-secondary/20 rounded text-secondary font-mono text-[9px] uppercase mb-4 tracking-wider">
                <span className="w-1 h-1 rounded-full bg-secondary animate-pulse"></span>
                Live Telemetry
              </span>
              <h2 className="font-headline text-2xl font-bold leading-tight text-white mb-1">
                Catalunya Grand Prix
              </h2>
              <p className="font-mono text-[10px] text-white/40 tracking-wide">
                Sess: Q2 | Lap 12/24
              </p>
            </div>
            <div className="mt-6">
              <div className="flex justify-between font-mono text-[9px] text-white/40 uppercase mb-3 tracking-wider">
                <span>Betting Window Closes</span>
                <span className="text-tertiary">Critical</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex-1 bg-black/40 h-14 rounded-lg flex items-center justify-center border border-white/5">
                  <span className="font-headline text-3xl text-white font-bold">02</span>
                </div>
                <div className="text-white/30 text-2xl">:</div>
                <div className="flex-1 bg-black/40 h-14 rounded-lg flex items-center justify-center border border-white/5">
                  <span className="font-headline text-3xl text-white font-bold">44</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row: Active Bets & Accuracy Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Bets Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-headline text-sm uppercase tracking-wider text-white border-l-2 border-primary pl-3 font-bold">
                Active Positions
              </h3>
              <span className="font-mono text-[10px] text-white/40 tracking-wider">
                {betsLoading ? '...' : bets.filter(b => b.status === 'pending').length} TOTAL
              </span>
            </div>
            <div className="bg-gradient-to-br from-[#1a1518] to-[#0f0c0d] rounded-2xl overflow-hidden border border-[#eeb7cf]/10 card-pink-glow">
              <table className="w-full text-left font-mono text-[10px]">
                <thead className="bg-black/20 text-white/40 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-bold">Market</th>
                    <th className="px-6 py-4 font-bold">Selection</th>
                    <th className="px-6 py-4 font-bold">Stake</th>
                    <th className="px-6 py-4 font-bold">Return</th>
                    <th className="px-6 py-4 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {betsLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-white/40 font-mono text-xs">
                        Loading bets...
                      </td>
                    </tr>
                  ) : bets.filter(b => b.status === 'pending').length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-white/40 font-mono text-xs">
                        No active bets. Visit the Betting Arena to place predictions.
                      </td>
                    </tr>
                  ) : (
                    bets.filter(b => b.status === 'pending').slice(0, 5).map((bet) => (
                      <tr key={bet.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-xs">
                            {bet.marketType}
                          </div>
                          <div className="text-[9px] text-white/30 mt-0.5">
                            {bet.raceEvent}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white font-bold">{bet.selection}</td>
                        <td className="px-6 py-4 text-white">{bet.stakeAmount} PC</td>
                        <td className="px-6 py-4 text-white">{bet.potentialReturn.toFixed(0)} PC</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-white/60 hover:text-white transition-colors uppercase tracking-wider font-bold">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Accuracy Analytics */}
          <div className="bg-gradient-to-br from-[#1a1518] to-[#0f0c0d] rounded-2xl p-6 border border-[#eeb7cf]/10 card-pink-glow">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline text-xs uppercase tracking-wider text-white font-bold">
                Prediction Accuracy
              </h3>
              <span className="font-headline text-2xl text-[#eeb7cf] font-bold pink-glow">
                {userLoading ? '...' : userData ? `${(userData.winRate * 100).toFixed(1)}%` : '0%'}
              </span>
            </div>
            <div className="h-40 flex items-end justify-between gap-1.5">
              {[
                { height: 40, day: "MON" },
                { height: 65, day: "TUE" },
                { height: 45, day: "WED" },
                { height: 90, day: "THU" },
                { height: 75, day: "FRI" },
                { height: 82, day: "TODAY" },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-[#eeb7cf]/10 rounded-t hover:bg-[#eeb7cf]/20 transition-colors border-t border-[#eeb7cf]/20"
                    style={{ height: `${bar.height}%` }}
                  ></div>
                  <span
                    className={`font-mono text-[8px] uppercase tracking-wider ${
                      bar.day === "TODAY"
                        ? "text-white font-bold underline"
                        : "text-white/30"
                    }`}
                  >
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Activity & Recommended */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-[#1a1518] to-[#0f0c0d] rounded-2xl p-6 border border-[#eeb7cf]/10 card-pink-glow">
            <h3 className="font-headline text-xs uppercase tracking-wider mb-6 text-white/60 font-bold">
              System Log
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-bold mb-0.5">
                    Winnings Claimed
                  </div>
                  <div className="text-[10px] text-white/40 font-mono">
                    Race: Mugello GP +420 PC
                  </div>
                </div>
                <span className="text-[9px] font-mono text-white/20 flex-shrink-0">
                  2H AGO
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-bold mb-0.5">
                    New Prediction Logged
                  </div>
                  <div className="text-[10px] text-white/40 font-mono">
                    Moto3 Qualifier Selection
                  </div>
                </div>
                <span className="text-[9px] font-mono text-white/20 flex-shrink-0">
                  5H AGO
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-bold mb-0.5">
                    Account Verification
                  </div>
                  <div className="text-[10px] text-white/40 font-mono">
                    Tier 2 Authentication Active
                  </div>
                </div>
                <span className="text-[9px] font-mono text-white/20 flex-shrink-0">
                  1D AGO
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Markets */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#1a1518] to-[#0f0c0d] rounded-2xl p-6 border-l-2 border-l-primary group cursor-pointer hover:bg-[#1a1518] transition-colors border border-[#eeb7cf]/10 card-pink-glow">
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[9px] uppercase text-white/40 tracking-wider">
                  High Yield Market
                </span>
                <TrendingUp className="text-white/40 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-headline text-base font-bold mb-2 text-white">
                Race Winner: Bagnaia
              </h4>
              <p className="text-[11px] text-white/40 mb-6 leading-relaxed">
                Telemetry shows consistent 1:38.2 laps in practice. Strong
                potential.
              </p>
              <div className="flex justify-between items-center">
                <div className="px-3 py-1.5 bg-black/40 rounded font-mono text-[10px] text-white border border-white/10">
                  2.45 ODDS
                </div>
                <button className="text-white/60 text-[9px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                  Open Slip
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1a1518] to-[#0f0c0d] rounded-2xl p-6 border-l-2 border-l-tertiary group cursor-pointer hover:bg-[#1a1518] transition-colors border border-[#eeb7cf]/10 card-pink-glow">
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[9px] uppercase text-white/40 tracking-wider">
                  Expert Consensus
                </span>
                <CheckCircle className="text-white/40 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-headline text-base font-bold mb-2 text-white">
                Fastest Lap: Martin
              </h4>
              <p className="text-[11px] text-white/40 mb-6 leading-relaxed">
                92% of top-tier predictors are backing Martin for the fastest
                lap.
              </p>
              <div className="flex justify-between items-center">
                <div className="px-3 py-1.5 bg-black/40 rounded font-mono text-[10px] text-white border border-white/10">
                  3.10 ODDS
                </div>
                <button className="text-white/60 text-[9px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                  Open Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
