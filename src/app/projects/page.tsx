import PageHeader from "@/components/ui/PageHeader";
import NewProjectDialog from "@/components/projects/NewProjectDialog";
import ProjectFilters from "@/components/projects/ProjectFilters";

import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Project = {
  id: string;
  name: string;
  status: string;
  budget: number;
  completion: number;
};

export default async function ProjectsPage() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, status, budget, completion")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const typedProjects = (projects ?? []) as Project[];

  const totalBudget = typedProjects.reduce(
    (sum, project) => sum + Number(project.budget ?? 0),
    0,
  );

  const avgCompletion =
    typedProjects.length > 0
      ? Math.round(
          typedProjects.reduce(
            (sum, project) => sum + Number(project.completion ?? 0),
            0,
          ) / typedProjects.length,
        )
      : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage all active construction projects."
        action={<NewProjectDialog />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Projects
          </p>

          <p className="mt-2 text-3xl font-bold">
            {typedProjects.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Budget
          </p>

          <p className="mt-2 text-3xl font-bold">
            ${totalBudget.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Avg Completion
          </p>

          <p className="mt-2 text-3xl font-bold">
            {avgCompletion}%
          </p>
        </div>
      </div>

      <ProjectFilters projects={typedProjects} />
    </div>
  );
}