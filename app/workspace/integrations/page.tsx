import { IntegrationsGrid } from "@/components/flowpilot/tables";
import { PageHeader } from "@/components/shared/page-header";
import { requireFlowPilotViewer } from "@/lib/flowpilot-auth";
import { getScopedIntegrations } from "@/lib/flowpilot-data";

export default function IntegrationsPage() {
  const viewer = requireFlowPilotViewer();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Integrations"
        title="Connected apps"
        description="Present a premium integrations catalog with connection states for email, WhatsApp, social publishing channels, webhooks, calendars, CRM, invoicing, forms, and Slack."
      />
      <IntegrationsGrid
        items={getScopedIntegrations()}
        viewerRole={viewer.profile.role}
      />
    </div>
  );
}
