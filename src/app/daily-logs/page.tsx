import Image from "next/image";

import PageHeader from "@/components/ui/PageHeader";
import NewDailyLogDialog from "@/components/daily-logs/NewDailyLogDialog";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function DailyLogsPage() {
  const { data: logs, error } = await supabase
    .from("daily_logs")
    .select(`
      *,
      projects (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Logs"
        description="Track daily field activity, manpower, weather, and site progress."
        action={<NewDailyLogDialog />}
      />

      <div className="space-y-4">
        {logs?.map((log: any) => (
          <div
            key={log.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {log.projects?.name}
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {new Date(log.created_at).toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">
                {log.weather}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium">Work Completed</h3>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {log.work_completed}
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Delays / Issues</h3>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {log.delays || "No delays reported"}
                </p>
              </div>
            </div>

            {log.photo_urls?.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 font-medium">Site Photos</h3>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {log.photo_urls.map((url: string) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="relative block h-48 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"
                    >
                      <Image
                        src={url}
                        alt="Daily log site photo"
                        fill
                        className="object-cover transition hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Crew Count: {log.crew_count}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}