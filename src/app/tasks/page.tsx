import PageHeader from "@/components/ui/PageHeader";
import NewTaskDialog from "@/components/tasks/NewTaskDialog";
import TaskFilters from "@/components/tasks/TaskFilters";
import DashboardRealtime from "@/components/dashboard/DashboardRealtime";

import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// ===== Types =====
type Task = {
  id: string;
  project_id: string;
  title: string;
  assignee: string | null;
  priority: string;
  status: string;
  due_date: string | null;
};

// ===== Page =====
export default async function TasksPage() {
  // ===== Load tasks =====
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("id, project_id, title, assignee, priority, status, due_date")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // ===== UI =====
  return (
    <div className="space-y-6">
      <DashboardRealtime />

      <PageHeader
        title="Tasks"
        description="Track field work, follow-ups, and project responsibilities."
        action={<NewTaskDialog />}
      />

      <TaskFilters tasks={(tasks ?? []) as Task[]} />
    </div>
  );
}