"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  FileText,
  Users,
  CalendarDays,
  MessageSquareWarning,
  FilePenLine,
  type LucideIcon,
} from "lucide-react";

type SidebarLink = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const links: SidebarLink[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: ClipboardList },
  {
  name: "Task Board",
  href: "/tasks/board",
  icon: ClipboardList,
},
  { name: "Daily Logs", href: "/daily-logs", icon: CalendarDays },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "RFIs", href: "/rfis", icon: MessageSquareWarning },
  { name: "Change Orders", href: "/change-orders", icon: FilePenLine },
  { name: "Contacts", href: "/contacts", icon: Users },
];

export default function Sidebar({
  mobile = false,
}: {
  mobile?: boolean;
}){
  const pathname = usePathname();
  const { collapsed, toggleSidebar } = useSidebar();

  return (
    <aside
  className={`bg-white transition-all duration-300 dark:bg-slate-900 ${
  mobile
    ? "h-full w-full"
    : collapsed
    ? "hidden w-20 border-r border-slate-800 lg:block"
    : "hidden w-64 border-r border-slate-800 lg:block"
}`}
>
      <div className="relative border-b p-6">
        {!collapsed && (
  <>
    <h1 className="text-2xl font-bold tracking-tight">
      ConstructFlow
    </h1>

    <p className="text-sm text-slate-500">
      Construction Management
    </p>
  </>
)}
      </div>

      <nav className="space-y-2 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                isActive
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <button
  onClick={toggleSidebar}
  className="absolute -right-3 top-8 rounded-full border bg-white p-1 shadow-sm dark:bg-slate-900"
>
  {collapsed ? (
    <PanelLeftOpen size={16} />
  ) : (
    <PanelLeftClose size={16} />
  )}
</button>
              <Icon size={20} />
              {!collapsed && <span>{link.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
