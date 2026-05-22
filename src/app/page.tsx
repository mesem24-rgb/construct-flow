import BudgetChart from "@/components/dashboard/BudgetChart";
import StatCard from "@/components/dashboard/StatCard";
import TaskStatusChart from "@/components/dashboard/TaskStatusChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ActiveProjects from "@/components/dashboard/ActiveProjects";
import UpcomingSchedule from "@/components/dashboard/UpcomingSchedule";
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
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-slate-500">
          Here’s an overview of your construction projects.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active Projects" value="12" icon={FolderKanban} />
        <StatCard title="Open Tasks" value="48" icon={ClipboardList} />
        <StatCard title="Pending RFIs" value="7" icon={FileWarning} />
        <StatCard title="Budget Remaining" value="$248K" icon={DollarSign} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BudgetChart />
        <TaskStatusChart />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
  <ActiveProjects />
  <ActivityFeed />
  <UpcomingSchedule />
</div>
    </div>
  );
}
