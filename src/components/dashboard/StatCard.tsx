import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
          <Icon className="text-slate-700" size={22} />
        </div>
      </div>
    </div>
  );
}