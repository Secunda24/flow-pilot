import Link from "next/link";

import { DashboardView } from "@/components/flowpilot/dashboard-widgets";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { requireFlowPilotViewer } from "@/lib/flowpilot-auth";
import { canManageAutomations, getDashboardSnapshot } from "@/lib/flowpilot-data";

export default function WorkspaceDashboardPage() {
  const viewer = requireFlowPilotViewer();
  const companyScope =
    viewer.profile.role === "admin" && !viewer.isImpersonatingCompany
      ? null
      : viewer.activeCompany.id;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={viewer.isImpersonatingCompany ? "Business demo mode" : "Operations overview"}
        title={
          viewer.profile.role === "admin" && !viewer.isImpersonatingCompany
            ? "FlowPilot command center"
            : `${viewer.activeCompany.name} automation overview`
        }
        description="Monitor workflow volume, identify failures fast, and launch the next automation without leaving the dashboard."
        actions={
          <>
            {canManageAutomations(viewer.profile.role) ? (
              <Button asChild>
                <Link href="/workspace/automations/new">New automation</Link>
              </Button>
            ) : null}
            <Button variant="outline" asChild>
              <Link href="/workspace/social">Social planner</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/workspace/logs">View logs</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/workspace/templates">Use template</Link>
            </Button>
          </>
        }
      />
      <DashboardView snapshot={getDashboardSnapshot(companyScope)} />
    </div>
  );
}
