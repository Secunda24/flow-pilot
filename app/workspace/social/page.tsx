import Link from "next/link";

import { SocialPlanner } from "@/components/flowpilot/social-planner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { requireFlowPilotViewer } from "@/lib/flowpilot-auth";
import { getSocialPlannerSnapshot } from "@/lib/flowpilot-data";

export default function SocialPlannerPage() {
  const viewer = requireFlowPilotViewer();
  const companyScope =
    viewer.profile.role === "admin" && !viewer.isImpersonatingCompany
      ? null
      : viewer.activeCompany.id;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Social automation"
        title="Social planner"
        description="Show clients how FlowPilot can queue social content, route approvals, and publish posts automatically across connected channels."
        actions={
          <>
            <Button asChild>
              <Link href="/workspace/automations/new?template=template-5">Create social rule</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/workspace/integrations">Manage channels</Link>
            </Button>
          </>
        }
      />
      <SocialPlanner snapshot={getSocialPlannerSnapshot(companyScope)} />
    </div>
  );
}
