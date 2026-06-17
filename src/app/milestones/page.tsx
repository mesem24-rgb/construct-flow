import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import NewMilestoneDialog from "@/components/milestones/NewMilestoneDialog";

import EditMilestoneDialog from "@/components/milestones/EditMilestoneDialog";
import DeleteMilestoneButton from "@/components/milestones/DeleteMilestoneButton";

import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// ===== Types =====
type Milestone = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
  completion: number;
  created_at: string;
  projects: {
    name: string;
  } | null;
};

type MilestonesPageProps = {
  searchParams: Promise<{
    project?: string;
  }>;
};

// ===== Page =====
export default async function MilestonesPage({
  searchParams,
}: MilestonesPageProps) {
  const { project } = await searchParams;

  // ===== Build query =====
  let query = supabase
    .from("milestones")
    .select(
      `
      *,
      projects (
        name
      )
    `,
    )
    .order("due_date", { ascending: true });

  if (project) {
    query = query.eq("project_id", project);
  }

  // ===== Load milestones =====
  const { data: milestones, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const typedMilestones = (milestones ?? []) as Milestone[];

  const totalMilestones = typedMilestones.length;

  const completedMilestones = typedMilestones.filter(
    (milestone) => milestone.status === "Complete",
  ).length;

  const delayedMilestones = typedMilestones.filter(
    (milestone) => milestone.status === "Delayed",
  ).length;

  const averageCompletion =
    totalMilestones > 0
      ? Math.round(
          typedMilestones.reduce(
            (sum, milestone) => sum + Number(milestone.completion ?? 0),
            0,
          ) / totalMilestones,
        )
      : 0;

  // ===== UI =====
  return (
    <div className="space-y-6">
      <PageHeader
        title={project ? "Project Milestones" : "Milestones"}
        description={
          project
            ? "Filtered schedule milestones for the selected project."
            : "Track project schedule milestones, due dates, and completion progress."
        }
        action={<NewMilestoneDialog defaultProjectId={project} />}
      />

      {/* ===== Summary Cards ===== */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          ["Total Milestones", totalMilestones],
          ["Completed", completedMilestones],
          ["Delayed", delayedMilestones],
          ["Avg Completion", `${averageCompletion}%`],
        ].map(([title, value]) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {title}
            </p>

            <p className="mt-2 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* ===== Milestone List ===== */}
      <div className="grid gap-4">
        {typedMilestones.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No milestones found for this view.
          </div>
        ) : (
          typedMilestones.map((milestone) => (
            <div
              key={milestone.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {milestone.projects?.name ?? "Unassigned Project"}
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    {milestone.title}
                  </h2>

                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {milestone.description || "No description provided."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <StatusBadge status={milestone.status} />

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    Due: {milestone.due_date || "No due date"}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Completion
                  </span>

                  <span className="font-medium">{milestone.completion}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${milestone.completion}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                <EditMilestoneDialog
                  milestone={{
                    id: milestone.id,
                    title: milestone.title,
                    description: milestone.description,
                    due_date: milestone.due_date,
                    status: milestone.status,
                    completion: milestone.completion,
                  }}
                />

                <DeleteMilestoneButton
                  id={milestone.id}
                  title={milestone.title}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
