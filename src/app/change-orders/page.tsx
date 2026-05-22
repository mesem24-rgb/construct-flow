import PageHeader from "@/components/ui/PageHeader";

const changeOrders = [
  {
    id: "CO-001",
    title: "Upgrade storefront glass package",
    project: "Gulf Coast Retail Center",
    amount: "$18,500",
    status: "Approved",
    submittedBy: "Amanda Reed",
    date: "May 20, 2026",
  },
  {
    id: "CO-002",
    title: "Additional electrical rough-in work",
    project: "Bayview Medical Office",
    amount: "$7,200",
    status: "Pending",
    submittedBy: "Tyler Davis",
    date: "May 21, 2026",
  },
  {
    id: "CO-003",
    title: "Warehouse dock adjustment",
    project: "Ocean Springs Warehouse",
    amount: "$12,900",
    status: "Review",
    submittedBy: "James Carter",
    date: "May 22, 2026",
  },
];

export default function ChangeOrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
  title="Change Orders"
  description="Track approved, pending, and reviewed project scope changes."
  actionLabel="New Change Order"
/>

      <div className="grid gap-4">
        {changeOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {order.id}
                </p>
                <h2 className="text-lg font-semibold">
                  {order.title}
                </h2>
                <p className="text-sm text-slate-500">
                  {order.project}
                </p>
              </div>

              <div className="grid gap-4 text-sm sm:grid-cols-4 lg:min-w-[620px]">
                <div>
                  <p className="text-slate-400">Amount</p>
                  <p className="font-medium">{order.amount}</p>
                </div>

                <div>
                  <p className="text-slate-400">Status</p>
                  <p className="font-medium">{order.status}</p>
                </div>

                <div>
                  <p className="text-slate-400">Submitted By</p>
                  <p className="font-medium">{order.submittedBy}</p>
                </div>

                <div>
                  <p className="text-slate-400">Date</p>
                  <p className="font-medium">{order.date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}