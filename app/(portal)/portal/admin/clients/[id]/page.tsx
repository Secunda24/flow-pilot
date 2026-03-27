import { notFound } from "next/navigation";
import { Building2, CreditCard, FolderKanban, Ticket } from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminViewer } from "@/lib/auth";
import {
  companies,
  getDocumentsForCompany,
  getInvoicesForCompany,
  getProjectsForCompany,
  getRequestsForCompany
} from "@/lib/demo-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminClientDetailPage({
  params
}: {
  params: { id: string };
}) {
  requireAdminViewer();
  const company = companies.find((item) => item.id === params.id);

  if (!company) {
    notFound();
  }

  const requests = getRequestsForCompany(company.id);
  const projects = getProjectsForCompany(company.id);
  const invoices = getInvoicesForCompany(company.id);
  const documents = getDocumentsForCompany(company.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Client detail"
        title={company.name}
        description={`${company.industry} · ${company.location} · Plan ${company.plan}`}
        actions={
          <Button asChild>
            <a href={`/api/impersonate?profileId=client-${company.id.split("-")[1]}&next=/portal/client`}>
              Impersonate client view
            </a>
          </Button>
        }
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Open requests" value={requests.filter((request) => request.status !== "Completed").length} detail="Current support and delivery items" icon={Ticket} />
        <MetricCard label="Active projects" value={projects.filter((project) => project.status !== "Complete").length} detail="Tracked across milestones" icon={FolderKanban} />
        <MetricCard label="Outstanding invoices" value={invoices.filter((invoice) => invoice.status !== "Paid").length} detail="Finance follow-up items" icon={CreditCard} />
        <MetricCard label="Shared documents" value={documents.length} detail="Secure files in the portal" icon={Building2} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Account snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Primary contact</p>
              <p className="mt-2 text-lg font-semibold">{company.contactName}</p>
              <p className="text-sm text-muted-foreground">{company.contactEmail}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Client since</p>
              <p className="mt-2 text-lg font-semibold">{formatDate(company.clientSince)}</p>
              <p className="text-sm text-muted-foreground">{company.phone}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="rounded-3xl border border-border/70 bg-background/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{project.name}</p>
                  <ProjectStatusBadge status={project.status} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {project.progress}% complete · Budget {formatCurrency(project.budget)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

