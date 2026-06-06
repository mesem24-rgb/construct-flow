"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import NewTaskDialog from "@/components/tasks/NewTaskDialog";
import NewRfiDialog from "@/components/rfis/NewRfiDialog";
import NewChangeOrderDialog from "@/components/change-orders/NewChangeOrderDialog";
import NewDailyLogDialog from "@/components/daily-logs/NewDailyLogDialog";
import EditProjectDialog from "@/components/projects/EditProjectDialog";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";

// ===== Types =====
type ProjectActionsMenuProps = {
  project: {
    id: string;
    name: string;
    status: string;
    budget: number;
    original_budget: number;
    revised_budget: number;
    completion: number;
  };
};

// ===== Component =====
export default function ProjectActionsMenu({
  project,
}: ProjectActionsMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900"
      >
        <MoreHorizontal size={18} />
        Project Actions
      </button>

      {open && (
  <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
    <button className="block w-full px-4 py-3 text-left text-sm hover:bg-slate-800">
      New Task
    </button>

    <button className="block w-full px-4 py-3 text-left text-sm hover:bg-slate-800">
      New RFI
    </button>

    <button className="block w-full px-4 py-3 text-left text-sm hover:bg-slate-800">
      New Change Order
    </button>

    <button className="block w-full px-4 py-3 text-left text-sm hover:bg-slate-800">
      New Daily Log
    </button>

    <div className="border-t border-slate-800" />

    <Link
      href={`/projects/${project.id}/team`}
      className="block px-4 py-3 text-sm hover:bg-slate-800"
    >
      Project Team
    </Link>

    <button className="block w-full px-4 py-3 text-left text-sm hover:bg-slate-800">
      Edit Project
    </button>

    <button className="block w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-slate-800">
      Delete Project
    </button>
  </div>
)}
    </div>
  );
}