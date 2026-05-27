"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type ActivityLog = {
  id: string;
  message: string;
  type: string;
  created_at: string;
};

export default function RealtimeActivityTimeline({
  initialLogs,
}: {
  initialLogs: ActivityLog[];
}) {
  const [logs, setLogs] = useState(initialLogs);

  useEffect(() => {
    const channel = supabase
      .channel("activity-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_logs",
        },
        (payload) => {
          setLogs((prev) => [
            payload.new as ActivityLog,
            ...prev,
          ]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Activity Timeline
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Recent project and task updates.
        </p>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <p className="font-medium">{log.message}</p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {new Date(log.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}