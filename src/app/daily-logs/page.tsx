const dailyLogs = [
  {
    date: "May 22, 2026",
    project: "Gulf Coast Retail Center",
    weather: "Sunny, 84°F",
    crew: "12 workers",
    summary: "Completed framing inspection and began electrical rough-in.",
  },
  {
    date: "May 21, 2026",
    project: "Bayview Medical Office",
    weather: "Cloudy, 79°F",
    crew: "8 workers",
    summary: "Delivered materials and reviewed updated site plans.",
  },
  {
    date: "May 20, 2026",
    project: "Ocean Springs Warehouse",
    weather: "Rain delay",
    crew: "5 workers",
    summary: "Work paused due to weather. Rescheduled concrete pour.",
  },
];

export default function DailyLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
  title="Daily Logs"
  description="Track jobsite activity, weather, crew count, and daily progress."
  actionLabel="New Log"
/>

      <div className="grid gap-4">
        {dailyLogs.map((log) => (
          <div
            key={`${log.project}-${log.date}`}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold">{log.project}</h2>
                <p className="text-sm text-slate-500">{log.date}</p>
              </div>

              <div className="grid gap-4 text-sm sm:grid-cols-2 lg:min-w-[420px]">
                <div>
                  <p className="text-slate-400">Weather</p>
                  <p className="font-medium">{log.weather}</p>
                </div>

                <div>
                  <p className="text-slate-400">Crew</p>
                  <p className="font-medium">{log.crew}</p>
                </div>
              </div>
            </div>

            <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              {log.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}