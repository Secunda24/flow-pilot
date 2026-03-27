import {
  BellRing,
  Files,
  FolderKanban,
  ReceiptText,
  Ticket
} from "lucide-react";

import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ProgressList } from "@/components/dashboard/progress-list";
import { StatusChart } from "@/components/dashboard/status-chart";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireClientViewer } from "@/lib/auth";
import {
  getClientDashboard,
  getCompanyById,
  getProjectsForCompany,
  getRequestsForCompany
} from "@/lib/demo-data";
import { formatRelativeDate } from "@/lib/utils";

export default function ClientDashboardPage() {
  const viewer = requireClientViewer();
  const companyId = viewer.actingAsProfile.companyId;
  const company = getCompanyById(companyId);
  const dashboard = getClientDashboard(companyId);
  const recentRequests = getRequestsForCompany(companyId).slice(0, 4);
  const projects = getProjectsForCompany(companyId);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Client workspace"
        title={`Welcome back, ${viewer.actingAsProfile.fullName.split(" ")[0]}`}
        description={`Everything for ${company?.name ?? "your account"} is centralized here: requests, projects, billing, files, and updates.`}
        actions={
          <Button asChild>
            <a href="/portal/client/requests/new">Create request</a>
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Open requests" value={dashboard.openRequests} detail="Across active service items" icon={Ticket} />
        <MetricCard label="Active projects" value={dashboard.activeProjects} detail="Tracked with milestones and progress" icon={FolderKanban} />
        <MetricCard label="Unpaid invoices" value={dashboard.unpaidInvoices} detail="Upcoming and overdue balances" icon={ReceiptText} />
        <MetricCard label="Unread messages" value={dashboard.unreadMessages} detail="New replies needing attention" icon={BellRing} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <StatusChart title="Requests by status" data={dashboard.requestStatusBreakdown} />
        <Card>
          <CardHeader>
            <CardTitle>Recent request activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-3xl border border-border/70 bg-background/60 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{request.subject}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{request.id}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-brand">
                    {formatRelativeDate(request.lastUpdated)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <ActivityFeed title="Recent activity" items={dashboard.activity} />
        <ProgressList title="Project progress" projects={projects} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document vault snapshot</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 rounded-b-[2rem] lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-semibold">{dashboard.documentsCount} client-visible files available</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Agreements, reports, project files, and finance documents are ready for secure sharing.
            </p>
          </div>
          <Button variant="outline" asChild>
            <a href="/portal/client/documents">
              <Files className="mr-2 h-4 w-4" />
              Open documents
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

