"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Open", value: 18 },
  { name: "In Progress", value: 14 },
  { name: "Review", value: 9 },
  { name: "Closed", value: 32 },
];

export default function TaskStatusChart() {
  return (
    <div className="h-[320px] rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Task Status</h2>
        <p className="text-sm text-slate-500">
          Current task distribution.
        </p>
      </div>

      <ResponsiveContainer width="100%" height="75%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >
            {data.map((entry) => (
              <Cell key={entry.name} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}