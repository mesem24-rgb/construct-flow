import {
  ClipboardCheck,
  FileText,
  MessageSquareWarning,
  FilePenLine,
} from "lucide-react";

const activities = [
  {
    title: "Daily log submitted",
    project: "Gulf Coast Retail Center",
    icon: ClipboardCheck,
    time: "10 mins ago",
  },
  {
    title: "New RFI created",
    project: "Bayview Medical Office",
    icon: MessageSquareWarning,
    time: "32 mins ago",
  },
  {
    title: "Change order approved",
    project: "Ocean Springs Warehouse",
    icon: FilePenLine,
    time: "1 hour ago",
  },
  {
    title: "Document uploaded",
    project: "Retail Center Site Plan.pdf",
    icon: FileText,
    time: "2 hours ago",
  },
];

export default function ActivityFeed() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Recent Activity
        </h2>

        <p className="text-sm text-slate-500">
          Latest updates across all projects.
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.title}
              className="flex items-start gap-4 rounded-xl border p-4"
            >
              <div className="rounded-xl bg-slate-100 p-3">
                <Icon size={18} />
              </div>

              <div className="flex-1">
                <h3 className="font-medium">
                  {activity.title}
                </h3>

                <p className="text-sm text-slate-500">
                  {activity.project}
                </p>
              </div>

              <span className="text-xs text-slate-400">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}