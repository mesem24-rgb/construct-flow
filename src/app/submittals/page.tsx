import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import NewSubmittalDialog from "@/components/submittals/NewSubmittalDialog";

import EditSubmittalDialog from "@/components/submittals/EditSubmittalDialog";
import DeleteSubmittalButton from "@/components/submittals/DeleteSubmittalButton";

import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Submittal = {
  id: string;
  title: string;
  specification_section: string | null;
  description: string | null;
  status: string;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
  projects: {
    name: string;
  } | null;
};

export default async function SubmittalsPage() {
  const { data: submittals, error } = await supabase
    .from("submittals")
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submittals"
        description="Manage material, equipment, and shop drawing approvals."
        action={<NewSubmittalDialog />}
      />

      <div className="grid gap-4">
        {(submittals ?? []).map((submittal: Submittal) => (
          <div
            key={submittal.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {submittal.projects?.name ?? "Unassigned Project"}
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  {submittal.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Spec Section: {submittal.specification_section || "N/A"}
                </p>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {submittal.description || "No description provided."}
                </p>
              </div>

              <div className="flex min-w-[220px] flex-col gap-3 lg:items-end">
                <StatusBadge status={submittal.status} />

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Assigned: {submittal.assigned_to || "Unassigned"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
  <EditSubmittalDialog
    submittal={{
      id: submittal.id,
      title: submittal.title,
      specification_section: submittal.specification_section,
      description: submittal.description,
      status: submittal.status,
      assigned_to: submittal.assigned_to,
      due_date: submittal.due_date,
    }}
  />

  <DeleteSubmittalButton id={submittal.id} />
</div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <span>Due: {submittal.due_date || "No due date"}</span>

              <span>
                Created {new Date(submittal.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}