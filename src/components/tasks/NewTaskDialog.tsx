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

type Project = {
  id: string;
  name: string;
};

type Contact = {
  id: string;
  name: string;
};

type NewTaskDialogProps = {
  defaultProjectId?: string;
};

export default function NewTaskDialog({
  defaultProjectId,
}: NewTaskDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projectId, setProjectId] = useState(defaultProjectId ?? "");
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Open");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (projectId) {
      loadAssignableContacts(projectId);
    }
  }, [projectId]);

  async function handleCreateTask(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("tasks").insert({
      project_id: projectId,
      title,
      assignee,
      priority,
      status,
      due_date: dueDate || null,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from("notifications").insert({
      title: "New Task Created",
      message: `${title} was assigned to ${assignee || "Unassigned"}.`,
      category: "task",
      project_id: projectId,
      link: "/tasks",
    });

    await logActivity(`Task created: ${title}`, "task");

    setTitle("");
    setAssignee("");
    setPriority("Medium");
    setStatus("Open");
    setDueDate("");
    setOpen(false);

    router.refresh();
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900">
        New Task
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateTask} className="space-y-4">
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

          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

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
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
