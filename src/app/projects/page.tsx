const projects = [
  {
    name: "Gulf Coast Retail Center",
    status: "In Progress",
    budget: "$1.2M",
    completion: "68%",
  },
  {
    name: "Bayview Medical Office",
    status: "Planning",
    budget: "$840K",
    completion: "12%",
  },
  {
    name: "Ocean Springs Warehouse",
    status: "On Hold",
    budget: "$2.4M",
    completion: "34%",
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Projects
          </h1>

          <p className="text-slate-500">
            Manage all active construction projects.
          </p>
        </div>

        <button className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700">
          New Project
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">
                Project
              </th>

              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">
                Budget
              </th>

              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">
                Completion
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr
                key={project.name}
                className="border-b transition hover:bg-slate-50"
              >
                <td className="px-6 py-5 font-medium">
                  {project.name}
                </td>

                <td className="px-6 py-5">
                  {project.status}
                </td>

                <td className="px-6 py-5">
                  {project.budget}
                </td>

                <td className="px-6 py-5">
                  {project.completion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}