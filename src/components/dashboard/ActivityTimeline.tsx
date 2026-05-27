import { supabase } from "@/lib/supabase";

import RealtimeActivityTimeline from "./RealtimeActivityTimeline";

type ActivityLog = {
  id: string;
  message: string;
  type: string;
  created_at: string;
};

export default async function ActivityTimeline() {
  const { data: logs, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(error.message);
  }

  return (
    <RealtimeActivityTimeline
      initialLogs={(logs ?? []) as ActivityLog[]}
    />
  );
}