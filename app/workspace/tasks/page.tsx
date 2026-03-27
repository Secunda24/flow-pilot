import { TasksTable } from "@/components/flowpilot/tables";
import { PageHeader } from "@/components/shared/page-header";
import { requireFlowPilotViewer } from "@/lib/flowpilot-auth";
import { getScopedTasks } from "@/lib/flowpilot-data";

export default function TasksPage() {
  const viewer = requireFlowPilotViewer();
  const companyScope =
    viewer.profile.role === "admin" && !viewer.isImpersonatingCompany
      ? null
      : viewer.activeCompany.id;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Follow-ups"
        title="Tasks"
        description="Track the manual work created by automations, including due dates, owners, priorities, and completion progress."
      />
      <TasksTable items={getScopedTasks(companyScope)} />
    </div>
  );
}

