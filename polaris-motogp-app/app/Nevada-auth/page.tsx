"use client";

import { useState } from "react";
import { Shield, Lock, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/lib/admin-guard";

export default function AdminAuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Sign in with Firebase
      await signIn(email, password);

      // Check if user is admin
      if (!isAdmin(email)) {
        throw new Error("Unauthorized: Admin access only");
      }

      // Redirect to admin panel
      router.push('/Nevada');
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0D0D0D] text-on-background min-h-screen overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-background to-orange-950/20"></div>
        <div className="absolute inset-0 telemetry-pattern opacity-20"></div>
        {/* Warning Light Leaks */}
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-red-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Container */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
        {/* Warning Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <ShieldAlert className="w-16 h-16 text-red-500 animate-pulse" />
          </div>
          <h1 className="font-headline font-black text-4xl tracking-tighter text-red-500 uppercase mb-2">
            RESTRICTED ACCESS
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-[1px] w-8 bg-red-500/30"></span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-500/60">
              Admin Authentication Required
            </span>
            <span className="h-[1px] w-8 bg-red-500/30"></span>
          </div>
        </header>

        {/* Auth Module */}
        <div className="w-full max-w-md relative">
          <div className="bg-[#1a1518]/80 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl border border-red-500/20 relative">
            {/* Error Message */}
            {error && (
              <div className="absolute top-4 left-4 right-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3 z-10">
                <p className="text-red-400 text-sm font-mono">{error}</p>
              </div>
            )}

            {/* Sign In Section */}
            <section className="p-8 md:p-10 flex flex-col gap-8">
              <div className="space-y-2">
                <h2 className="font-headline text-3xl font-extrabold text-white uppercase leading-none">
                  Admin Control Panel
                </h2>
                <p className="text-white/60 text-sm">
                  Enter authorized credentials to access race control systems.
                </p>
              </div>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="relative group">
                    <label className="block font-mono text-[10px] text-red-500/60 uppercase mb-1 ml-1 group-focus-within:text-red-500 transition-colors">
                      Admin Email
                    </label>
                    <input
                      className="w-full bg-black/50 border border-red-500/30 rounded-lg px-4 py-3 focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all text-white placeholder:text-white/30 outline-none"
                      placeholder="admin@polaris.control"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      autoComplete="username"
                    />
                  </div>
                  <div className="relative group">
                    <label className="block font-mono text-[10px] text-red-500/60 uppercase mb-1 ml-1 group-focus-within:text-red-500 transition-colors">
                      Access Code
                    </label>
                    <input
                      className="w-full bg-black/50 border border-red-500/30 rounded-lg px-4 py-3 focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all text-white placeholder:text-white/30 outline-none"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative overflow-hidden bg-red-600 hover:bg-red-700 text-white font-headline font-black py-4 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 uppercase tracking-tight text-lg">
                    {loading ? "Authenticating..." : "Access Control Panel"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                </button>
              </form>
              <div className="pt-4 border-t border-red-500/20">
                <p className="text-center text-sm text-white/40">
                  Regular user?{" "}
                  <a href="/auth" className="text-red-500 font-bold hover:underline ml-1">
                    Return to Main Login
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Visual Decorative Accents */}
          <div className="absolute -z-10 -top-6 -left-6 w-24 h-24 border-l-2 border-t-2 border-red-500/30 rounded-tl-xl"></div>
          <div className="absolute -z-10 -bottom-6 -right-6 w-24 h-24 border-r-2 border-b-2 border-red-500/30 rounded-br-xl"></div>
        </div>

        {/* Footer Warning */}
        <footer className="mt-16 max-w-sm text-center">
          <p className="font-mono text-[9px] text-red-500/40 leading-relaxed tracking-wider uppercase">
            ⚠️ Unauthorized access attempts are logged and monitored. Admin access is restricted to authorized personnel only.
          </p>
          <div className="mt-4 flex justify-center gap-6 opacity-40">
            <Shield className="w-4 h-4 text-red-500" />
            <Lock className="w-4 h-4 text-red-500" />
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
        </footer>
      </main>
    </div>
  );
}
