import BudgetChart from "@/components/dashboard/BudgetChart";
import StatCard from "@/components/dashboard/StatCard";
import TaskStatusChart from "@/components/dashboard/TaskStatusChart";
import ActiveProjects from "@/components/dashboard/ActiveProjects";
import UpcomingSchedule from "@/components/dashboard/UpcomingSchedule";
import DashboardRealtime from "@/components/dashboard/DashboardRealtime";
import ProjectHealthOverview from "@/components/dashboard/ProjectHealthOverview";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";

import { supabase } from "@/lib/supabase";

import {
  FolderKanban,
  ClipboardList,
  FileWarning,
  DollarSign,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: openTaskCount } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .neq("status", "Closed");

  const { data: projects } = await supabase
    .from("projects")
    .select("name, budget, completion");

  const { data: tasks } = await supabase.from("tasks").select("status");

  const { data: changeOrders } = await supabase
    .from("change_orders")
    .select("amount, status");

  const totalBudget =
    projects?.reduce((total, project) => {
      return total + Number(project.budget ?? 0);
    }, 0) ?? 0;

  const pendingChangeOrderValue =
    changeOrders
      ?.filter((order) => order.status === "Pending")
      .reduce((total, order) => total + Number(order.amount ?? 0), 0) ?? 0;

  const { count: openRfiCount } = await supabase
    .from("rfis")
    .select("*", { count: "exact", head: true })
    .neq("status", "Closed");

  const { count: documentCount } = await supabase
    .from("documents")
    .select("*", {
      count: "exact",
      head: true,
    });

  const { count: teamMemberCount } = await supabase
    .from("project_team_members")
    .select("*", {
      count: "exact",
      head: true,
    });

  const taskStatusData = [
    {
      name: "Open",
      value: tasks?.filter((task) => task.status === "Open").length ?? 0,
    },
    {
      name: "In Progress",
      value: tasks?.filter((task) => task.status === "In Progress").length ?? 0,
    },
    {
      name: "Review",
      value: tasks?.filter((task) => task.status === "Review").length ?? 0,
    },
    {
      name: "Closed",
      value: tasks?.filter((task) => task.status === "Closed").length ?? 0,
    },
  ];

  const budgetChartData =
    projects?.map((project) => ({
      project: project.name,
      budget: Number(project.budget ?? 0),
    })) ?? [];

  return (
    <div className="space-y-6">
      <DashboardRealtime />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Project Operations Dashboard
        </h1>

        <p className="text-slate-500 dark:text-slate-400">
          Real-time overview of projects, finances, field activity, documents,
          and team performance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-7">
        <StatCard
          title="Active Projects"
          value={String(projectCount ?? 0)}
          icon={FolderKanban}
        />

        <StatCard
          title="Open Tasks"
          value={String(openTaskCount ?? 0)}
          icon={ClipboardList}
        />

        <StatCard
          title="Pending CO Value"
          value={`$${pendingChangeOrderValue.toLocaleString()}`}
          icon={FileWarning}
        />

        <StatCard
          title="Documents"
          value={String(documentCount ?? 0)}
          icon={FolderKanban}
        />

        <StatCard
          title="Team Members"
          value={String(teamMemberCount ?? 0)}
          icon={ClipboardList}
        />

        <StatCard
          title="Total Budget"
          value={`$${totalBudget.toLocaleString()}`}
          icon={DollarSign}
        />

        <StatCard
          title="Pending CO Value"
          value={`$${pendingChangeOrderValue.toLocaleString()}`}
          icon={FileWarning}
        />
      </div>
      <ProjectHealthOverview />

      <div className="grid gap-6 xl:grid-cols-2">
        <BudgetChart data={budgetChartData} />
        <TaskStatusChart data={taskStatusData} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ActiveProjects />
        <ActivityTimeline />
        <UpcomingSchedule />
      </div>
    </div>
  );
}
