"use client";

import { useAuth } from "@/lib/auth-context";
import { isAdmin } from "@/lib/admin-guard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Trophy,
  Timer,
  Lock,
  LockOpen,
  Search,
  Ban,
  CheckCircle,
  BarChart3,
  Radio,
  ShieldAlert,
} from "lucide-react";
import {
  getAllActiveBettors,
  getTotalPoolLiquidity,
  getActiveBettorsCount,
  createBettingMarket,
  finalizeBetResults,
  toggleBettingStatus,
  getSystemLogs,
  toggleUserStatus,
} from "@/lib/firestore";

export default function RaceControlAdmin() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  // Admin data states
  const [activeBettors, setActiveBettors] = useState<any[]>([]);
  const [poolLiquidity, setPoolLiquidity] = useState(0);
  const [bettorsCount, setBettorsCount] = useState(0);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [searchFilter, setSearchFilter] = useState("");

  // Form states
  const [betName, setBetName] = useState("");
  const [summary, setSummary] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("1h");
  const [icon, setIcon] = useState("trophy");
  const [color, setColor] = useState("primary");
  const [odds, setOdds] = useState("2.5");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth");
      } else if (!isAdmin(user.email)) {
        router.push("/dashboard");
      } else {
        setAuthorized(true);
        loadAdminData();
      }
    }
  }, [user, loading, router]);

  const loadAdminData = async () => {
    try {
      const [bettors, liquidity, count, logs] = await Promise.all([
        getAllActiveBettors(),
        getTotalPoolLiquidity(),
        getActiveBettorsCount(),
        getSystemLogs(5),
      ]);

      setActiveBettors(bettors);
      setPoolLiquidity(liquidity);
      setBettorsCount(count);
      setSystemLogs(logs);
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
  };

  const handleCreateBet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Verify admin status (case-insensitive)
      if (!user?.email || user.email.toLowerCase() !== 'wulo@gmail.com') {
        alert(`Error: You must be signed in as admin (wulo@gmail.com). Currently signed in as: ${user?.email || 'not signed in'}`);
        setIsSubmitting(false);
        return;
      }

      await createBettingMarket({
        betName,
        summary,
        startTime,
        duration,
        raceEvent: "MotoGP 2026",
        icon,
        color,
        odds: parseFloat(odds),
      });

      alert("Betting market created successfully!");
      setBetName("");
      setSummary("");
      setStartTime("");
      setDuration("1h");
      setIcon("trophy");
      setColor("primary");
      setOdds("2.5");
      loadAdminData();
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error';
      if (errorMessage.includes('permission') || errorMessage.includes('insufficient')) {
        alert(`Permission Error: You must be signed in as admin (Wulo@gmail.com).\n\nCurrent user: ${user?.email || 'not signed in'}\n\nPlease sign out and sign in with the admin account.`);
      } else {
        alert(`Error creating betting market: ${errorMessage}`);
      }
      console.error('Full error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseBets = async () => {
    try {
      await toggleBettingStatus("closed");
      alert("Betting closed successfully!");
      loadAdminData();
    } catch (error) {
      alert("Error closing bets");
    }
  };

  const handleOpenBets = async () => {
    try {
      await toggleBettingStatus("open");
      alert("Betting opened successfully!");
      loadAdminData();
    } catch (error) {
      alert("Error opening bets");
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await toggleUserStatus(userId, newStatus);
      alert(`User ${newStatus === "active" ? "activated" : "suspended"} successfully!`);
      loadAdminData();
    } catch (error) {
      alert("Error updating user status");
    }
  };

  const filteredBettors = activeBettors.filter((bettor) =>
    bettor.userId?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    bettor.email?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (loading || !authorized) {
    return (
      <div className="bg-[#0D0D0D] text-on-background min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShieldAlert className="w-16 h-16 text-primary mx-auto animate-pulse" />
          <div className="font-mono text-sm text-white/60">
            {loading ? "Verifying credentials..." : "Checking authorization..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0D0D] text-on-background min-h-screen pb-24">
      {/* Top Navigation */}
      <header className="bg-background/80 backdrop-blur-xl border-b border-outline-variant/20 sticky top-0 z-[60]">
        <div className="flex justify-between items-center w-full px-8 md:px-16 h-16">
          <div className="flex items-center gap-4">
            <span className="font-headline text-xl font-black tracking-tighter text-primary">
              POLARIS
            </span>
            <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-error-container text-on-error-container rounded-full animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              <span className="font-mono text-[12px] uppercase">
                Race Control Live
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-8">
              <button className="font-mono text-[12px] uppercase text-primary font-bold">
                Dashboard
              </button>
              <button className="font-mono text-[12px] uppercase text-on-surface-variant hover:text-primary/80 transition-colors">
                Users
              </button>
              <button className="font-mono text-[12px] uppercase text-on-surface-variant hover:text-primary/80 transition-colors">
                Telemetry
              </button>
            </div>
            <div className="flex items-center gap-3 bg-surface-variant/50 px-3 py-1.5 rounded-full border border-outline-variant/30">
              <svg
                className="w-5 h-5 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
              <span className="font-mono text-[12px] text-on-surface">
                ADMIN_01
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-8 md:px-16 mt-8 space-y-8">
        {/* Tactical Header Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-2">
            <h1 className="font-headline text-3xl md:text-4xl text-on-surface tracking-tight uppercase font-bold">
              Race Control Center
            </h1>
            <p className="text-base text-on-surface-variant max-w-2xl">
              Manage global betting liquidity, finalize race telemetry, and
              monitor user engagement metrics in real-time. System status:
              Operational.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end gap-3">
            <div className="flex gap-2">
              <button
                onClick={handleCloseBets}
                className="flex-1 bg-error border border-error/20 text-on-error font-headline text-xl py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 font-bold"
              >
                <Lock className="w-5 h-5" />
                CLOSE BETS
              </button>
              <button
                onClick={handleOpenBets}
                className="flex-1 bg-tertiary-container border border-tertiary-container/20 text-on-tertiary-container font-headline text-xl py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 font-bold"
              >
                <LockOpen className="w-5 h-5" />
                OPEN BETS
              </button>
            </div>
          </div>
        </section>

        {/* Bento Grid Analytics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-xl flex flex-col justify-between h-40 border-l-4 border-l-primary">
            <span className="font-mono text-[12px] text-primary uppercase">
              Total Pool Liquidity
            </span>
            <div className="space-y-1">
              <span className="font-headline text-3xl md:text-4xl text-on-surface font-bold">
                {poolLiquidity.toLocaleString()}
              </span>
              <span className="font-mono text-[12px] text-secondary block">
                PC
              </span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex flex-col justify-between h-40 border-l-4 border-l-tertiary">
            <span className="font-mono text-[12px] text-tertiary uppercase">
              Active Bettors
            </span>
            <div className="space-y-1">
              <span className="font-headline text-3xl md:text-4xl text-on-surface font-bold">
                {bettorsCount}
              </span>
              <span className="font-mono text-[12px] text-on-surface-variant block">
                LIVE_NOW
              </span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex flex-col justify-between h-40 border-l-4 border-l-secondary">
            <span className="font-mono text-[12px] text-secondary uppercase">
              Total Users
            </span>
            <div className="space-y-1">
              <span className="font-headline text-3xl md:text-4xl text-on-surface font-bold">
                {activeBettors.length}
              </span>
              <span className="font-mono text-[12px] text-on-surface-variant block">
                REGISTERED
              </span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex flex-col justify-between h-40 border-l-4 border-l-error">
            <span className="font-mono text-[12px] text-error uppercase">
              System Status
            </span>
            <div className="space-y-1">
              <span className="font-headline text-3xl md:text-4xl text-on-surface font-bold">
                LIVE
              </span>
              <span className="font-mono text-[12px] text-on-surface-variant block">
                ALL_SYSTEMS_GO
              </span>
            </div>
          </div>
        </section>

        {/* Main Workspace: Create Bet & Users */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Create Bet Form */}
          <div className="md:col-span-4 space-y-6">
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="bg-surface-container-highest px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center">
                <h2 className="font-headline text-xl text-on-surface font-bold">
                  Create Bet
                </h2>
                <span className="font-mono text-[12px] text-primary">
                  NEW_MARKET
                </span>
              </div>
              <form onSubmit={handleCreateBet} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="font-mono text-[12px] text-on-surface-variant uppercase">
                    Bet Name
                  </label>
                  <div className="relative">
                    <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                    <input
                      value={betName}
                      onChange={(e) => setBetName(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg pl-10 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface"
                      placeholder="e.g. Race Winner"
                      type="text"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[12px] text-on-surface-variant uppercase">
                    Summary
                  </label>
                  <div className="relative">
                    <input
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface"
                      placeholder="Brief description"
                      type="text"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-mono text-[12px] text-on-surface-variant uppercase">
                      Start Time
                    </label>
                    <input
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 font-mono text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      type="datetime-local"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[12px] text-on-surface-variant uppercase">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 font-mono text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    >
                      <option value="30m">30 Minutes</option>
                      <option value="1h">1 Hour</option>
                      <option value="2h">2 Hours</option>
                      <option value="4h">4 Hours</option>
                      <option value="race">Until Race End</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="font-mono text-[12px] text-on-surface-variant uppercase">
                      Icon
                    </label>
                    <select
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 font-mono text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    >
                      <option value="trophy">Trophy</option>
                      <option value="timer">Timer</option>
                      <option value="alert">Alert</option>
                      <option value="gauge">Gauge</option>
                      <option value="car">Car</option>
                      <option value="target">Target</option>
                      <option value="zap">Zap</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[12px] text-on-surface-variant uppercase">
                      Color
                    </label>
                    <select
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 font-mono text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    >
                      <option value="primary">Pink</option>
                      <option value="tertiary">Cyan</option>
                      <option value="error">Red</option>
                      <option value="secondary">Green</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[12px] text-on-surface-variant uppercase">
                      Odds
                    </label>
                    <input
                      value={odds}
                      onChange={(e) => setOdds(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 font-mono text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      required
                    />
                  </div>
                </div>
                <button
                  disabled={isSubmitting}
                  className="w-full race-gradient text-on-primary-fixed font-headline text-xl py-4 rounded-lg shadow-[0_0_20px_rgba(238,183,207,0.3)] hover:scale-[1.02] active:scale-95 transition-all font-bold disabled:opacity-50"
                  type="submit"
                >
                  {isSubmitting ? "CREATING..." : "CREATE BET"}
                </button>
              </form>
            </div>

            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h3 className="font-mono text-[12px] text-primary uppercase">
                System Teletype
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {systemLogs.length > 0 ? (
                  systemLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-3 text-[12px] font-mono">
                      <span className="text-on-surface-variant">
                        {log.timestamp?.toDate?.()?.toLocaleTimeString() || "N/A"}
                      </span>
                      <span className={`${
                        log.type === "ERROR" ? "text-error" :
                        log.type === "WARN" ? "text-error" :
                        log.type === "API" ? "text-tertiary" :
                        "text-secondary"
                      }`}>
                        [{log.type}]
                      </span>
                      <span className="text-on-surface">{log.message}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-3 text-[12px] font-mono">
                    <span className="text-on-surface-variant">--:--:--</span>
                    <span className="text-secondary">[SYS]</span>
                    <span className="text-on-surface">System operational. No recent logs.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: User Management Table */}
          <div className="md:col-span-8">
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="bg-surface-container-highest px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h2 className="font-headline text-xl text-on-surface uppercase font-bold">
                    Active Bettors
                  </h2>
                  <div className="hidden sm:flex bg-surface-container-low border border-outline-variant/30 px-3 py-1 rounded gap-2">
                    <Search className="w-4 h-4 text-on-surface-variant" />
                    <input
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="bg-transparent border-none p-0 focus:ring-0 font-mono text-[12px] w-32 text-on-surface outline-none"
                      placeholder="Filter..."
                      type="text"
                    />
                  </div>
                </div>
                <button
                  onClick={loadAdminData}
                  className="font-mono text-[12px] text-primary hover:underline uppercase"
                >
                  Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/30">
                      <th className="px-6 py-4 font-mono text-[12px] text-on-surface-variant uppercase">
                        User / Identity
                      </th>
                      <th className="px-6 py-4 font-mono text-[12px] text-on-surface-variant uppercase">
                        Balance
                      </th>
                      <th className="px-6 py-4 font-mono text-[12px] text-on-surface-variant uppercase">
                        Current Stake
                      </th>
                      <th className="px-6 py-4 font-mono text-[12px] text-on-surface-variant uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4 font-mono text-[12px] text-on-surface-variant uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {filteredBettors.length > 0 ? (
                      filteredBettors.map((bettor, idx) => (
                        <tr key={idx} className="hover:bg-surface-variant/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary-container font-black">
                                {bettor.email?.[0]?.toUpperCase() || "U"}
                              </div>
                              <div>
                                <div className="text-base text-on-surface font-semibold">
                                  {bettor.email?.split("@")[0] || "Unknown"}
                                </div>
                                <div className="font-mono text-[10px] text-on-surface-variant">
                                  UID: {bettor.userId?.slice(0, 8) || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-on-surface">
                            {bettor.balance?.toLocaleString() || 0} PC
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-mono text-primary font-bold">
                                {bettor.currentStake?.toLocaleString() || 0} PC
                              </span>
                              <span className="text-[10px] text-on-surface-variant">
                                on {bettor.betSelection || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 ${
                              bettor.status === "suspended"
                                ? "bg-error/10 text-error border-error/20"
                                : "bg-secondary/10 text-secondary border-secondary/20"
                            } border rounded text-[10px] font-mono uppercase`}>
                              {bettor.status || "active"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleUserStatus(bettor.userId, bettor.status)}
                              className="text-on-surface-variant hover:text-error transition-colors"
                            >
                              {bettor.status === "suspended" ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <Ban className="w-5 h-5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                          No active bettors found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* System Visualization */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-mono text-[12px] text-on-surface uppercase tracking-widest">
                Global Odds Distribution
              </h3>
              <BarChart3 className="text-primary w-5 h-5" />
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              <div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors h-[60%] rounded-t relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  BAG
                </span>
              </div>
              <div className="flex-1 bg-tertiary-container/20 hover:bg-tertiary-container/40 transition-colors h-[85%] rounded-t relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  MAR
                </span>
              </div>
              <div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors h-[40%] rounded-t relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  BEZ
                </span>
              </div>
              <div className="flex-1 bg-tertiary-container/20 hover:bg-tertiary-container/40 transition-colors h-[95%] rounded-t relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  JOR
                </span>
              </div>
              <div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors h-[30%] rounded-t relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  BIN
                </span>
              </div>
              <div className="flex-1 bg-tertiary-container/20 hover:bg-tertiary-container/40 transition-colors h-[50%] rounded-t relative group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  ALE
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-mono text-[12px] text-on-surface uppercase tracking-widest">
                Live Race Feed
              </h3>
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                <span className="font-mono text-[10px] text-error uppercase">
                  Transmission Active
                </span>
              </div>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden group">
              <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                <span className="font-mono text-sm">Race Feed Placeholder</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent flex flex-col justify-end p-4">
                <div className="flex justify-between items-end">
                  <div className="font-mono text-[12px] text-primary">
                    RACE UPCOMING
                  </div>
                  <div className="text-right">
                    <div className="font-headline text-xl text-on-surface leading-none font-bold">
                      MAY 13
                    </div>
                    <div className="font-mono text-[10px] text-on-surface-variant">
                      2026
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
