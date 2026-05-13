"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page on initial load
    router.push("/landing");
  }, [router]);

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
