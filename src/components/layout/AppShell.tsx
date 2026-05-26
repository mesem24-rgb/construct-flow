"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function getIsDemo() {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem("constructflow-demo") === "true";
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, loading } = useAuth();

  const isLoginPage = pathname === "/login";
  const isDemo = getIsDemo();

  useEffect(() => {
    if (!loading && !session && !isDemo && !isLoginPage) {
      router.push("/login");
    }

    if (!loading && session && isLoginPage) {
      router.push("/");
    }
  }, [loading, session, isDemo, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <p className="text-slate-500 dark:text-slate-400">
          Loading ConstructFlow...
        </p>
      </div>
    );
  }

  if (!session && !isDemo) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
      <Sidebar />

      <main className="flex-1">
        <Topbar />

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
