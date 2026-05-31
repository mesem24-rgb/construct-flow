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

export default function NewChangeOrderDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("0");
  const [status, setStatus] = useState("Pending");
  const [submittedBy, setSubmittedBy] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      const { data } = await supabase
        .from("projects")
        .select("id, name")
        .order("name");

      if (data) {
        setProjects(data);
        setProjectId(data[0]?.id ?? "");
      }
    }

    loadProjects();
  }, []);

  async function handleCreateChangeOrder(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("change_orders").insert({
      project_id: projectId,
      title,
      description,
      amount: Number(amount),
      status,
      submitted_by: submittedBy,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity(`Change order created: ${title}`, "change-order");

    setTitle("");
    setDescription("");
    setAmount("0");
    setStatus("Pending");
    setSubmittedBy("");
    setOpen(false);

    router.refresh();
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900">
        New Change Order
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Change Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateChangeOrder} className="space-y-4">
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
            placeholder="Change order title"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description or scope change details"
            className="min-h-28 w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Amount"
              className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            />

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            >
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Review</option>
            </select>
          </div>

          <input
            value={submittedBy}
            onChange={(event) => setSubmittedBy(event.target.value)}
            placeholder="Submitted by"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900"
          >
            {loading ? "Creating..." : "Create Change Order"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}