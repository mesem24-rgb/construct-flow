"use client";

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

  return (
    <aside
  className={`bg-white ${
    mobile
      ? "h-full w-full"
      : "hidden w-64 border-r lg:block"
  }`}
>
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold tracking-tight">ConstructFlow</h1>
        <p className="text-sm text-slate-500">Construction Management</p>
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
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
