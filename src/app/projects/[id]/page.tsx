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

type Project = {
  id: string;
  name: string;
  status: string;
  budget: number;
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

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

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

  const typedProject = project as Project;
  const typedTasks = (tasks ?? []) as Task[];
  const typedDocuments = (documents ?? []) as Document[];
  const typedRfis = (rfis ?? []) as Rfi[];
  const typedChangeOrders = (changeOrders ?? []) as ChangeOrder[];
  const typedDailyLogs = (dailyLogs ?? []) as DailyLog[];

  const pendingChangeOrderValue = typedChangeOrders
    .filter((order) => order.status === "Pending")
    .reduce((total, order) => total + Number(order.amount ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={typedProject.name}
        description="Commercial construction project overview."
        action={
          <div className="flex flex-wrap gap-3">
            <NewTaskDialog defaultProjectId={typedProject.id} />
            <NewRfiDialog defaultProjectId={typedProject.id} />
            <NewChangeOrderDialog defaultProjectId={typedProject.id} />
            <NewDailyLogDialog defaultProjectId={typedProject.id} />

            <EditProjectDialog
              project={{
                id: typedProject.id,
                name: typedProject.name,
                status: typedProject.status,
                budget: typedProject.budget,
                completion: typedProject.completion,
              }}
            />

            <DeleteProjectButton id={typedProject.id} />
          </div>
        }
      />

      <div className="flex items-center gap-3">
        <StatusBadge status={typedProject.status} />

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Budget: ${Number(typedProject.budget).toLocaleString()}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Completion", `${typedProject.completion}%`],
          [
            "Open Tasks",
            typedTasks.filter((task) => task.status !== "Closed").length,
          ],
          [
            "Open RFIs",
            typedRfis.filter((rfi) => rfi.status !== "Closed").length,
          ],
          ["Pending CO", `$${pendingChangeOrderValue.toLocaleString()}`],
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

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-semibold">Latest RFIs</h2>

          {typedRfis.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No RFIs have been submitted for this project.
            </p>
          ) : (
            <div className="space-y-3">
              {typedRfis.map((rfi) => (
                <div
                  key={rfi.id}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <h3 className="font-medium">{rfi.title}</h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge status={rfi.status} />
                    <StatusBadge status={rfi.priority} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-semibold">Change Orders</h2>

          {typedChangeOrders.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No change orders have been created for this project.
            </p>
          ) : (
            <div className="space-y-3">
              {typedChangeOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
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
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-semibold">Latest Daily Logs</h2>

          {typedDailyLogs.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No daily logs have been submitted for this project.
            </p>
          ) : (
            <div className="space-y-3">
              {typedDailyLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
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
                </div>
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
