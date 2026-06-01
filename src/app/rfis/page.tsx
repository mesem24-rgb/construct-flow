import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import NewRfiDialog from "@/components/rfis/NewRfiDialog";
import EditRfiDialog from "@/components/rfis/EditRfiDialog";
import DeleteRfiButton from "@/components/rfis/DeleteRfiButton";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Rfi = {
  id: string;
  title: string;
  question: string;
  assigned_to: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
  projects: {
    name: string;
  } | null;
};

export default async function RFIsPage() {
  const { data: rfis, error } = await supabase
    .from("rfis")
    .select(
      `
      *,
      projects (
        name
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="RFIs"
        description="Track project questions, clarifications, priorities, and due dates."
        action={<NewRfiDialog />}
      />

      <div className="grid gap-4">
        {(rfis ?? []).map((rfi: Rfi) => (
          <div
            key={rfi.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {rfi.projects?.name ?? "Unassigned Project"}
                </p>

                <h2 className="mt-1 text-lg font-semibold">{rfi.title}</h2>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {rfi.question}
                </p>
              </div>

              <div className="flex min-w-[260px] flex-wrap gap-3 lg:justify-end">
                <StatusBadge status={rfi.status} />
                <StatusBadge status={rfi.priority} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span>Due: {rfi.due_date || "No due date"}</span>

                <span>
                  Created {new Date(rfi.created_at).toLocaleDateString()}
                </span>

                <EditRfiDialog
                  rfi={{
                    id: rfi.id,
                    title: rfi.title,
                    question: rfi.question,
                    assigned_to: rfi.assigned_to,
                    status: rfi.status,
                    priority: rfi.priority,
                    due_date: rfi.due_date,
                  }}
                />

                <DeleteRfiButton id={rfi.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
