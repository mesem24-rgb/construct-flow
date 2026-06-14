"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ClipboardList,
  FileQuestion,
  MoreHorizontal,
  Pencil,
  Receipt,
  Trash2,
  Users,
  ClipboardPenLine,
} from "lucide-react";

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

// ===== Shared menu item style =====
const menuItemClass =
  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition hover:bg-white/5";

// ===== Component =====
export default function ProjectActionsMenu({
  project,
}: ProjectActionsMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* ===== Trigger ===== */}
      <button
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium bg-slate-800 text-slate-200 transition hover:bg-slate-600"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreHorizontal size={18} />
        Actions
      </button>

      {/* ===== Dropdown ===== */}
      {open && (
        <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-1.5 text-white shadow-2xl">
          {/* ===== Creation Actions ===== */}
          <NewTaskDialog
            defaultProjectId={project.id}
            triggerText={
              <>
                <ClipboardList size={14} />
                <span>New Task</span>
              </>
            }
            triggerClassName={menuItemClass}
          />

          <NewRfiDialog
            defaultProjectId={project.id}
            triggerText={
              <>
                <FileQuestion size={14} />
                <span>New RFI</span>
              </>
            }
            triggerClassName={menuItemClass}
          />

          <NewChangeOrderDialog
            defaultProjectId={project.id}
            triggerText={
              <>
                <Receipt size={14} />
                <span>New Change Order</span>
              </>
            }
            triggerClassName={menuItemClass}
          />

          <NewDailyLogDialog
            defaultProjectId={project.id}
            triggerText={
              <>
                <ClipboardPenLine size={14} />
                <span>New Daily Log</span>
              </>
            }
            triggerClassName={menuItemClass}
          />

          <div className="my-1 border-t border-slate-800" />

          {/* ===== Project Navigation ===== */}
          <Link
            href={`/projects/${project.id}/team`}
            onClick={() => setOpen(false)}
            className={menuItemClass}
          >
            <Users size={14} />
            <span>Project Team</span>
          </Link>

          <div className="my-1 border-t border-slate-800" />

          {/* ===== Management Actions ===== */}
          <EditProjectDialog
            project={project}
            triggerText={
              <>
                <Pencil size={14} />
                <span>Edit Project</span>
              </>
            }
            triggerClassName={menuItemClass}
          />

          <DeleteProjectButton
            id={project.id}
            triggerText="Delete Project"
            className={`${menuItemClass} text-red-400 hover:bg-red-950/40`}
          />
        </div>
      )}
    </div>
  );
}