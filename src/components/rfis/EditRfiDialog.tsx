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

type EditRfiDialogProps = {
  rfi: {
    id: string;
    project_id: string;
    title: string;
    question: string | null;
    assigned_to: string | null;
    status: string;
    priority: string;
    due_date: string | null;
  };
};

// ===== Component =====
export default function EditRfiDialog({
  rfi,
}: EditRfiDialogProps) {
  const router = useRouter();

  // ===== State =====
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [title, setTitle] = useState(rfi.title);
  const [question, setQuestion] = useState(rfi.question ?? "");
  const [assignedTo, setAssignedTo] = useState(
    rfi.assigned_to ?? "",
  );
  const [status, setStatus] = useState(rfi.status);
  const [priority, setPriority] = useState(rfi.priority);
  const [dueDate, setDueDate] = useState(rfi.due_date ?? "");
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

  // ===== Load contacts =====
  useEffect(() => {
    if (rfi.project_id) {
      loadAssignableContacts(rfi.project_id);
    }
  }, [rfi.project_id]);

  // ===== Update RFI =====
  async function handleUpdateRfi(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("rfis")
      .update({
        title: title.trim(),
        question,
        assigned_to: assignedTo,
        status,
        priority,
        due_date: dueDate || null,
      })
      .eq("id", rfi.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity(`RFI updated: ${title}`, "rfi");

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
          <DialogTitle>Edit RFI</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdateRfi} className="space-y-4">
          {/* Title */}
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          {/* Question */}
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="min-h-32 w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          {/* Assigned contact */}
          <select
            value={assignedTo}
            onChange={(event) => setAssignedTo(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">Unassigned</option>

            {contacts.map((contact) => (
              <option key={contact.id} value={contact.name}>
                {contact.name}
              </option>
            ))}
          </select>

          {/* Status and priority */}
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            >
              <option>Open</option>
              <option>In Review</option>
              <option>Answered</option>
              <option>Closed</option>
            </select>

            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
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