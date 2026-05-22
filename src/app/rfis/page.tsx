import PageHeader from "@/components/ui/PageHeader";

const rfis = [
  {
    id: "RFI-001",
    title: "Confirm wall framing detail at east entrance",
    project: "Gulf Coast Retail Center",
    status: "Open",
    priority: "High",
    submittedBy: "James Carter",
    dueDate: "May 25, 2026",
  },
  {
    id: "RFI-002",
    title: "Clarify electrical panel location",
    project: "Bayview Medical Office",
    status: "Pending Review",
    priority: "Medium",
    submittedBy: "Tyler Davis",
    dueDate: "May 27, 2026",
  },
  {
    id: "RFI-003",
    title: "Verify warehouse dock height adjustment",
    project: "Ocean Springs Warehouse",
    status: "Closed",
    priority: "Low",
    submittedBy: "Emily Brooks",
    dueDate: "May 30, 2026",
  },
];

export default function RFIsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
  title="RFIs"
  description="Track requests for information across active projects."
  actionLabel="New RFI"
/>

      <div className="grid gap-4">
        {rfis.map((rfi) => (
          <div
            key={rfi.id}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{rfi.id}</p>
                <h2 className="text-lg font-semibold">{rfi.title}</h2>
                <p className="text-sm text-slate-500">{rfi.project}</p>
              </div>

              <div className="grid gap-4 text-sm sm:grid-cols-4 lg:min-w-[620px]">
                <div>
                  <p className="text-slate-400">Status</p>
                  <p className="font-medium">{rfi.status}</p>
                </div>

                <div>
                  <p className="text-slate-400">Priority</p>
                  <p className="font-medium">{rfi.priority}</p>
                </div>

                <div>
                  <p className="text-slate-400">Submitted By</p>
                  <p className="font-medium">{rfi.submittedBy}</p>
                </div>

                <div>
                  <p className="text-slate-400">Due</p>
                  <p className="font-medium">{rfi.dueDate}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}