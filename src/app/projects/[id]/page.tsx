import Link from "next/link";
import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

import { supabase } from "@/lib/supabase";

import NewTaskDialog from "@/components/tasks/NewTaskDialog";
import EditProjectDialog from "@/components/projects/EditProjectDialog";
import UploadDocumentDialog from "@/components/documents/UploadDocumentDialog";
import DocumentList from "@/components/documents/DocumentList";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";
import NewRfiDialog from "@/components/rfis/NewRfiDialog";
import NewChangeOrderDialog from "@/components/change-orders/NewChangeOrderDialog";
import NewDailyLogDialog from "@/components/daily-logs/NewDailyLogDialog";

export const dynamic = "force-dynamic";

// ===== Types =====
type Project = {
  id: string;
  name: string;
  status: string;
  budget: number;
  original_budget: number;
  revised_budget: number;
  completion: number;
};

type Task = {
  id: string;
  title: string;
  assignee: string | null;
  priority: string;
  status: string;
  due_date: string | null;
};

type Document = {
  id: string;
  name: string;
  file_url: string;
  uploaded_at: string;
};

type Rfi = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
};

type ChangeOrder = {
  id: string;
  title: string;
  status: string;
  amount: number;
};

type DailyLog = {
  id: string;
  weather: string | null;
  crew_count: number;
  work_completed: string | null;
  created_at: string;
};

type Submittal = {
  id: string;
  title: string;
  status: string;
  assigned_to: string | null;
  due_date: string | null;
};

type ActivityLog = {
  id: string;
  message: string;
  type: string;
  created_at: string;
};

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

// ===== Page =====
export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;

  // ===== Load project =====
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (projectError || !project) {
    notFound();
  }

  // ===== Load related project data =====
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  if (tasksError) {
    throw new Error(tasksError.message);
  }

  const { data: documents, error: documentsError } = await supabase
    .from("documents")
    .select("*")
    .eq("project_id", id)
    .order("uploaded_at", { ascending: false });

  if (documentsError) {
    throw new Error(documentsError.message);
  }

  const { data: rfis } = await supabase
    .from("rfis")
    .select("id, title, status, priority, due_date")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: submittals } = await supabase
    .from("submittals")
    .select("id, title, status, assigned_to, due_date")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: changeOrders } = await supabase
    .from("change_orders")
    .select("id, title, status, amount")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: dailyLogs } = await supabase
    .from("daily_logs")
    .select("id, weather, crew_count, work_completed, created_at")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: activities } = await supabase
    .from("activity_logs")
    .select("id, message, type, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  // ===== Typed data =====
  const typedProject = project as Project;
  const typedTasks = (tasks ?? []) as Task[];
  const typedDocuments = (documents ?? []) as Document[];
  const typedRfis = (rfis ?? []) as Rfi[];
  const typedSubmittals = (submittals ?? []) as Submittal[];
  const typedChangeOrders = (changeOrders ?? []) as ChangeOrder[];
  const typedDailyLogs = (dailyLogs ?? []) as DailyLog[];
  const typedActivities = (activities ?? []) as ActivityLog[];
  // ===== Financial calculations =====
  const approvedChangeOrders = typedChangeOrders
    .filter((order) => order.status === "Approved")
    .reduce((total, order) => total + Number(order.amount ?? 0), 0);

  const pendingChangeOrders = typedChangeOrders
    .filter((order) => order.status === "Pending")
    .reduce((total, order) => total + Number(order.amount ?? 0), 0);

  const originalBudget = Number(
    typedProject.original_budget ?? typedProject.budget ?? 0,
  );

  const revisedBudget = originalBudget + approvedChangeOrders;

  // ===== Project health calculations =====
  const openTasks = typedTasks.filter(
    (task) => task.status !== "Closed",
  ).length;

  const openRfis = typedRfis.filter((rfi) => rfi.status !== "Closed").length;

  const pendingSubmittals = typedSubmittals.filter(
    (submittal) =>
      submittal.status !== "Approved" && submittal.status !== "Rejected",
  ).length;

  const pendingChangeOrderCount = typedChangeOrders.filter(
    (order) => order.status === "Pending",
  ).length;

  let healthScore = 100;

  healthScore -= openTasks * 3;
  healthScore -= openRfis * 5;
  healthScore -= pendingSubmittals * 4;
  healthScore -= pendingChangeOrderCount * 10;

  healthScore = Math.max(0, healthScore);

  const healthLabel =
    healthScore >= 85 ? "Healthy" : healthScore >= 65 ? "Watch" : "At Risk";

  const healthColor =
    healthScore >= 85
      ? "text-emerald-600"
      : healthScore >= 65
        ? "text-yellow-600"
        : "text-red-600";

  // ===== UI =====
  return (
    <div className="space-y-6">
      <PageHeader
        title={typedProject.name}
        description="Commercial construction project overview."
        action={
          <div className="flex flex-col gap-3">
            {/* ===== Creation Actions ===== */}
            <div className="flex flex-wrap gap-3">
              <NewTaskDialog defaultProjectId={typedProject.id} />
              <NewRfiDialog defaultProjectId={typedProject.id} />
              <NewChangeOrderDialog defaultProjectId={typedProject.id} />
              <NewDailyLogDialog defaultProjectId={typedProject.id} />
            </div>

            {/* ===== Project Management Actions ===== */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/projects/${typedProject.id}/team`}
                className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Project Team
              </Link>

              <EditProjectDialog
                project={{
                  id: typedProject.id,
                  name: typedProject.name,
                  status: typedProject.status,
                  budget: typedProject.budget,
                  original_budget: typedProject.original_budget,
                  revised_budget: typedProject.revised_budget,
                  completion: typedProject.completion,
                }}
              />

              <DeleteProjectButton id={typedProject.id} />
            </div>
          </div>
        }
      />

      {/* ===== Project status row ===== */}
      <div className="flex items-center gap-3">
        <StatusBadge status={typedProject.status} />

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Budget: ${Number(revisedBudget).toLocaleString()}
        </p>
      </div>

      {/* ===== Project KPI cards ===== */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Project Health
          </p>

          <h3 className={`mt-2 text-3xl font-bold ${healthColor}`}>
            {healthScore}%
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {healthLabel}
          </p>
        </div>

        {/* ===== Completion Card ===== */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Completion
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {typedProject.completion}%
          </h3>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${typedProject.completion}%` }}
            />
          </div>
        </div>

        {[
          ["Open Tasks", openTasks],
          ["Open RFIs", openRfis],
          ["Pending CO", `$${pendingChangeOrders.toLocaleString()}`],
        ].map(([title, value]) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {title}
            </p>

            <h3 className="mt-2 text-3xl font-bold">{value}</h3>
          </div>
        ))}
      </div>

      {/* ===== Recent Activity ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Latest project updates and workflow changes
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Last 8 updates
          </span>
        </div>

        {typedActivities.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No activity has been recorded yet.
          </p>
        ) : (
          <div className="space-y-1">
            {typedActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 rounded-xl p-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <div className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-500" />

                <div className="flex-1">
                  <p className="font-medium">{activity.message}</p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="capitalize">{activity.type}</span>
                    <span>•</span>
                    <span>
                      {new Date(activity.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Project Financials ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-semibold">Project Financials</h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Original Budget", `$${originalBudget.toLocaleString()}`],
            ["Approved COs", `$${approvedChangeOrders.toLocaleString()}`],
            ["Pending COs", `$${pendingChangeOrders.toLocaleString()}`],
            ["Revised Budget", `$${revisedBudget.toLocaleString()}`],
          ].map(([title, value]) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {title}
              </p>

              <p className="mt-2 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Project workflow summary cards ===== */}
      <div className="grid gap-6 xl:grid-cols-4">
        {/* ===== Latest RFIs ===== */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-semibold">Latest RFIs</h2>

          {typedRfis.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No RFIs have been submitted for this project.
            </p>
          ) : (
            <div className="space-y-3">
              {typedRfis.map((rfi) => (
                <Link
                  key={rfi.id}
                  href="/rfis"
                  className="block rounded-xl border border-slate-200 p-4 transition hover:border-blue-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                >
                  <h3 className="font-medium">{rfi.title}</h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge status={rfi.status} />
                    <StatusBadge status={rfi.priority} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ===== Latest Submittals ===== */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-semibold">Latest Submittals</h2>

          {typedSubmittals.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No submittals have been submitted for this project.
            </p>
          ) : (
            <div className="space-y-3">
              {typedSubmittals.map((submittal) => (
                <Link
                  key={submittal.id}
                  href="/submittals"
                  className="block rounded-xl border border-slate-200 p-4 transition hover:border-blue-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                >
                  <h3 className="font-medium">{submittal.title}</h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge status={submittal.status} />
                  </div>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {submittal.assigned_to || "Unassigned"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ===== Change Orders ===== */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-semibold">Change Orders</h2>

          {typedChangeOrders.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No change orders have been created for this project.
            </p>
          ) : (
            <div className="space-y-3">
              {typedChangeOrders.map((order) => (
                <Link
                  key={order.id}
                  href="/change-orders"
                  className="block rounded-xl border border-slate-200 p-4 transition hover:border-blue-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium">{order.title}</h3>

                      <div className="mt-3">
                        <StatusBadge status={order.status} />
                      </div>
                    </div>

                    <p className="font-semibold">
                      ${Number(order.amount).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ===== Latest Daily Logs ===== */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-semibold">Latest Daily Logs</h2>

          {typedDailyLogs.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No daily logs have been submitted for this project.
            </p>
          ) : (
            <div className="space-y-3">
              {typedDailyLogs.map((log) => (
                <Link
                  key={log.id}
                  href="/daily-logs"
                  className="block rounded-xl border border-slate-200 p-4 transition hover:border-blue-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                >
                  <p className="font-medium">
                    {new Date(log.created_at).toLocaleDateString()}
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Crew: {log.crew_count} · Weather: {log.weather || "N/A"}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                    {log.work_completed || "No work summary."}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-semibold">Project Tasks</h2>

        {typedTasks.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No tasks have been added to this project yet.
          </p>
        ) : (
          <div className="space-y-4">
            {typedTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {task.assignee || "Unassigned"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <StatusBadge status={task.priority} />
                    <StatusBadge status={task.status} />

                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Due: {task.due_date || "No due date"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Project Documents ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Project Documents</h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Upload plans, permits, contracts, photos, and project files.
            </p>
          </div>

          <UploadDocumentDialog projectId={typedProject.id} />
        </div>

        {typedDocuments.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No documents have been uploaded yet.
          </p>
        ) : (
          <DocumentList documents={typedDocuments} />
        )}
      </div>
    </div>
  );
}
