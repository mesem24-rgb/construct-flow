import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import NewTaskDialog from "@/components/tasks/NewTaskDialog";
import DeleteTaskButton from "@/components/tasks/DeleteTaskButton";

import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  title: string;
  assignee: string | null;
  priority: string;
  status: string;
  due_date: string | null;
};

export default async function TasksPage() {
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Track project tasks, punch list items, and follow-ups."
        action={<NewTaskDialog />}
      />

      <div className="grid gap-4">
        {(tasks as Task[]).map((task) => (
          <div
            key={task.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold">{task.title}</h2>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-5 lg:min-w-[760px]">
                <div>
                  <p className="text-slate-400">Assignee</p>
                  <p className="font-medium">{task.assignee || "Unassigned"}</p>
                </div>

                <div>
                  <p className="text-slate-400">Priority</p>
                  <StatusBadge status={task.priority} />
                </div>

                <div>
                  <p className="text-slate-400">Status</p>
                  <StatusBadge status={task.status} />
                </div>

                <div>
                  <p className="text-slate-400">Due</p>
                  <p className="font-medium">{task.due_date || "No due date"}</p>
                </div>

                <div className="flex items-end justify-start">
                  <DeleteTaskButton id={task.id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}