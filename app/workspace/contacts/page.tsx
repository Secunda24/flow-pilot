import { ContactsTable } from "@/components/flowpilot/tables";
import { PageHeader } from "@/components/shared/page-header";
import { requireFlowPilotViewer } from "@/lib/flowpilot-auth";
import { getScopedContacts } from "@/lib/flowpilot-data";

export default function ContactsPage() {
  const viewer = requireFlowPilotViewer();
  const companyScope =
    viewer.profile.role === "admin" && !viewer.isImpersonatingCompany
      ? null
      : viewer.activeCompany.id;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Source records"
        title="Contacts and records"
        description="Use realistic leads and client records as the source layer for workflows, follow-ups, and task generation."
      />
      <ContactsTable items={getScopedContacts(companyScope)} />
    </div>
  );
}

