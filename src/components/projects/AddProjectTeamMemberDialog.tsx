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

type Contact = {
  id: string;
  name: string;
  company: string | null;
};

export default function AddProjectTeamMemberDialog({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactId, setContactId] = useState("");
  const [role, setRole] = useState("Project Manager");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadContacts() {
      const { data } = await supabase
        .from("contacts")
        .select("id, name, company")
        .order("name");

      if (data) {
        setContacts(data);
        setContactId(data[0]?.id ?? "");
      }
    }

    loadContacts();
  }, []);

  async function handleAddTeamMember(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("project_team_members").insert({
      project_id: projectId,
      contact_id: contactId,
      role,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await logActivity("Project team member added", "team");

    setRole("Project Manager");
    setOpen(false);

    router.refresh();
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900">
        Add Team Member
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAddTeamMember} className="space-y-4">
          <select
            required
            value={contactId}
            onChange={(event) => setContactId(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
                {contact.company ? ` — ${contact.company}` : ""}
              </option>
            ))}
          </select>

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            <option>Project Manager</option>
            <option>Superintendent</option>
            <option>Foreman</option>
            <option>Architect</option>
            <option>Engineer</option>
            <option>Owner Rep</option>
            <option>Subcontractor</option>
            <option>Vendor</option>
          </select>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900"
          >
            {loading ? "Adding..." : "Add Team Member"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}