import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  title: string;
  assignee: string;
  priority: string;
  status: string;
  due_date: string;
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
        actionLabel="New Task"
      />

      <div className="grid gap-4">
        {(tasks as Task[]).map((task) => (
          <div
            key={task.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold">
                  {task.title}
                </h2>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-4 lg:min-w-[620px]">
                <div>
                  <p className="text-slate-400">
                    Assignee
                  </p>

                  <p className="font-medium">
                    {task.assignee}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">
                    Priority
                  </p>

                  <StatusBadge status={task.priority} />
                </div>

                <div>
                  <p className="text-slate-400">
                    Status
                  </p>

                  <StatusBadge status={task.status} />
                </div>

                <div>
                  <p className="text-slate-400">
                    Due
                  </p>

                  <p className="font-medium">
                    {task.due_date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
