import Link from "next/link";
import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import AddProjectTeamMemberDialog from "@/components/projects/AddProjectTeamMemberDialog";

import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type TeamMember = {
  id: string;
  role: string;
  contacts:
    | {
        id: string;
        name: string;
        company: string | null;
        title: string | null;
        email: string | null;
        phone: string | null;
      }
    | {
        id: string;
        name: string;
        company: string | null;
        title: string | null;
        email: string | null;
        phone: string | null;
      }[]
    | null;
};

interface ProjectTeamPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectTeamPage({
  params,
}: ProjectTeamPageProps) {
  const { id } = await params;

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, name")
    .eq("id", id)
    .single();

  if (projectError || !project) {
    notFound();
  }

  const { data: teamMembers, error: teamError } = await supabase
    .from("project_team_members")
    .select(
      `
      id,
      role,
      contacts (
        id,
        name,
        company,
        title,
        email,
        phone
      )
    `,
    )
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  if (teamError) {
    throw new Error(teamError.message);
  }

  const typedTeamMembers = (teamMembers ?? []) as TeamMember[];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${project.name} Team`}
        description="Manage project team members, roles, companies, and contact information."
        action={<AddProjectTeamMemberDialog projectId={project.id} />}
      />

      <Link
        href={`/projects/${project.id}`}
        className="inline-flex text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:hover:text-slate-100"
      >
        ← Back to Project
      </Link>

      {typedTeamMembers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No team members have been added to this project yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {typedTeamMembers.map((member) => {
            const contact = Array.isArray(member.contacts)
              ? member.contacts[0]
              : member.contacts;

            return (
              <div
                key={member.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <h2 className="text-lg font-semibold">
                  {contact?.name ?? "Unknown Contact"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {member.role}
                </p>

                <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <p>{contact?.company || "No company listed"}</p>
                  <p>{contact?.title || "No title listed"}</p>
                  <p>{contact?.email || "No email listed"}</p>
                  <p>{contact?.phone || "No phone listed"}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
