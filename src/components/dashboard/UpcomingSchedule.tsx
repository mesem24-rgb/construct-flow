import { CalendarCheck2 } from "lucide-react";

import { supabase } from "@/lib/supabase";

export default async function UpcomingSchedule() {
  const { data: milestones } = await supabase
    .from("milestones")
    .select("id, title, due_date, status")
    .neq("status", "Complete")
    .order("due_date", { ascending: true })
    .limit(5);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Upcoming Milestones
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Upcoming project schedule milestones.
        </p>
      </div>

      {milestones?.length ? (
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="flex items-start gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
            >
              <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                <CalendarCheck2 size={18} />
              </div>

              <div className="flex-1">
                <h3 className="font-medium">
                  {milestone.title}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {milestone.status}
                </p>
              </div>

              <span className="text-sm text-slate-400">
                {milestone.due_date
                  ? new Date(
                      milestone.due_date,
                    ).toLocaleDateString()
                  : "No date"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No upcoming milestones.
        </p>
      )}
    </div>
  );
}