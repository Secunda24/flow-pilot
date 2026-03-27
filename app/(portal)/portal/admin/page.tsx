import {
  AlertTriangle,
  FolderKanban,
  Ticket,
  Users
} from "lucide-react";

import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StatusChart } from "@/components/dashboard/status-chart";
import { VolumeChart } from "@/components/dashboard/volume-chart";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { requireAdminViewer } from "@/lib/auth";
import { getAdminDashboard } from "@/lib/demo-data";

export default function AdminDashboardPage() {
  requireAdminViewer();
  const dashboard = getAdminDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin dashboard"
        title="Operations command center"
        description="Manage clients, requests, projects, invoices, documents, and branding from one white-label admin workspace."
        actions={
          <Button asChild>
            <a href="/portal/admin/branding">Update branding</a>
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total clients" value={dashboard.totalClients} detail="Across active portal accounts" icon={Users} />
        <MetricCard label="Open requests" value={dashboard.openRequests} detail="Requiring staff visibility and action" icon={Ticket} />
        <MetricCard label="Overdue invoices" value={dashboard.overdueInvoices} detail="Billing follow-up items" icon={AlertTriangle} />
        <MetricCard label="Active projects" value={dashboard.activeProjects} detail="Tracked engagements in delivery" icon={FolderKanban} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <VolumeChart title="Request volume" data={dashboard.requestVolume} />
        <StatusChart title="Request status breakdown" data={dashboard.requestStatusBreakdown} />
      </div>

      <ActivityFeed title="Recent activity" items={dashboard.recentActivity} />
    </div>
  );
}

