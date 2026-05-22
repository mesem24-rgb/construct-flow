import StatCard from "@/components/dashboard/StatCard";
import {
  FolderKanban,
  ClipboardList,
  FileWarning,
  DollarSign,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back
        </h1>

        <p className="text-slate-500">
          Here’s an overview of your construction projects.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Projects"
          value="12"
          icon={FolderKanban}
        />

        <StatCard
          title="Open Tasks"
          value="48"
          icon={ClipboardList}
        />

        <StatCard
          title="Pending RFIs"
          value="7"
          icon={FileWarning}
        />

        <StatCard
          title="Budget Remaining"
          value="$248K"
          icon={DollarSign}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">
            Active Projects
          </h2>

          <div className="space-y-4">
            {[
              "Gulf Coast Retail Center",
              "Bayview Medical Office",
              "Ocean Springs Warehouse",
            ].map((project) => (
              <div
                key={project}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <h3 className="font-medium">
                    {project}
                  </h3>

                  <p className="text-sm text-slate-500">
                    In Progress
                  </p>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
                  On Track
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Recent Activity
          </h2>

          <div className="space-y-4">
            {[
              "Daily log submitted",
              "Change order approved",
              "Inspection scheduled",
              "New document uploaded",
            ].map((activity) => (
              <div
                key={activity}
                className="rounded-xl bg-slate-50 p-4 text-sm"
              >
                {activity}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}