"use client";

import { Bell, LogOut, Menu, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import ThemeToggle from "@/components/theme/ThemeToggle";
import { supabase } from "@/lib/supabase";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import Sidebar from "./Sidebar";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/projects": "Projects",
  "/tasks": "Tasks",
  "/daily-logs": "Daily Logs",
  "/documents": "Documents",
  "/rfis": "RFIs",
  "/change-orders": "Change Orders",
  "/contacts": "Contacts",
};

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/projects/")) {
    return "Project Details";
  }

  return pageTitles[pathname] ?? "ConstructFlow";
}

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const title = getPageTitle(pathname);

  async function handleLogout() {
    localStorage.removeItem("constructflow-demo");
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger className="rounded-lg border p-2">
              <Menu size={20} />
            </SheetTrigger>

            <SheetContent side="left" className="w-[280px] p-0">
              <Sidebar mobile />
            </SheetContent>
          </Sheet>
        </div>

        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 md:flex dark:border-slate-800 dark:bg-slate-950">
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search projects..."
            className="bg-transparent text-sm outline-none"
          />
        </div>

        <ThemeToggle />

        <button className="relative rounded-xl border p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell size={20} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button
          onClick={handleLogout}
          className="rounded-xl border p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Log out"
        >
          <LogOut size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium">Michael Sullivan</p>
            <p className="text-xs text-slate-500">Project Manager</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 font-medium text-slate-900">
            MS
          </div>
        </div>
      </div>
    </header>
  );
}