import PageHeader from "@/components/ui/PageHeader";
import NewContactDialog from "@/components/contacts/NewContactDialog";

import EditContactDialog from "@/components/contacts/EditContactDialog";
import DeleteContactButton from "@/components/contacts/DeleteContactButton";

import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Contact = {
  id: string;
  name: string;
  company: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
};

export default async function ContactsPage() {
  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="Manage project team members, subcontractors, vendors, and stakeholders."
        action={<NewContactDialog />}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(contacts ?? []).map((contact: Contact) => (
          <div
            key={contact.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="text-lg font-semibold">{contact.name}</h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {contact.title || "No title"}
            </p>

            <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p>{contact.company || "No company listed"}</p>
              <p>{contact.email || "No email listed"}</p>
              <p>{contact.phone || "No phone listed"}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
              <EditContactDialog
                contact={{
                  id: contact.id,
                  name: contact.name,
                  company: contact.company,
                  title: contact.title,
                  email: contact.email,
                  phone: contact.phone,
                }}
              />

              <DeleteContactButton id={contact.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
