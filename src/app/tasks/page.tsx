import StatusBadge from "@/components/ui/StatusBadge";
import PageHeader from "@/components/ui/PageHeader";

const tasks = [
  {
    title: "Inspect framing on retail center",
    project: "Gulf Coast Retail Center",
    assignee: "James Carter",
    priority: "High",
    status: "Open",
    dueDate: "May 24",
  },
  {
    title: "Upload revised electrical drawings",
    project: "Bayview Medical Office",
    assignee: "Tyler Davis",
    priority: "Medium",
    status: "In Progress",
    dueDate: "May 27",
  },
  {
    title: "Confirm concrete delivery schedule",
    project: "Ocean Springs Warehouse",
    assignee: "Michael Sullivan",
    priority: "High",
    status: "Open",
    dueDate: "May 29",
  },
  {
    title: "Close out punch list items",
    project: "Gulf Coast Retail Center",
    assignee: "Emily Brooks",
    priority: "Low",
    status: "Review",
    dueDate: "Jun 2",
  },
];

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
  title="Tasks"
  description="Track project tasks, punch list items, and follow-ups."
  actionLabel="New Task"
/>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div
            key={task.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold">{task.title}</h2>
                <p className="text-sm text-slate-500">{task.project}</p>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-4 lg:min-w-[620px]">
                <div>
                  <p className="text-slate-400">Assignee</p>
                  <p className="font-medium">{task.assignee}</p>
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
                  <p className="font-medium">{task.dueDate}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}