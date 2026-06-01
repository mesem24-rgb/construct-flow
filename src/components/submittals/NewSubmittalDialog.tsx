"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/activity";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Project = {
  id: string;
  name: string;
};

type Contact = {
  id: string;
  name: string;
};

type NewSubmittalDialogProps = {
  defaultProjectId?: string;
};

export default function NewSubmittalDialog({
  defaultProjectId,
}: NewSubmittalDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projectId, setProjectId] = useState(defaultProjectId ?? "");
  const [title, setTitle] = useState("");
  const [specificationSection, setSpecificationSection] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Draft");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [{ data: projectData }, { data: contactData }] =
        await Promise.all([
          supabase.from("projects").select("id, name").order("name"),
          supabase.from("contacts").select("id, name").order("name"),
        ]);

      if (projectData) {
        setProjects(projectData);
        setProjectId(defaultProjectId ?? projectData[0]?.id ?? "");
      }

      if (contactData) {
        setContacts(contactData);
      }
    }

    loadData();
  }, [defaultProjectId]);

  async function handleCreateSubmittal(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("submittals").insert({
      project_id: projectId,
      title,
      specification_section: specificationSection,
      description,
      status,
      assigned_to: assignedTo,
      due_date: dueDate || null,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity(`Submittal created: ${title}`, "submittal");

    setTitle("");
    setSpecificationSection("");
    setDescription("");
    setStatus("Draft");
    setAssignedTo("");
    setDueDate("");
    setOpen(false);

    router.refresh();
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900">
        New Submittal
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Submittal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateSubmittal} className="space-y-4">
          <select
            required
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Submittal title"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <input
            value={specificationSection}
            onChange={(event) =>
              setSpecificationSection(event.target.value)
            }
            placeholder="Specification section"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            className="min-h-28 w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            >
              <option>Draft</option>
              <option>Submitted</option>
              <option>In Review</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Revise and Resubmit</option>
            </select>

            <select
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="">Unassigned</option>

              {contacts.map((contact) => (
                <option key={contact.id} value={contact.name}>
                  {contact.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900"
          >
            {loading ? "Creating..." : "Create Submittal"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}