"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="font-headline text-2xl text-primary animate-pulse">
            Loading POLARIS...
          </div>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
}
