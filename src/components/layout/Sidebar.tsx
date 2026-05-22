import Link from "next/link";

import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  FileText,
  Users,
  type LucideIcon,
} from "lucide-react";

type SidebarLink = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const links: SidebarLink[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: ClipboardList,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    name: "Contacts",
    href: "/contacts",
    icon: Users,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white">
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold tracking-tight">ConstructFlow</h1>

        <p className="text-sm text-slate-500">Construction Management</p>
      </div>

      <nav className="space-y-2 p-4">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-100"
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
