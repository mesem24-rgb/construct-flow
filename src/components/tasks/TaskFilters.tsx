"use client";

import { useMemo, useState } from "react";

import StatusBadge from "@/components/ui/StatusBadge";

import EditTaskDialog from "@/components/tasks/EditTaskDialog";
import DeleteTaskButton from "@/components/tasks/DeleteTaskButton";

type Task = {
  id: string;
  title: string;
  assignee: string | null;
  priority: string;
  status: string;
  due_date: string | null;
};

export default function TaskFilters({ tasks }: { tasks: Task[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.assignee ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row">
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-900"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
        >
          <option>All</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Review</option>
          <option>Closed</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
    No tasks match your search or filter.
  </div>
) : (
  <div className="space-y-4">
    {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="font-medium">{task.title}</h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {task.assignee || "Unassigned"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={task.priority} />
                <StatusBadge status={task.status} />

                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Due: {task.due_date || "No due date"}
                </span>

                <EditTaskDialog task={task} />
                <DeleteTaskButton id={task.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
