import { TemplatesGrid } from "@/components/flowpilot/tables";
import { PageHeader } from "@/components/shared/page-header";
import { requireFlowPilotViewer } from "@/lib/flowpilot-auth";
import { flowPilotTemplates } from "@/lib/flowpilot-data";

export default function TemplatesPage() {
  requireFlowPilotViewer();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Accelerators"
        title="Templates"
        description="Start from proven workflow playbooks for new leads, missed bookings, invoices, onboarding, social publishing, re-engagement, and support escalations."
      />
      <TemplatesGrid items={flowPilotTemplates} />
    </div>
  );
}
