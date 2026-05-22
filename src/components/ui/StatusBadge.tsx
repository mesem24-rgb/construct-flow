type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    "In Progress": "bg-blue-100 text-blue-700",
    Planning: "bg-amber-100 text-amber-700",
    "On Hold": "bg-red-100 text-red-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    "Pending Review": "bg-amber-100 text-amber-700",
    Review: "bg-purple-100 text-purple-700",
    Closed: "bg-slate-100 text-slate-700",
    Open: "bg-blue-100 text-blue-700",
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}