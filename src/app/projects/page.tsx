import PageHeader from "@/components/ui/PageHeader";
import NewProjectDialog from "@/components/projects/NewProjectDialog";
import ProjectFilters from "@/components/projects/ProjectFilters";

import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Project = {
  id: string;
  name: string;
  status: string;
  budget: number;
  completion: number;
};

export default async function ProjectsPage() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, status, budget, completion")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage all active construction projects."
        action={<NewProjectDialog />}
      />

      <ProjectFilters projects={(projects ?? []) as Project[]} />
    </div>
  );
}