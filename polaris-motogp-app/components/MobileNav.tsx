"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { isAdmin } from "@/lib/admin-guard";
import Link from "next/link";

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const userIsAdmin = isAdmin(user?.email);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-black/95 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center h-20 px-4">
      <Link
        className={`flex flex-col items-center justify-center ${
          isActive('/dashboard')
            ? 'text-primary bg-primary/10 rounded-full px-4 py-2'
            : 'text-white/40'
        }`}
        href="/dashboard"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
        <span className="font-mono text-[9px] uppercase mt-1 tracking-wider">
          Dashboard
        </span>
      </Link>
      <Link
        className={`flex flex-col items-center justify-center ${
          isActive('/betting')
            ? 'text-primary bg-primary/10 rounded-full px-4 py-2'
            : 'text-white/40'
        }`}
        href="/betting"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
        </svg>
        <span className="font-mono text-[9px] uppercase mt-1 tracking-wider">
          Prediction
        </span>
      </Link>
      <Link
        className={`flex flex-col items-center justify-center ${
          isActive('/standings')
            ? 'text-primary bg-primary/10 rounded-full px-4 py-2'
            : 'text-white/40'
        }`}
        href="/standings"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
        <span className="font-mono text-[9px] uppercase mt-1 tracking-wider">
          Standings
        </span>
      </Link>
      <Link
        className={`flex flex-col items-center justify-center ${
          isActive('/leaderboard')
            ? 'text-primary bg-primary/10 rounded-full px-4 py-2'
            : 'text-white/40'
        }`}
        href="/leaderboard"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z" />
        </svg>
        <span className="font-mono text-[9px] uppercase mt-1 tracking-wider">
          Leaderboard
        </span>
      </Link>
      <Link
        className={`flex flex-col items-center justify-center ${
          isActive('/victory')
            ? 'text-primary bg-primary/10 rounded-full px-4 py-2'
            : 'text-white/40'
        }`}
        href="/victory"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L3.5 7.5v9L12 22l8.5-5.5v-9L12 2zm0 2.18l6.5 4.2v6.24L12 19.82l-6.5-4.2V8.38l6.5-4.2z" />
        </svg>
        <span className="font-mono text-[9px] uppercase mt-1 tracking-wider">
          Results
        </span>
      </Link>
      {userIsAdmin && (
        <Link
          className={`flex flex-col items-center justify-center ${
            isActive('/Nevada')
              ? 'text-primary bg-primary/10 rounded-full px-4 py-2'
              : 'text-white/40'
          }`}
          href="/Nevada"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          <span className="font-mono text-[9px] uppercase mt-1 tracking-wider">
            Admin
          </span>
        </Link>
      )}
    </nav>
  );
}
