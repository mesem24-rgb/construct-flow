"use client";

import { useEffect, useState } from "react";
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

// ===== Types =====
type Contact = {
  id: string;
  name: string;
};

type EditTaskDialogProps = {
  task: {
    id: string;
    project_id: string;
    title: string;
    assignee: string | null;
    priority: string;
    status: string;
    due_date: string | null;
  };
};

// ===== Component =====
export default function EditTaskDialog({ task }: EditTaskDialogProps) {
  const router = useRouter();

  // ===== State =====
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [title, setTitle] = useState(task.title);
  const [assignee, setAssignee] = useState(task.assignee ?? "");
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(task.due_date ?? "");
  const [loading, setLoading] = useState(false);

  // ===== Load project team first, fallback to all contacts =====
  async function loadAssignableContacts(selectedProjectId: string) {
    const { data: teamData } = await supabase
      .from("project_team_members")
      .select(`
        contact:contacts (
          id,
          name
        )
      `)
      .eq("project_id", selectedProjectId);

    const teamContacts =
      teamData
        ?.map((member: any) =>
          Array.isArray(member.contact)
            ? member.contact[0]
            : member.contact,
        )
        .filter(Boolean) ?? [];

    if (teamContacts.length > 0) {
      setContacts(teamContacts);
      return;
    }

    const { data: allContacts } = await supabase
      .from("contacts")
      .select("id, name")
      .order("name");

    setContacts(allContacts ?? []);
  }

  // ===== Load contacts on mount =====
  useEffect(() => {
    if (task.project_id) {
      loadAssignableContacts(task.project_id);
    }
  }, [task.project_id]);

  // ===== Update task =====
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

  // ===== UI =====
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
          {/* Task title */}
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          {/* Assignee from project team */}
          <select
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">Unassigned</option>

            {contacts.map((contact) => (
              <option key={contact.id} value={contact.name}>
                {contact.name}
              </option>
            ))}
          </select>

          {/* Priority and status */}
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          {/* Due date */}
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          {/* Submit */}
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
