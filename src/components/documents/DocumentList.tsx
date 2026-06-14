"use client";

import { useMemo, useState } from "react";

import DeleteDocumentButton from "@/components/documents/DeleteDocumentButton";

type Document = {
  id: string;
  name: string;
  file_url: string;
  uploaded_at: string;
  category?: string | null;
  file_size?: number | null;
  file_type?: string | null;
};

export default function DocumentList({ documents }: { documents: Document[] }) {
  const [search, setSearch] = useState("");

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [documents, search]);

  return (
    <div className="space-y-4">
      <input
        placeholder="Search documents..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-950"
      />

      {filteredDocuments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No documents match your search.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium">{doc.name}</p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {doc.category || "Other"}
                  </p>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>

                <DeleteDocumentButton id={doc.id} fileUrl={doc.file_url} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  View
                </a>

                <a
                  href={doc.file_url}
                  download
                  className="rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
