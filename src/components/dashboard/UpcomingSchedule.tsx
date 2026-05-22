import {
  CalendarCheck2,
  HardHat,
  Truck,
  ClipboardCheck,
} from "lucide-react";

const schedule = [
  {
    title: "Framing Inspection",
    project: "Gulf Coast Retail Center",
    date: "May 24 • 9:00 AM",
    icon: ClipboardCheck,
  },
  {
    title: "Concrete Delivery",
    project: "Ocean Springs Warehouse",
    date: "May 25 • 7:30 AM",
    icon: Truck,
  },
  {
    title: "Site Safety Meeting",
    project: "Bayview Medical Office",
    date: "May 26 • 8:00 AM",
    icon: HardHat,
  },
  {
    title: "Client Walkthrough",
    project: "Retail Center Expansion",
    date: "May 27 • 1:00 PM",
    icon: CalendarCheck2,
  },
];

export default function UpcomingSchedule() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Upcoming Schedule
        </h2>

        <p className="text-sm text-slate-500">
          Upcoming inspections, deliveries, and meetings.
        </p>
      </div>

      <div className="space-y-4">
        {schedule.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-xl border p-4"
            >
              <div className="rounded-xl bg-slate-100 p-3">
                <Icon size={18} />
              </div>

              <div className="flex-1">
                <h3 className="font-medium">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-500">
                  {item.project}
                </p>
              </div>

              <span className="text-sm text-slate-400">
                {item.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}