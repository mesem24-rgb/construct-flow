"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type UploadDocumentDialogProps = {
  projectId: string;
};

export default function UploadDocumentDialog({
  projectId,
}: UploadDocumentDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault();

    if (!file) {
      return;
    }

    setLoading(true);

    const cleanFileName = file.name
  .toLowerCase()
  .replace(/[^a-z0-9.]/g, "-");

const filePath = `${projectId}/${Date.now()}-${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
  .from("documents")
  .upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from("documents")
      .insert({
        project_id: projectId,
        name: file.name,
        file_url: publicUrl,
      });

    setLoading(false);

    if (dbError) {
      alert(dbError.message);
      return;
    }

    setOpen(false);
    router.refresh();
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
        Upload Document
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            required
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
            }}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}