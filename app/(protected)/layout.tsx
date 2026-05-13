"use client";

import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Navbar />
      {children}
      <MobileNav />
    </ProtectedRoute>
  );
}
