import Image from "next/image";

import PageHeader from "@/components/ui/PageHeader";
import NewDailyLogDialog from "@/components/daily-logs/NewDailyLogDialog";

import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// ===== Types =====
type DailyLog = {
  id: string;
  project_id: string;
  weather: string | null;
  crew_count: number;
  work_completed: string | null;
  delays: string | null;
  photo_urls: string[] | null;
  created_at: string;
  projects: {
    name: string;
  } | null;
};

type DailyLogsPageProps = {
  searchParams: Promise<{
    project?: string;
  }>;
};

// ===== Page =====
export default async function DailyLogsPage({
  searchParams,
}: DailyLogsPageProps) {
  const { project } = await searchParams;

  // ===== Build query =====
  let query = supabase
    .from("daily_logs")
    .select(`
      *,
      projects (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (project) {
    query = query.eq("project_id", project);
  }

  // ===== Load daily logs =====
  const { data: logs, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // ===== UI =====
  return (
    <div className="space-y-6">
      <PageHeader
        title={project ? "Project Daily Logs" : "Daily Logs"}
        description={
          project
            ? "Filtered daily logs for the selected project."
            : "Track daily field activity, manpower, weather, and site progress."
        }
        action={<NewDailyLogDialog defaultProjectId={project} />}
      />

      <div className="space-y-4">
        {(logs ?? []).map((log: DailyLog) => (
          <div
            key={log.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            {/* ===== Log Header ===== */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {log.projects?.name ?? "Unassigned Project"}
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  {new Date(log.created_at).toLocaleString()}
                </h2>
              </div>

              <div className="rounded-xl bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">
                {log.weather || "Weather N/A"}
              </div>
            </div>

            {/* ===== Work / Delay Summary ===== */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium">Work Completed</h3>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {log.work_completed || "No work completed summary."}
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Delays / Issues</h3>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {log.delays || "No delays reported"}
                </p>
              </div>
            </div>

            {/* ===== Site Photos ===== */}
            {log.photo_urls && log.photo_urls.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 font-medium">Site Photos</h3>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {log.photo_urls.map((url) => (
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

            {/* ===== Footer ===== */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Crew Count: {log.crew_count}
              </p>
            </div>
          </div>
        ))}

        {logs?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No daily logs found for this view.
          </div>
        )}
      </div>
    </div>
  );
}