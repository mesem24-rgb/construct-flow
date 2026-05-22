import { FileText, FileImage, FileArchive } from "lucide-react";

const documents = [
  {
    name: "Retail Center Site Plan.pdf",
    project: "Gulf Coast Retail Center",
    type: "Plan",
    uploadedBy: "Michael Sullivan",
    date: "May 22, 2026",
    icon: FileText,
  },
  {
    name: "Electrical Rough-In Photos.zip",
    project: "Gulf Coast Retail Center",
    type: "Photos",
    uploadedBy: "James Carter",
    date: "May 21, 2026",
    icon: FileArchive,
  },
  {
    name: "Medical Office Permit.pdf",
    project: "Bayview Medical Office",
    type: "Permit",
    uploadedBy: "Emily Brooks",
    date: "May 20, 2026",
    icon: FileText,
  },
  {
    name: "Warehouse Exterior Progress.jpg",
    project: "Ocean Springs Warehouse",
    type: "Photo",
    uploadedBy: "Tyler Davis",
    date: "May 19, 2026",
    icon: FileImage,
  },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
  title="Documents"
  description="Store plans, permits, contracts, photos, and project files."
  actionLabel="Upload Document"
/>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">
                Document
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">
                Project
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">
                Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">
                Uploaded By
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {documents.map((doc) => {
              const Icon = doc.icon;

              return (
                <tr key={doc.name} className="border-b transition hover:bg-slate-50">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3 font-medium">
                      <div className="rounded-xl bg-slate-100 p-2">
                        <Icon size={18} />
                      </div>
                      {doc.name}
                    </div>
                  </td>
                  <td className="px-6 py-5">{doc.project}</td>
                  <td className="px-6 py-5">{doc.type}</td>
                  <td className="px-6 py-5">{doc.uploadedBy}</td>
                  <td className="px-6 py-5">{doc.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}