import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  name: string;
  status: string;
  completion: number;
};

export default async function ActiveProjects() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, status, completion")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Active Projects</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Current commercial construction projects.
        </p>
      </div>

      <div className="space-y-4">
        {(projects as Project[]).map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <div className="mt-2">
                  <StatusBadge status={project.status} />
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Progress
                </p>
                <p className="font-semibold">{project.completion}%</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}