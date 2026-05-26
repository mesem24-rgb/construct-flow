"use client";

import { useMemo, useState } from "react";

import DeleteDocumentButton from "@/components/documents/DeleteDocumentButton";

type Document = {
  id: string;
  name: string;
  file_url: string;
  uploaded_at: string;
};

export default function DocumentList({
  documents,
}: {
  documents: Document[];
}) {
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
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
            >
              <a
                href={doc.file_url}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <p className="font-medium">{doc.name}</p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                </p>
              </a>

              <DeleteDocumentButton id={doc.id} fileUrl={doc.file_url} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}