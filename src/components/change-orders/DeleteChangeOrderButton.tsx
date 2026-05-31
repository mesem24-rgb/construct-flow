"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/activity";

export default function DeleteChangeOrderButton({
  id,
}: {
  id: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = confirm("Delete this change order?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("change_orders")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity("Change order deleted", "change-order");

    router.refresh();
    window.location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
    >
      <Trash2 size={16} />
      Delete
    </button>
  );
}