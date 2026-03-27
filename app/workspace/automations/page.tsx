import { AutomationManager } from "@/components/flowpilot/tables";
import { PageHeader } from "@/components/shared/page-header";
import { requireFlowPilotViewer } from "@/lib/flowpilot-auth";
import { getAutomationSummaries } from "@/lib/flowpilot-data";

export default function AutomationsPage() {
  const viewer = requireFlowPilotViewer();
  const companyScope =
    viewer.profile.role === "admin" && !viewer.isImpersonatingCompany
      ? null
      : viewer.activeCompany.id;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workflow operations"
        title="Automations"
        description="Manage trigger-and-action workflows, clone winning playbooks, and pause activity when a team needs breathing room."
      />
      <AutomationManager
        items={getAutomationSummaries(companyScope)}
        viewerRole={viewer.profile.role}
      />
    </div>
  );
}

