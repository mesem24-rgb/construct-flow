import Link from "next/link";

import { supabase } from "@/lib/supabase";
import { calculateProjectHealth } from "@/lib/projectHealth";

type Project = {
  id: string;
  name: string;
  completion: number;
};

type Task = {
  project_id: string;
  status: string;
};

type Rfi = {
  project_id: string;
  status: string;
  due_date: string | null;
};

type DailyLog = {
  project_id: string;
  created_at: string;
};

type ChangeOrder = {
  project_id: string;
  status: string;
  amount: number;
};

function getHealthColor(label: string) {
  if (label === "Excellent") return "text-emerald-600";
  if (label === "Good") return "text-green-600";
  if (label === "Warning") return "text-yellow-600";
  if (label === "At Risk") return "text-orange-600";
  return "text-red-600";
}

export default async function ProjectHealthOverview() {
  const [
    { data: projects },
    { data: tasks },
    { data: rfis },
    { data: logs },
    { data: changeOrders },
  ] = await Promise.all([
    supabase.from("projects").select("id, name, completion"),
    supabase.from("tasks").select("project_id, status"),
    supabase.from("rfis").select("project_id, status, due_date"),
    supabase.from("daily_logs").select("project_id, created_at"),
    supabase.from("change_orders").select("project_id, status, amount"),
  ]);

  const now = new Date();

  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);

  const healthRows = ((projects ?? []) as Project[]).map((project) => {
    const projectTasks = ((tasks ?? []) as Task[]).filter(
      (task) => task.project_id === project.id,
    );

    const projectRfis = ((rfis ?? []) as Rfi[]).filter(
      (rfi) => rfi.project_id === project.id,
    );

    const projectLogs = ((logs ?? []) as DailyLog[]).filter(
      (log) =>
        log.project_id === project.id &&
        new Date(log.created_at) >= weekAgo,
    );

    const projectChangeOrders = (
      (changeOrders ?? []) as ChangeOrder[]
    ).filter((order) => order.project_id === project.id);

    const openTasks = projectTasks.filter(
      (task) => task.status !== "Closed",
    ).length;

    const openRfis = projectRfis.filter(
      (rfi) => rfi.status !== "Closed",
    ).length;

    const overdueRfis = projectRfis.filter((rfi) => {
      if (!rfi.due_date) return false;

      return rfi.status !== "Closed" && new Date(rfi.due_date) < now;
    }).length;

    const pendingChangeOrderValue = projectChangeOrders
      .filter((order) => order.status === "Pending")
      .reduce((total, order) => total + Number(order.amount ?? 0), 0);

    const health = calculateProjectHealth({
      completion: project.completion,
      openTasks,
      openRfis,
      overdueRfis,
      dailyLogsThisWeek: projectLogs.length,
      pendingChangeOrderValue,
    });

    return {
      ...project,
      openTasks,
      openRfis,
      overdueRfis,
      dailyLogsThisWeek: projectLogs.length,
      pendingChangeOrderValue,
      health,
    };
  });

  const sortedHealthRows = healthRows.sort(
    (a, b) => a.health.score - b.health.score,
  );

  const portfolioScore =
    healthRows.length > 0
      ? Math.round(
          healthRows.reduce((total, row) => total + row.health.score, 0) /
            healthRows.length,
        )
      : 100;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Project Health</h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Risk score based on tasks, RFIs, daily logs, change orders, and
            progress.
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium dark:bg-slate-800">
          Portfolio Health: {portfolioScore}%
        </div>
      </div>

      <div className="space-y-4">
        {sortedHealthRows.slice(0, 5).map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h3 className="font-medium">{project.name}</h3>

                <p
                  className={`mt-1 text-sm font-medium ${getHealthColor(
                    project.health.label,
                  )}`}
                >
                  {project.health.label} · {project.health.score}%
                </p>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-5 xl:min-w-[650px]">
                <div>
                  <p className="text-slate-400">Tasks</p>
                  <p className="font-medium">{project.openTasks}</p>
                </div>

                <div>
                  <p className="text-slate-400">Open RFIs</p>
                  <p className="font-medium">{project.openRfis}</p>
                </div>

                <div>
                  <p className="text-slate-400">Overdue</p>
                  <p className="font-medium">{project.overdueRfis}</p>
                </div>

                <div>
                  <p className="text-slate-400">Logs</p>
                  <p className="font-medium">{project.dailyLogsThisWeek}</p>
                </div>

                <div>
                  <p className="text-slate-400">Pending CO</p>
                  <p className="font-medium">
                    ${project.pendingChangeOrderValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}