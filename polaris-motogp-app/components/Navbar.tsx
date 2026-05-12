"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useUserBalance } from "@/hooks/useUserData";
import { isAdmin } from "@/lib/admin-guard";
import Link from "next/link";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { balance, loading } = useUserBalance();
  const userIsAdmin = isAdmin(user?.email);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/landing');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0809]/95 backdrop-blur-xl border-b border-white/5 h-16 flex justify-between items-center w-full px-8 md:px-16">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="font-headline text-xl font-black tracking-wider text-white hover:text-primary transition-colors">
          POLARIS
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-12 items-center">
        <Link
          className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
            isActive('/dashboard')
              ? 'text-white font-bold'
              : 'text-white/40 hover:text-primary/80'
          }`}
          href="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
            isActive('/betting')
              ? 'text-white font-bold'
              : 'text-white/40 hover:text-primary/80'
          }`}
          href="/betting"
        >
          Betting
        </Link>
        <Link
          className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
            isActive('/standings')
              ? 'text-white font-bold'
              : 'text-white/40 hover:text-primary/80'
          }`}
          href="/standings"
        >
          Standings
        </Link>
        <Link
          className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
            isActive('/leaderboard')
              ? 'text-white font-bold'
              : 'text-white/40 hover:text-primary/80'
          }`}
          href="/leaderboard"
        >
          Leaderboard
        </Link>
        <Link
          className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
            isActive('/victory')
              ? 'text-white font-bold'
              : 'text-white/40 hover:text-primary/80'
          }`}
          href="/victory"
        >
          Results
        </Link>
        {userIsAdmin && (
          <Link
            className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
              isActive('/Nevada')
                ? 'text-white font-bold'
                : 'text-white/40 hover:text-primary/80'
            }`}
            href="/Nevada"
          >
            Admin
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="font-mono text-xs text-white font-bold">
            {loading ? '...' : balance.toLocaleString()} PC
          </span>
          <span className="text-[9px] uppercase text-white/30 tracking-[0.15em] font-mono">
            PitCoin Balance
          </span>
        </div>
        <div className="relative group">
          <div className="h-10 w-10 rounded-full border border-primary/30 overflow-hidden bg-surface-container cursor-pointer">
            <div className="w-full h-full flex items-center justify-center text-primary font-headline font-bold text-sm">
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
          </div>
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-[#1a1518] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="p-3 border-b border-white/5">
              <p className="text-xs text-white/60 font-mono truncate">
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-primary transition-colors font-mono uppercase tracking-wider"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
