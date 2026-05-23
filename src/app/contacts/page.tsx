import PageHeader from "@/components/ui/PageHeader";
import { Building2, Mail, Phone, UserRound } from "lucide-react";

const contacts = [
  {
    name: "James Carter",
    role: "Superintendent",
    company: "Carter Construction Services",
    email: "james@carterbuild.com",
    phone: "(228) 555-0142",
  },
  {
    name: "Emily Brooks",
    role: "Architect",
    company: "Brooks Design Group",
    email: "emily@brooksdesign.com",
    phone: "(228) 555-0188",
  },
  {
    name: "Tyler Davis",
    role: "Electrical Contractor",
    company: "Davis Electrical",
    email: "tyler@daviselectrical.com",
    phone: "(228) 555-0195",
  },
  {
    name: "Amanda Reed",
    role: "Client Representative",
    company: "Gulf Coast Retail Partners",
    email: "amanda@gcretail.com",
    phone: "(228) 555-0161",
  },
];

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
  title="Contacts"
  description="Manage clients, subcontractors, vendors, and project stakeholders."
  actionLabel="New Contact"
/>

      <div className="grid gap-4 md:grid-cols-2">
        {contacts.map((contact) => (
          <div
            key={contact.email}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-slate-100 p-3">
                <UserRound size={24} />
              </div>

              <div className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold">{contact.name}</h2>
                  <p className="text-sm text-slate-500">{contact.role}</p>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <Building2 size={16} />
                    {contact.company}
                  </p>

                  <p className="flex items-center gap-2">
                    <Mail size={16} />
                    {contact.email}
                  </p>

                  <p className="flex items-center gap-2">
                    <Phone size={16} />
                    {contact.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}