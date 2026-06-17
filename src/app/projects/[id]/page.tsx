import Link from "next/link";
import { notFound } from "next/navigation";
import { FileImage, FileSpreadsheet, FileText } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import ProjectActionsMenu from "@/components/projects/ProjectActionsMenu";
import UploadDocumentDialog from "@/components/documents/UploadDocumentDialog";
import DocumentList from "@/components/documents/DocumentList";

import { supabase } from "@/lib/supabase";

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
  category: string | null;
  file_size: number | null;
  file_type: string | null;
};

type Rfi = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
};

type Milestone = {
  id: string;
  title: string;
  status: string;
  completion: number;
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

// ===== Helpers =====
function formatFileSize(size: number | null) {
  if (!size) return "Unknown size";

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getDocumentIcon(type: string | null) {
  if (!type) return <FileText size={18} />;

  if (type.includes("image")) {
    return <FileImage size={18} />;
  }

  if (type.includes("sheet") || type.includes("excel")) {
    return <FileSpreadsheet size={18} />;
  }

  return <FileText size={18} />;
}

// ===== Page =====
export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (projectError || !project) {
    notFound();
  }

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  if (tasksError) {
    throw new Error(tasksError.message);
  }

  const { data: latestDocuments, error: documentsError } = await supabase
    .from("documents")
    .select("id, name, file_url, uploaded_at, category, file_size, file_type")
    .eq("project_id", id)
    .order("uploaded_at", { ascending: false })
    .limit(5);

  if (documentsError) {
    throw new Error(documentsError.message);
  }

  const { data: allDocuments, error: allDocumentsError } = await supabase
    .from("documents")
    .select("id, name, file_url, uploaded_at, category, file_size, file_type")
    .eq("project_id", id)
    .order("uploaded_at", { ascending: false });

  if (allDocumentsError) {
    throw new Error(allDocumentsError.message);
  }

  const { data: milestones } = await supabase
    .from("milestones")
    .select(`id, title, status, completion, due_date`)
    .eq("project_id", id)
    .order("due_date", { ascending: true })
    .limit(5);

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

  const typedProject = project as Project;
  const typedTasks = (tasks ?? []) as Task[];
  const typedLatestDocuments = (latestDocuments ?? []) as Document[];
  const typedAllDocuments = (allDocuments ?? []) as Document[];
  const typedMilestones = (milestones ?? []) as Milestone[];
  const typedRfis = (rfis ?? []) as Rfi[];
  const typedSubmittals = (submittals ?? []) as Submittal[];
  const typedChangeOrders = (changeOrders ?? []) as ChangeOrder[];
  const typedDailyLogs = (dailyLogs ?? []) as DailyLog[];
  const typedActivities = (activities ?? []) as ActivityLog[];

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
  healthScore -= openTasks * 1;
  healthScore -= openRfis * 2;
  healthScore -= pendingSubmittals * 2;
  healthScore -= pendingChangeOrderCount * 3;
  healthScore = Math.max(0, healthScore);

  const healthLabel =
    healthScore >= 85 ? "Healthy" : healthScore >= 65 ? "Watch" : "At Risk";

  const healthColor =
    healthScore >= 85
      ? "text-emerald-600"
      : healthScore >= 65
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="space-y-6">
      <PageHeader
        title={typedProject.name}
        description="Commercial construction project overview."
        action={<ProjectActionsMenu project={typedProject} />}
      />

      {/* ===== Project Overview ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <StatusBadge status={typedProject.status} />

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Commercial Construction Project
            </p>

            <p className="mt-1 text-lg font-semibold">
              Budget: ${Number(revisedBudget).toLocaleString()}
            </p>
          </div>

          <div className="w-full lg:max-w-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Completion
              </span>

              <span className="text-sm font-medium">
                {typedProject.completion}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${typedProject.completion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== KPI Cards ===== */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
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

        {[
          ["Completion", `${typedProject.completion}%`],
          ["Open Tasks", openTasks],
          ["Open RFIs", openRfis],
          ["Pending CO", `$${pendingChangeOrders.toLocaleString()}`],
        ].map(([title, value]) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {title}
            </p>

            <h3 className="mt-2 text-3xl font-bold">{value}</h3>
          </div>
        ))}
      </div>

      {/* ===== Recent Activity ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
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
          <div className="grid gap-2 lg:grid-cols-2">
            {typedActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
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

      {/* ===== Latest Documents ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Latest Documents</h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Recently uploaded project files
            </p>
          </div>

          <UploadDocumentDialog projectId={typedProject.id} />
        </div>

        {typedLatestDocuments.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No documents have been uploaded yet.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {typedLatestDocuments.map((document) => (
              <a
                key={document.id}
                href={document.file_url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-slate-200 p-4 transition hover:border-blue-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-slate-500">
                    {getDocumentIcon(document.file_type)}
                  </div>

                  <div className="flex-1">
                    <h3 className="line-clamp-1 font-medium">
                      {document.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {document.category || "Other"}
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {document.file_type?.split("/")[1]?.toUpperCase() || "FILE"}
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  {formatFileSize(document.file_size)}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Uploaded {new Date(document.uploaded_at).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Project Milestones</h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Upcoming project schedule milestones.
          </p>
        </div>

        {typedMilestones.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No milestones have been added.
          </p>
        ) : (
          <div className="space-y-4">
            {typedMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{milestone.title}</h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Due {milestone.due_date || "No date"}
                    </p>
                  </div>

                  <StatusBadge status={milestone.status} />
                </div>

                <div className="mt-3">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{milestone.completion}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${milestone.completion}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Project Workflow Summary Cards ===== */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* RFIs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <h2 className="mb-3 text-lg font-semibold">Latest RFIs</h2>

          {typedRfis.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No RFIs have been submitted for this project.
            </p>
          ) : (
            <div className="space-y-3">
              {typedRfis.map((rfi) => (
                <Link
                  key={rfi.id}
                  href={`/rfis?project=${typedProject.id}`}
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

        {/* Submittals */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <h2 className="mb-3 text-lg font-semibold">Latest Submittals</h2>

          {typedSubmittals.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No submittals have been submitted for this project.
            </p>
          ) : (
            <div className="space-y-3">
              {typedSubmittals.map((submittal) => (
                <Link
                  key={submittal.id}
                  href={`/submittals?project=${typedProject.id}`}
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

        {/* Change Orders */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <h2 className="mb-3 text-lg font-semibold">Change Orders</h2>

          {typedChangeOrders.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No change orders have been created for this project.
            </p>
          ) : (
            <div className="space-y-3">
              {typedChangeOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/change-orders?project=${typedProject.id}`}
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

        {/* Daily Logs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <h2 className="mb-3 text-lg font-semibold">Latest Daily Logs</h2>

          {typedDailyLogs.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No daily logs have been submitted for this project.
            </p>
          ) : (
            <div className="space-y-3">
              {typedDailyLogs.map((log) => (
                <Link
                  key={log.id}
                  href={`/daily-logs?project=${typedProject.id}`}
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

      {/* ===== Project Financials ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold">Project Financials</h2>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
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

      {/* ===== Project Tasks ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
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

      {/* ===== All Project Documents ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">All Project Documents</h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Upload plans, permits, contracts, photos, and project files.
            </p>
          </div>

          <UploadDocumentDialog projectId={typedProject.id} />
        </div>

        {typedAllDocuments.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No documents have been uploaded yet.
          </p>
        ) : (
          <DocumentList documents={typedAllDocuments} />
        )}
      </div>
    </div>
  );
}
