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

type EditTaskDialogProps = {
  task: {
    id: string;
    title: string;
    assignee: string | null;
    priority: string;
    status: string;
    due_date: string | null;
  };
};

export default function EditTaskDialog({ task }: EditTaskDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [assignee, setAssignee] = useState(task.assignee ?? "");
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(task.due_date ?? "");
  const [loading, setLoading] = useState(false);

 async function handleUpdateTask(event: React.FormEvent) {
  event.preventDefault();
  setLoading(true);

  const { error } = await supabase
    .from("tasks")
    .update({
      title: title.trim(),
      assignee,
      priority,
      status,
      due_date: dueDate || null,
    })
    .eq("id", task.id);

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  await logActivity(`Task updated: ${title}`, "task");

  setOpen(false);
  router.refresh();
  window.location.reload();
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
        Edit
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdateTask} className="space-y-4">
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <input
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            placeholder="Assignee"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            <option>Open</option>
            <option>In Progress</option>
            <option>Review</option>
            <option>Closed</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
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
