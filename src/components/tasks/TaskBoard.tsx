"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import StatusBadge from "@/components/ui/StatusBadge";

type Task = {
  id: string;
  title: string;
  assignee: string | null;
  priority: string;
  status: string;
  due_date: string | null;
};

const columns = ["Open", "In Progress", "Review", "Closed"];

export default function TaskBoard({ tasks }: { tasks: Task[] }) {
  const [localTasks, setLocalTasks] = useState(tasks);

  useEffect(() => {
    const channel = supabase
      .channel("tasks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setLocalTasks((prev) => [payload.new as Task, ...prev]);
          }

          if (payload.eventType === "UPDATE") {
            setLocalTasks((prev) =>
              prev.map((task) =>
                task.id === payload.new.id ? (payload.new as Task) : task
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setLocalTasks((prev) =>
              prev.filter((task) => task.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleDrop(taskId: string, newStatus: string) {
    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      alert(error.message);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {columns.map((column) => (
        <div
          key={column}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            const taskId = event.dataTransfer.getData("taskId");
            handleDrop(taskId, column);
          }}
          className="min-h-[500px] rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">{column}</h2>

            <span className="rounded-full bg-white px-3 py-1 text-xs dark:bg-slate-900">
              {localTasks.filter((task) => task.status === column).length}
            </span>
          </div>

          <div className="space-y-3">
            {localTasks
              .filter((task) => task.status === column)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData("taskId", task.id);
                  }}
                  className="cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm active:cursor-grabbing dark:border-slate-800 dark:bg-slate-900"
                >
                  <h3 className="font-medium">{task.title}</h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {task.assignee || "Unassigned"}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <StatusBadge status={task.priority} />

                    <span className="text-xs text-slate-400">
                      {task.due_date || "No due date"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}