"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { logActivity } from "@/lib/activity";
import { supabase } from "@/lib/supabase";

type DeleteDocumentButtonProps = {
  id: string;
  fileUrl: string;
};

export default function DeleteDocumentButton({
  id,
  fileUrl,
}: DeleteDocumentButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = confirm("Delete this document?");

    if (!confirmed) return;

    const urlParts = fileUrl.split("/documents/");
    const filePath = urlParts[1];

    if (filePath) {
      await supabase.storage.from("documents").remove([filePath]);
    }

    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity("Document deleted", "document");

    router.refresh();
    window.location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
    >
      <Trash2 size={16} />
    </button>
  );
}