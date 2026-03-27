import { notFound } from "next/navigation";

import { AutomationBuilder } from "@/components/flowpilot/automation-builder";
import { PageHeader } from "@/components/shared/page-header";
import { requireFlowPilotEditor } from "@/lib/flowpilot-auth";
import { getAutomationById } from "@/lib/flowpilot-data";

export default function EditAutomationPage({
  params
}: {
  params: { id: string };
}) {
  const viewer = requireFlowPilotEditor();
  const automation = getAutomationById(params.id);

  if (!automation) {
    notFound();
  }

  const companyScoped =
    viewer.profile.role === "admin" && !viewer.isImpersonatingCompany
      ? true
      : automation.companyId === viewer.activeCompany.id;

  if (!companyScoped) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Builder"
        title={`Edit ${automation.name}`}
        description="Adjust conditions, action sequencing, delay windows, and activation state without leaving the builder."
      />
      <AutomationBuilder viewerRole={viewer.profile.role} automation={automation} />
    </div>
  );
}
