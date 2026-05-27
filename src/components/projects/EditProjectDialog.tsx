"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logActivity } from "@/lib/activity";
import { supabase } from "@/lib/supabase";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EditProjectDialogProps = {
  project: {
    id: string;
    name: string;
    status: string;
    budget: number;
    completion: number;
  };
};

export default function EditProjectDialog({
  project,
}: EditProjectDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(project.name);
  const [budget, setBudget] = useState(String(project.budget));
  const [status, setStatus] = useState(project.status);
  const [completion, setCompletion] = useState(String(project.completion));
  const [loading, setLoading] = useState(false);

  async function handleUpdateProject(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const updates = {
      name: name.trim(),
      budget: Number(budget),
      status,
      completion: Number(completion),
    };

    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", project.id)
      .select();

    setLoading(false);

    if (error) {
      alert(error.message);
      console.error("Update error:", error);
      return;
    }

    console.log("Project id being updated:", project.id);
    console.log("Update result:", data);

    if (!data || data.length === 0) {
      alert("No matching project was found to update.");
      return;
    }

    alert("Project updated");

    await logActivity(`Project updated: ${name}`, "project");

    setOpen(false);
    router.refresh();
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900">
        Edit Project
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdateProject} className="space-y-4">
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Project name"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <input
            required
            type="number"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            placeholder="Budget"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            <option>Planning</option>
            <option>In Progress</option>
            <option>On Hold</option>
            <option>Completed</option>
          </select>

          <input
            required
            type="number"
            min="0"
            max="100"
            value={completion}
            onChange={(event) => setCompletion(event.target.value)}
            placeholder="Completion percentage"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}