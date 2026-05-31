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

type NewRfiDialogProps = {
  defaultProjectId?: string;
};

export default function NewRfiDialog({
  defaultProjectId,
}: NewRfiDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState(defaultProjectId ?? "");
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState("Open");
  const [priority, setPriority] = useState("Medium");
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
        setProjectId(defaultProjectId ?? data[0]?.id ?? "");
      }
    }

    loadProjects();
  }, [defaultProjectId]);

  async function handleCreateRfi(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("rfis").insert({
      project_id: projectId,
      title,
      question,
      status,
      priority,
      due_date: dueDate || null,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity(`RFI created: ${title}`, "rfi");

    setTitle("");
    setQuestion("");
    setStatus("Open");
    setPriority("Medium");
    setDueDate("");
    setOpen(false);

    router.refresh();
    window.location.reload();
  }

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
            placeholder="RFI title"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <textarea
            required
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Question or clarification needed"
            className="min-h-32 w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

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
            {loading ? "Creating..." : "Create RFI"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}