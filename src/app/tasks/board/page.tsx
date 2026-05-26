import PageHeader from "@/components/ui/PageHeader";
import TaskBoard from "@/components/tasks/TaskBoard";

import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  title: string;
  assignee: string | null;
  priority: string;
  status: string;
  due_date: string | null;
};

export default async function TaskBoardPage() {
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
        title="Task Board"
        description="Move tasks through each stage of the construction workflow."
      />

      <TaskBoard tasks={(tasks ?? []) as Task[]} />
    </div>
  );
}