"use client";

import { useState } from "react";
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
type UploadDocumentDialogProps = {
  projectId: string;
};

// ===== Component =====
export default function UploadDocumentDialog({
  projectId,
}: UploadDocumentDialogProps) {
  const router = useRouter();

  // ===== State =====
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("Other");
  const [loading, setLoading] = useState(false);

  // ===== Upload document =====
  async function handleUpload(event: React.FormEvent) {
    event.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    setLoading(true);

    const cleanFileName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-");

    const filePath = `${projectId}/${Date.now()}-${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("project-documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setLoading(false);
      alert(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("project-documents").getPublicUrl(filePath);

    const { error: dbError } = await supabase.from("documents").insert({
      project_id: projectId,
      name: file.name,
      file_url: publicUrl,
      category,
      file_size: file.size,
      file_type: file.type || "unknown",
    });

    if (dbError) {
      setLoading(false);
      alert(dbError.message);
      return;
    }

    await supabase.from("notifications").insert({
      title: "Document Uploaded",
      message: `${file.name} was uploaded to the project documents.`,
      category: "document",
      project_id: projectId,
      link: `/projects/${projectId}`,
    });

    await logActivity(`Document uploaded: ${file.name}`, "document");

    setFile(null);
    setCategory("Other");
    setLoading(false);
    setOpen(false);

    router.refresh();
    window.location.reload();
  }

  // ===== UI =====
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
          {/* Category */}
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            <option>Drawings</option>
            <option>Specifications</option>
            <option>Contracts</option>
            <option>Photos</option>
            <option>Permits</option>
            <option>Submittals</option>
            <option>Other</option>
          </select>

          {/* File */}
          <input
            type="file"
            required
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
            }}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          {/* Selected file details */}
          {file && (
            <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <p className="font-medium">{file.name}</p>
              <p>{(file.size / 1024).toFixed(1)} KB</p>
              <p>{file.type || "Unknown file type"}</p>
            </div>
          )}

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900"
          >
            {loading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}