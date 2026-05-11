"use client";

import { useState } from "react";
import { Shield, Lock, Bike } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        if (!email || !password) {
          throw new Error("Email and password are required");
        }
        await signUp(email, password);
      } else {
        // Sign in
        if (!email || !password) {
          throw new Error("Email and password are required");
        }
        await signIn(email, password);
      }
      
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-lowest via-background to-surface-container-low opacity-90"></div>
        <div className="absolute inset-0 w-full h-full bg-surface-container opacity-20 mix-blend-luminosity grayscale"></div>
        <div className="absolute inset-0 telemetry-pattern opacity-40"></div>
        {/* Light Leaks */}
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-tertiary/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Container */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
        {/* Brand Header */}
        <header className="mb-12 text-center">
          <h1 className="font-headline font-black text-5xl tracking-tighter text-primary italic transform -skew-x-12">
            POLARIS
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-[1px] w-8 bg-outline-variant"></span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-outline">
              MotoGP Technical League
            </span>
            <span className="h-[1px] w-8 bg-outline-variant"></span>
          </div>
        </header>

        {/* Auth Module */}
        <div className="w-full max-w-md relative">
          <div className="glass-panel rounded-xl overflow-hidden shadow-2xl relative transition-all duration-700">
            {/* Error Message */}
            {error && (
              <div className="absolute top-4 left-4 right-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 z-10">
                <p className="text-red-400 text-sm font-mono">{error}</p>
              </div>
            )}

            {/* Inner Sliding Shell */}
            <div
              className={`flex w-[200%] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                isSignUp ? "-translate-x-1/2" : "translate-x-0"
              }`}
            >
              {/* Sign In Section */}
              <section
                className={`w-1/2 p-8 md:p-10 flex flex-col gap-8 transition-opacity duration-700 ${
                  isSignUp ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                <div className="space-y-2">
                  <h2 className="font-headline text-3xl font-extrabold text-on-surface uppercase leading-none">
                    Welcome Back Pilot
                  </h2>
                  <p className="text-on-surface-variant text-sm">
                    Resume your tactical command at the paddock.
                  </p>
                </div>
                <form
                  className="space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div className="space-y-4">
                    <div className="relative group">
                      <label className="block font-mono text-[10px] text-outline uppercase mb-1 ml-1 group-focus-within:text-primary transition-colors">
                        Email
                      </label>
                      <input
                        className="w-full bg-surface-container-high/50 border border-outline-variant rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-surface placeholder:text-outline-variant/50 outline-none"
                        placeholder="pilot@polaris.league"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="relative group">
                      <label className="block font-mono text-[10px] text-outline uppercase mb-1 ml-1 group-focus-within:text-primary transition-colors">
                        Password
                      </label>
                      <input
                        className="w-full bg-surface-container-high/50 border border-outline-variant rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-surface placeholder:text-outline-variant/50 outline-none"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full group relative overflow-hidden bg-primary text-on-primary font-headline font-black py-4 rounded-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 uppercase tracking-tight text-lg">
                      {loading ? "Loading..." : "Enter the Pit"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                  </button>
                </form>
                <div className="pt-4 border-t border-outline-variant/20">
                  <p className="text-center text-sm text-on-surface-variant">
                    Unregistered recruit?{" "}
                    <button
                      className="text-primary font-bold hover:underline ml-1"
                      onClick={() => setIsSignUp(true)}
                      type="button"
                    >
                      Join the League
                    </button>
                  </p>
                </div>
              </section>

              {/* Sign Up Section */}
              <section
                className={`w-1/2 p-8 md:p-10 flex flex-col gap-8 bg-surface-container-lowest/50 backdrop-blur-xl transition-opacity duration-700 ${
                  isSignUp ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="space-y-2">
                  <h2 className="font-headline text-3xl font-extrabold text-on-surface uppercase leading-none">
                    Join the League
                  </h2>
                  <p className="text-on-surface-variant text-sm">
                    Calibrate your telemetry and claim your starting PitCoins.
                  </p>
                </div>
                <form
                  className="space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div className="space-y-4">
                    <div className="relative group">
                      <label className="block font-mono text-[10px] text-outline uppercase mb-1 ml-1 group-focus-within:text-tertiary transition-colors">
                        Email
                      </label>
                      <input
                        className="w-full bg-surface-container-high/50 border border-outline-variant rounded-lg px-4 py-3 focus:ring-1 focus:ring-tertiary focus:border-tertiary transition-all text-on-surface placeholder:text-outline-variant/50 outline-none"
                        placeholder="pilot@polaris.league"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="relative group">
                      <label className="block font-mono text-[10px] text-outline uppercase mb-1 ml-1 group-focus-within:text-tertiary transition-colors">
                        Password
                      </label>
                      <input
                        className="w-full bg-surface-container-high/50 border border-outline-variant rounded-lg px-4 py-3 focus:ring-1 focus:ring-tertiary focus:border-tertiary transition-all text-on-surface placeholder:text-outline-variant/50 outline-none"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full group relative overflow-hidden bg-tertiary text-on-tertiary font-headline font-black py-4 rounded-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 uppercase tracking-tight text-lg">
                      {loading ? "Creating Account..." : "Initialize Bank"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                  </button>
                </form>
                <div className="pt-4 border-t border-outline-variant/20">
                  <p className="text-center text-sm text-on-surface-variant">
                    Active pilot?{" "}
                    <button
                      className="text-tertiary font-bold hover:underline ml-1"
                      onClick={() => setIsSignUp(false)}
                      type="button"
                    >
                      Enter the Pit
                    </button>
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Visual Decorative Accents */}
          <div className="absolute -z-10 -top-6 -left-6 w-24 h-24 border-l-2 border-t-2 border-primary/30 rounded-tl-xl"></div>
          <div className="absolute -z-10 -bottom-6 -right-6 w-24 h-24 border-r-2 border-b-2 border-tertiary/30 rounded-br-xl"></div>
        </div>

        {/* Footer Legal Disclaimer */}
        <footer className="mt-16 max-w-sm text-center">
          <p className="font-mono text-[9px] text-outline-variant leading-relaxed tracking-wider uppercase">
            This is a fictional entertainment prediction game and not real-money
            gambling. All "PitCoins" hold no real-world monetary value.
          </p>
          <div className="mt-4 flex justify-center gap-6 opacity-40">
            <Shield className="w-4 h-4" />
            <Lock className="w-4 h-4" />
            <Bike className="w-4 h-4" />
          </div>
        </footer>
      </main>
    </div>
  );
}
