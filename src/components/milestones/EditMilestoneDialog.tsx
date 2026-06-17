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

// ===== Types =====
type EditMilestoneDialogProps = {
  milestone: {
    id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    status: string;
    completion: number;
  };
};

// ===== Component =====
export default function EditMilestoneDialog({
  milestone,
}: EditMilestoneDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(milestone.title);
  const [description, setDescription] = useState(
    milestone.description ?? "",
  );
  const [dueDate, setDueDate] = useState(milestone.due_date ?? "");
  const [status, setStatus] = useState(milestone.status);
  const [completion, setCompletion] = useState(
    String(milestone.completion),
  );
  const [loading, setLoading] = useState(false);

  async function handleUpdateMilestone(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("milestones")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDate || null,
        status,
        completion: Number(completion),
      })
      .eq("id", milestone.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity(`Milestone updated: ${title}`, "milestone");

    setOpen(false);
    router.refresh();
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
        <Pencil size={15} />
        Edit
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Milestone</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdateMilestone} className="space-y-4">
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Milestone title"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            className="min-h-28 w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Delayed</option>
            <option>Complete</option>
          </select>

          <input
            type="number"
            min="0"
            max="100"
            value={completion}
            onChange={(event) => setCompletion(event.target.value)}
            placeholder="Completion %"
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