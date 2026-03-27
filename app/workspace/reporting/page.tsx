import { ReportingView } from "@/components/flowpilot/dashboard-widgets";
import { PageHeader } from "@/components/shared/page-header";
import { requireFlowPilotViewer } from "@/lib/flowpilot-auth";
import { getReportingSnapshot } from "@/lib/flowpilot-data";

export default function ReportingPage() {
  const viewer = requireFlowPilotViewer();
  const companyScope =
    viewer.profile.role === "admin" && !viewer.isImpersonatingCompany
      ? null
      : viewer.activeCompany.id;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Reporting"
        description="See weekly and monthly volume, top-performing workflows, trigger patterns, and execution speed in one polished reporting view."
      />
      <ReportingView snapshot={getReportingSnapshot(companyScope)} />
    </div>
  );
}

