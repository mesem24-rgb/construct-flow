import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";
import NewProjectDialog from "@/components/projects/NewProjectDialog";

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage all active construction projects."
        action={<NewProjectDialog />}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">
                Project
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">
                Budget
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">
                Completion
              </th>
            </tr>
          </thead>

          <tbody>
            {(projects as Project[]).map((project) => (
              <tr
                key={project.id}
                className="border-b border-slate-200 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <td className="px-6 py-5 font-medium">
                  <Link
                    href={`/projects/${project.id}`}
                    className="transition hover:text-slate-500"
                  >
                    {project.name}
                  </Link>
                </td>

                <td className="px-6 py-5">
                  <StatusBadge status={project.status} />
                </td>

                <td className="px-6 py-5">
                  ${Number(project.budget).toLocaleString()}
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-slate-900 dark:bg-slate-100"
                        style={{ width: `${project.completion}%` }}
                      />
                    </div>

                    <span className="text-sm text-slate-500">
                      {project.completion}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}