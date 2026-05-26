import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  title: string;
  status: string;
  created_at: string;
};

export default async function ActivityFeed() {
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("id, title, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Recent Activity</h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Latest task updates across projects.
        </p>
      </div>

      <div className="space-y-4">
        {(tasks as Task[]).map((task) => (
          <div
            key={task.id}
            className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <p className="font-medium">{task.title}</p>

            <div className="mt-2 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>{task.status}</span>

              <span>
                {new Date(task.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}