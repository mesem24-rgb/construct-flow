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

type EditChangeOrderDialogProps = {
  order: {
    id: string;
    title: string;
    description: string | null;
    amount: number;
    status: string;
    submitted_by: string | null;
  };
};

export default function EditChangeOrderDialog({
  order,
}: EditChangeOrderDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(order.title);
  const [description, setDescription] = useState(order.description ?? "");
  const [amount, setAmount] = useState(String(order.amount));
  const [status, setStatus] = useState(order.status);
  const [submittedBy, setSubmittedBy] = useState(order.submitted_by ?? "");
  const [loading, setLoading] = useState(false);

  async function handleUpdate(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("change_orders")
      .update({
        title: title.trim(),
        description,
        amount: Number(amount),
        status,
        submitted_by: submittedBy,
      })
      .eq("id", order.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity(`Change order updated: ${title}`, "change-order");

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
          <DialogTitle>Edit Change Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-28 w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <input
            required
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
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
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}