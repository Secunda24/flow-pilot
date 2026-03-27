import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { PageHeader } from "@/components/shared/page-header";
import { requireAdminViewer } from "@/lib/auth";
import { activityLogs } from "@/lib/demo-data";

export default function AdminActivityPage() {
  requireAdminViewer();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Audit log"
        title="Activity feed"
        description="Showcase a realistic audit trail of requests, billing events, document actions, and account changes for demo credibility."
      />
      <ActivityFeed title="All recent activity" items={activityLogs} />
    </div>
  );
}
