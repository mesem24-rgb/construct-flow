"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import StatusBadge from "@/components/ui/StatusBadge";

type Project = {
  id: string;
  name: string;
  status: string;
  budget: number;
  completion: number;
};

export default function ProjectFilters({
  projects,
}: {
  projects: Project[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row">
        <input
          placeholder="Search projects..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-900"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
        >
          <option>All</option>
          <option>Planning</option>
          <option>In Progress</option>
          <option>On Hold</option>
          <option>Completed</option>
        </select>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No projects match your search or filter.
        </div>
      ) : (
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
              {filteredProjects.map((project) => (
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
                          style={{
                            width: `${project.completion}%`,
                          }}
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
      )}
    </div>
  );
}