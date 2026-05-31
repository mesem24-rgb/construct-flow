import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import NewChangeOrderDialog from "@/components/change-orders/NewChangeOrderDialog";

import EditChangeOrderDialog from "@/components/change-orders/EditChangeOrderDialog";
import DeleteChangeOrderButton from "@/components/change-orders/DeleteChangeOrderButton";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type ChangeOrder = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  status: string;
  submitted_by: string | null;
  created_at: string;
  projects: {
    name: string;
  } | null;
};

export default async function ChangeOrdersPage() {
  const { data: changeOrders, error } = await supabase
    .from("change_orders")
    .select(`
      *,
      projects (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const totalPending =
    changeOrders
      ?.filter((order) => order.status === "Pending")
      .reduce((total, order) => total + Number(order.amount ?? 0), 0) ?? 0;

  const totalApproved =
    changeOrders
      ?.filter((order) => order.status === "Approved")
      .reduce((total, order) => total + Number(order.amount ?? 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Change Orders"
        description="Track project scope changes, budget impact, and approval status."
        action={<NewChangeOrderDialog />}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pending Change Value
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            ${totalPending.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Approved Change Value
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            ${totalApproved.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="grid gap-4">
        {(changeOrders ?? []).map((order: ChangeOrder) => (
          <div
            key={order.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {order.projects?.name ?? "Unassigned Project"}
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  {order.title}
                </h2>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {order.description || "No description provided."}
                </p>
              </div>

              <div className="flex min-w-[220px] flex-col gap-2 lg:items-end">
                <StatusBadge status={order.status} />

                <p className="text-2xl font-bold">
                  ${Number(order.amount).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <span>
                Submitted by: {order.submitted_by || "Unknown"}
              </span>

 <EditChangeOrderDialog
    order={{
      id: order.id,
      title: order.title,
      description: order.description,
      amount: order.amount,
      status: order.status,
      submitted_by: order.submitted_by,
    }}
  />

  <DeleteChangeOrderButton id={order.id} />
</div>

              <span>
                Created {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
        ))}
      </div>
    </div>
  );
}