import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage all active construction projects."
        actionLabel="New Project"
      />

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-slate-50">
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
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b transition hover:bg-slate-50"
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
                  {project.budget}
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-slate-900"
                        style={{ width: project.completion }}
                      />
                    </div>

                    <span className="text-sm text-slate-500">
                      {project.completion}
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