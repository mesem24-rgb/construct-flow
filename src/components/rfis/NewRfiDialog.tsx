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
type Project = {
  id: string;
  name: string;
};

type Contact = {
  id: string;
  name: string;
};

type NewRfiDialogProps = {
  defaultProjectId?: string;
};

// ===== Component =====
export default function NewRfiDialog({ defaultProjectId }: NewRfiDialogProps) {
  const router = useRouter();

  // ===== State =====
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projectId, setProjectId] = useState(defaultProjectId ?? "");
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("Open");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== Load projects =====
  useEffect(() => {
    async function loadProjects() {
      const { data } = await supabase
        .from("projects")
        .select("id, name")
        .order("name");

      if (data) {
        setProjects(data);
        setProjectId(defaultProjectId || data[0]?.id || "");
      }
    }

    loadProjects();
  }, [defaultProjectId]);

  // ===== Load project team first, fallback to all contacts =====
  async function loadAssignableContacts(selectedProjectId: string) {
    const { data: teamData } = await supabase
      .from("project_team_members")
      .select(
        `
        contact:contacts (
          id,
          name
        )
      `,
      )
      .eq("project_id", selectedProjectId);

    const teamContacts =
      teamData
        ?.map((member: any) =>
          Array.isArray(member.contact) ? member.contact[0] : member.contact,
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

  // ===== Reload assignable contacts when project changes =====
  useEffect(() => {
    if (projectId) {
      loadAssignableContacts(projectId);
    }
  }, [projectId]);

  // ===== Create RFI =====
  async function handleCreateRfi(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("rfis").insert({
      project_id: projectId,
      title,
      question,
      assigned_to: assignedTo,
      status,
      priority,
      due_date: dueDate || null,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from("notifications").insert({
      title: "New RFI Created",
      message: `${title} was created and assigned to ${assignedTo || "Unassigned"}.`,
      category: "rfi",
      project_id: projectId,
      link: "/rfis",
    });

    await logActivity(`RFI created: ${title}`, "rfi");

    setTitle("");
    setQuestion("");
    setAssignedTo("");
    setStatus("Open");
    setPriority("Medium");
    setDueDate("");
    setOpen(false);

    router.refresh();
    window.location.reload();
  }

  // ===== UI =====
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900">
        New RFI
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create RFI</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateRfi} className="space-y-4">
          {/* Project */}
          <select
            required
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          {/* RFI title */}
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="RFI title"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          {/* Question */}
          <textarea
            required
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Question or clarification needed"
            className="min-h-32 w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          {/* Assigned contact from selected project team */}
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
            {loading ? "Creating..." : "Create RFI"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
