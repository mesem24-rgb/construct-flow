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

const data = [
  { project: "Retail", budget: 1200000, spent: 820000 },
  { project: "Medical", budget: 840000, spent: 210000 },
  { project: "Warehouse", budget: 2400000, spent: 970000 },
  { project: "Office", budget: 650000, spent: 430000 },
];

export default function BudgetChart() {
  return (
    <div className="h-[320px] rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Budget Overview</h2>
        <p className="text-sm text-slate-500">
          Budget vs. actual spend by project.
        </p>
      </div>

      <ResponsiveContainer width="100%" height="75%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="project" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="budget" />
          <Bar dataKey="spent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}