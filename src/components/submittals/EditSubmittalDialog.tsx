"use client";

import { useState } from "react";
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

type EditSubmittalDialogProps = {
  submittal: {
    id: string;
    title: string;
    specification_section: string | null;
    description: string | null;
    status: string;
    assigned_to: string | null;
    due_date: string | null;
  };
};

export default function EditSubmittalDialog({
  submittal,
}: EditSubmittalDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(submittal.title);
  const [specificationSection, setSpecificationSection] = useState(
    submittal.specification_section ?? "",
  );
  const [description, setDescription] = useState(
    submittal.description ?? "",
  );
  const [status, setStatus] = useState(submittal.status);
  const [assignedTo, setAssignedTo] = useState(
    submittal.assigned_to ?? "",
  );
  const [dueDate, setDueDate] = useState(submittal.due_date ?? "");
  const [loading, setLoading] = useState(false);

  async function handleUpdateSubmittal(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("submittals")
      .update({
        title: title.trim(),
        specification_section: specificationSection,
        description,
        status,
        assigned_to: assignedTo,
        due_date: dueDate || null,
      })
      .eq("id", submittal.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity(`Submittal updated: ${title}`, "submittal");

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
          <DialogTitle>Edit Submittal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdateSubmittal} className="space-y-4">
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <input
            value={specificationSection}
            onChange={(event) =>
              setSpecificationSection(event.target.value)
            }
            placeholder="Specification section"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-28 w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            >
              <option>Draft</option>
              <option>Submitted</option>
              <option>In Review</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Revise and Resubmit</option>
            </select>

            <input
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              placeholder="Assigned to"
              className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            />
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
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}