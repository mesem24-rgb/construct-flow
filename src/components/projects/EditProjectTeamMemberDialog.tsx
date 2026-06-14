"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/activity";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EditProjectTeamMemberDialogProps = {
  id: string;
  name: string;
  currentRole: string;
};

export default function EditProjectTeamMemberDialog({
  id,
  name,
  currentRole,
}: EditProjectTeamMemberDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);

  async function handleUpdateRole(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("project_team_members")
      .update({ role })
      .eq("id", id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity(`Project team role updated: ${name}`, "team");

    setOpen(false);
    router.refresh();
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
        <Pencil size={15} />
        Edit Role
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team Role</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdateRole} className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Updating role for {name}
          </p>

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            <option>Project Manager</option>
            <option>Superintendent</option>
            <option>Foreman</option>
            <option>Architect</option>
            <option>Engineer</option>
            <option>Owner Rep</option>
            <option>Subcontractor</option>
            <option>Vendor</option>
          </select>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900"
          >
            {loading ? "Saving..." : "Save Role"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}