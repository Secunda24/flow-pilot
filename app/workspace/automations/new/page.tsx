import { AutomationBuilder } from "@/components/flowpilot/automation-builder";
import { PageHeader } from "@/components/shared/page-header";
import { requireFlowPilotEditor } from "@/lib/flowpilot-auth";
import { getTemplateById } from "@/lib/flowpilot-data";

export default function NewAutomationPage({
  searchParams
}: {
  searchParams?: { template?: string };
}) {
  const viewer = requireFlowPilotEditor();
  const template = searchParams?.template ? getTemplateById(searchParams.template) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Builder"
        title={template ? `Build from ${template.name}` : "Create automation"}
        description="Design the trigger, conditions, actions, wait steps, and rollout state in one polished stacked builder."
      />
      <AutomationBuilder viewerRole={viewer.profile.role} template={template} />
    </div>
  );
}

