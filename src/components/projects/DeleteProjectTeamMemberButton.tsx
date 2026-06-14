"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/activity";

type DeleteProjectTeamMemberButtonProps = {
  id: string;
  name?: string;
};

export default function DeleteProjectTeamMemberButton({
  id,
  name = "team member",
}: DeleteProjectTeamMemberButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = confirm(`Remove ${name} from this project?`);

    if (!confirmed) return;

    const { error } = await supabase
      .from("project_team_members")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity(`Project team member removed: ${name}`, "team");

    router.refresh();
    window.location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
    >
      <Trash2 size={15} />
      Remove
    </button>
  );
}