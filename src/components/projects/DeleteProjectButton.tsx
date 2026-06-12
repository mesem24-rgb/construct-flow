"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { logActivity } from "@/lib/activity";
import { supabase } from "@/lib/supabase";

type DeleteProjectButtonProps = {
  id: string;
  triggerText?: string;
  className?: string;
};

export default function DeleteProjectButton({
  id,
  triggerText = "Delete Project",
  className,
}: DeleteProjectButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = confirm(
      "Delete this project? This will also remove related tasks and documents."
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity("Project deleted", "project");

    router.push("/projects");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className={className ?? "inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"}
    >
      <Trash2 size={16} />
      {triggerText}
    </button>
  );
}