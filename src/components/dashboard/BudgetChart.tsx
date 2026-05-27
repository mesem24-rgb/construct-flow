"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type BudgetChartProps = {
  data: {
    project: string;
    budget: number;
  }[];
};

export default function BudgetChart({ data }: BudgetChartProps) {
  return (
    <div className="h-[320px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Budget Overview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Total budget by project.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="project" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(value) => `$${Number(value) / 1000}k`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) =>
              `$${Number(value).toLocaleString()}`
            }
          />
          <Bar dataKey="budget" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}