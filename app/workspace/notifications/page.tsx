import { NotificationsCenter } from "@/components/flowpilot/tables";
import { PageHeader } from "@/components/shared/page-header";
import { requireFlowPilotViewer } from "@/lib/flowpilot-auth";
import { getScopedNotifications } from "@/lib/flowpilot-data";

export default function NotificationsPage() {
  const viewer = requireFlowPilotViewer();
  const companyScope =
    viewer.profile.role === "admin" && !viewer.isImpersonatingCompany
      ? null
      : viewer.activeCompany.id;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Notification center"
        title="Notifications"
        description="Monitor delivery across email, WhatsApp, and in-app alerts, including failures that need human review."
      />
      <NotificationsCenter items={getScopedNotifications(companyScope)} />
    </div>
  );
}

