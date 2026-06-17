"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/activity";

type DeleteMilestoneButtonProps = {
  id: string;
  title: string;
};

export default function DeleteMilestoneButton({
  id,
  title,
}: DeleteMilestoneButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = confirm(`Delete milestone: ${title}?`);

    if (!confirmed) return;

    const { error } = await supabase
      .from("milestones")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity(`Milestone deleted: ${title}`, "milestone");

    router.refresh();
    window.location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
    >
      <Trash2 size={15} />
      Delete
    </button>
  );
}