import { RunLogsTable } from "@/components/flowpilot/tables";
import { PageHeader } from "@/components/shared/page-header";
import { requireFlowPilotViewer } from "@/lib/flowpilot-auth";
import { getScopedRuns } from "@/lib/flowpilot-data";

export default function LogsPage() {
  const viewer = requireFlowPilotViewer();
  const companyScope =
    viewer.profile.role === "admin" && !viewer.isImpersonatingCompany
      ? null
      : viewer.activeCompany.id;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Execution history"
        title="Run logs"
        description="Review every automation execution with timestamps, outcomes, durations, and deep-dive trace pages."
      />
      <RunLogsTable runs={getScopedRuns(companyScope)} />
    </div>
  );
}

