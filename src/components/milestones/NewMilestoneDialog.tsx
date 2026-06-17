"use client";

import { useEffect, useState } from "react";
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

// ===== Types =====
type NewMilestoneDialogProps = {
  defaultProjectId?: string;
};

type Project = {
  id: string;
  name: string;
};

// ===== Component =====
export default function NewMilestoneDialog({
  defaultProjectId,
}: NewMilestoneDialogProps) {
  const router = useRouter();

  // ===== State =====
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState(defaultProjectId ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [completion, setCompletion] = useState("0");
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
      }
    }

    loadProjects();
  }, []);

  // ===== Create milestone =====
  async function handleCreateMilestone(event: React.FormEvent) {
    event.preventDefault();

    if (!projectId) {
      alert("Please select a project.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("milestones").insert({
      project_id: projectId,
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate || null,
      status,
      completion: Number(completion),
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from("notifications").insert({
      title: "Milestone Created",
      message: `${title} was added to the project schedule.`,
      category: "milestone",
      project_id: projectId,
      link: `/milestones?project=${projectId}`,
    });

    await logActivity(`Milestone created: ${title}`, "milestone");

    setTitle("");
    setDescription("");
    setDueDate("");
    setStatus("Not Started");
    setCompletion("0");
    setOpen(false);

    router.refresh();
    window.location.reload();
  }

  // ===== UI =====
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900">
        New Milestone
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Milestone</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateMilestone} className="space-y-4">
          {!defaultProjectId && (
            <select
              required
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="">Select Project</option>

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          )}

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
            {loading ? "Creating..." : "Create Milestone"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}