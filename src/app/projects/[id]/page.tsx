import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

import { projects } from "@/data/projects";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectPageProps) {
  const { id } = await params;

  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        description="Commercial construction project overview."
        actionLabel="Edit Project"
      />

      <div className="flex items-center gap-3">
        <StatusBadge status={project.status} />

        <p className="text-sm text-slate-500">
          Budget: {project.budget}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Budget", project.budget],
          ["Completion", project.completion],
          ["Open Tasks", project.openTasks],
          ["Pending RFIs", project.pendingRFIs],
        ].map(([title, value]) => (
          <div
            key={title}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-slate-500">
              {title}
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">
            Recent Activity
          </h2>

          <div className="space-y-4">
            {[
              "Electrical rough-in completed",
              "Inspection scheduled for Friday",
              "Updated structural drawings uploaded",
              "Concrete delivery confirmed",
            ].map((activity) => (
              <div
                key={activity}
                className="rounded-xl bg-slate-50 p-4"
              >
                {activity}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Project Team
          </h2>

          <div className="space-y-4">
            {[
              "Michael Sullivan — Project Manager",
              "James Carter — Superintendent",
              "Emily Brooks — Architect",
              "Tyler Davis — Electrical Contractor",
            ].map((member) => (
              <div
                key={member}
                className="rounded-xl border p-4"
              >
                {member}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}