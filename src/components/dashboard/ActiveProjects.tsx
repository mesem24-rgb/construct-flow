import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";

const projects = [
  {
    name: "Gulf Coast Retail Center",
    status: "In Progress",
    progress: "68%",
  },
  {
    name: "Bayview Medical Office",
    status: "Planning",
    progress: "12%",
  },
  {
    name: "Ocean Springs Warehouse",
    status: "On Hold",
    progress: "34%",
  },
];

export default function ActiveProjects() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm xl:col-span-2">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Active Projects</h2>
        <p className="text-sm text-slate-500">
          Current commercial construction projects.
        </p>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <Link
            key={project.name}
            href={`/projects/${project.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="block rounded-xl border p-4 transition hover:bg-slate-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <div className="mt-2">
                  <StatusBadge status={project.status} />
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500">Progress</p>
                <p className="font-semibold">{project.progress}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}