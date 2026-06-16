"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getUserRole } from "@/lib/utils";

export default function DashboardRedirectPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    const role = getUserRole(user);
    if (role === "vendor") {
      router.replace("/vendor/dashboard");
    } else if (role === "admin") {
      router.replace("/admin/dashboard");
    } else if (role === "service_provider") {
      router.replace("/provider/dashboard");
    } else if (role === "freelancer") {
      router.replace("/freelancer/dashboard");
    } else {
      router.replace("/");
    }
  }, [user, isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground animate-pulse">
          Redirecting to your dashboard...
        </span>
      </div>
    </div>
  );
}
