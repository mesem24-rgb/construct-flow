"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function NewProjectDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("Planning");
  const [loading, setLoading] = useState(false);

  async function handleCreateProject(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("projects").insert({
      name,
      budget: Number(budget),
      status,
      completion: 0,
      open_tasks: 0,
      pending_rfis: 0,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setBudget("");
    setStatus("Planning");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
     <DialogTrigger className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900">
  New Project
</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateProject} className="space-y-4">
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
          </select>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}