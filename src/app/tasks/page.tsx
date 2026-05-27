import PageHeader from "@/components/ui/PageHeader";
import NewTaskDialog from "@/components/tasks/NewTaskDialog";
import TaskFilters from "@/components/tasks/TaskFilters";
import DashboardRealtime from "@/components/dashboard/DashboardRealtime";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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
      <DashboardRealtime />
      <PageHeader
        title="Tasks"
        description="Track project tasks, punch list items, and follow-ups."
        action={<NewTaskDialog />}
      />

      <TaskFilters tasks={(tasks ?? []) as Task[]} />
    </div>
  );
}