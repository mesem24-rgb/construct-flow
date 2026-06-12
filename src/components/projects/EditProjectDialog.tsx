"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/activity";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EditProjectDialogProps = {
  triggerText?: React.ReactNode;
  triggerClassName?: string;

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

export default function EditProjectDialog({
  project,
  triggerText = "Edit Project",
  triggerClassName = "rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900",
}: EditProjectDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(project.name);
  const [originalBudget, setOriginalBudget] = useState(
    String(project.original_budget ?? project.budget ?? 0),
  );
  const [status, setStatus] = useState(project.status);
  const [completion, setCompletion] = useState(String(project.completion));
  const [loading, setLoading] = useState(false);

  async function handleUpdateProject(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const budgetValue = Number(originalBudget || 0);

    const { data, error } = await supabase
      .from("projects")
      .update({
        name: name.trim(),
        budget: budgetValue,
        original_budget: budgetValue,
        revised_budget: budgetValue,
        status,
        completion: Number(completion),
      })
      .eq("id", project.id)
      .select();

    setLoading(false);

    if (error) {
      alert(error.message);
      console.error("Update error:", error);
      return;
    }

    if (!data || data.length === 0) {
      alert("No matching project was found to update.");
      return;
    }

    await logActivity(`Project updated: ${name}`, "project");

    setOpen(false);
    router.refresh();
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={triggerClassName}>
        {triggerText}
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
            value={originalBudget}
            onChange={(event) => setOriginalBudget(event.target.value)}
            placeholder="Original Budget"
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