import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import NewChangeOrderDialog from "@/components/change-orders/NewChangeOrderDialog";
import EditChangeOrderDialog from "@/components/change-orders/EditChangeOrderDialog";
import DeleteChangeOrderButton from "@/components/change-orders/DeleteChangeOrderButton";

import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// ===== Types =====
type ChangeOrder = {
  id: string;
  project_id: string;
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

type ChangeOrdersPageProps = {
  searchParams: Promise<{
    project?: string;
  }>;
};

// ===== Page =====
export default async function ChangeOrdersPage({
  searchParams,
}: ChangeOrdersPageProps) {
  const { project } = await searchParams;

  // ===== Build query =====
  let query = supabase
    .from("change_orders")
    .select(
      `
      *,
      projects (
        name
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (project) {
    query = query.eq("project_id", project);
  }

  // ===== Load change orders =====
  const { data: changeOrders, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // ===== UI =====
  return (
    <div className="space-y-6">
      <PageHeader
        title={project ? "Project Change Orders" : "Change Orders"}
        description={
          project
            ? "Filtered change orders for the selected project."
            : "Track project scope changes, financial impact, and approval status."
        }
        action={<NewChangeOrderDialog defaultProjectId={project} />}
      />

      <div className="grid gap-4">
        {(changeOrders ?? []).map((order: ChangeOrder) => (
          <div
            key={order.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Change order header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {order.projects?.name ?? "Unassigned Project"}
                </p>

                <h2 className="mt-1 text-lg font-semibold">{order.title}</h2>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {order.description || "No description provided."}
                </p>
              </div>

              {/* Amount / status */}
              <div className="flex min-w-[220px] flex-col gap-3 lg:items-end">
                <p className="text-xl font-bold">
                  ${Number(order.amount ?? 0).toLocaleString()}
                </p>

                <StatusBadge status={order.status} />
              </div>
            </div>

            {/* Change order footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <span>
                Created {new Date(order.created_at).toLocaleDateString()}
              </span>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
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
            </div>
          </div>
        ))}

        {changeOrders?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No change orders found for this view.
          </div>
        )}
      </div>
    </div>
  );
}
