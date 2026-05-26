import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

import { supabase } from "@/lib/supabase";

import NewTaskDialog from "@/components/tasks/NewTaskDialog";
import EditProjectDialog from "@/components/projects/EditProjectDialog";
import UploadDocumentDialog from "@/components/documents/UploadDocumentDialog";
import DeleteDocumentButton from "@/components/documents/DeleteDocumentButton";
import DocumentList from "@/components/documents/DocumentList";

export const dynamic = "force-dynamic";

type Project = {
  id: string;
  name: string;
  status: string;
  budget: number;
  completion: number;
  open_tasks: number;
  pending_rfis: number;
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

  const typedProject = project as Project;
  const typedTasks = (tasks ?? []) as Task[];
  const typedDocuments = (documents ?? []) as Document[];

  return (
    <div className="space-y-6">
      <PageHeader
        title={typedProject.name}
        description="Commercial construction project overview."
        action={
          <div className="flex flex-wrap gap-3">
            <NewTaskDialog defaultProjectId={typedProject.id} />

            <EditProjectDialog
              project={{
                id: typedProject.id,
                name: typedProject.name,
                status: typedProject.status,
                budget: typedProject.budget,
                completion: typedProject.completion,
              }}
            />
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
          ["Budget", `$${Number(typedProject.budget).toLocaleString()}`],
          ["Completion", `${typedProject.completion}%`],
          ["Open Tasks", typedTasks.length],
          ["Documents", typedDocuments.length],
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
          <div className="space-y-3">
            {typedDocuments.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No documents have been uploaded yet.
              </p>
            ) : (
              <DocumentList documents={typedDocuments} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
