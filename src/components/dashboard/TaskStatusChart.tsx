"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type TaskStatusChartProps = {
  data: {
    name: string;
    value: number;
  }[];
};

export default function TaskStatusChart({ data }: TaskStatusChartProps) {
  const filteredData = data.filter((item) => item.value > 0);

  return (
    <div className="h-[320px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Task Status</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Current task distribution.
        </p>
      </div>

      {filteredData.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No task data available yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={filteredData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {filteredData.map((entry) => (
                <Cell key={entry.name} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}