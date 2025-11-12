// components/ClientNavbar.tsx
"use client";
import { useAuth } from "@/context/AuthProvider";
import Navbar from "@/components/header/Navbar";

export default function ClientNavbar() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return null;
  return <Navbar />;
}
