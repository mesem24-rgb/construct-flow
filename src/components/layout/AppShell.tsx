"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, loading } = useAuth();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!loading && !session && !isLoginPage) {
      router.push("/login");
    }

    if (!loading && session && isLoginPage) {
      router.push("/");
    }
  }, [loading, session, isLoginPage, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <p className="text-slate-500 dark:text-slate-400">
          Loading ConstructFlow...
        </p>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!session) {
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