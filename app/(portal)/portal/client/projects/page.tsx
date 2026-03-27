import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { ProjectStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireClientViewer } from "@/lib/auth";
import { getProjectsForCompany } from "@/lib/demo-data";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function ClientProjectsPage() {
  const viewer = requireClientViewer();
  const projects = getProjectsForCompany(viewer.actingAsProfile.companyId);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Projects"
        title="Current projects"
        description="Track milestones, due dates, managers, and overall completion across active engagements."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
                </div>
                <ProjectStatusBadge status={project.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Progress</p>
                  <p className="mt-2 text-lg font-semibold">{project.progress}%</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Deadline</p>
                  <p className="mt-2 text-lg font-semibold">{formatDate(project.deadline)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Budget</p>
                  <p className="mt-2 text-lg font-semibold">{formatCurrency(project.budget)}</p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-brand" style={{ width: `${project.progress}%` }} />
              </div>
              <Link href={`/portal/client/projects/${project.id}`} className="inline-flex items-center text-sm font-semibold text-brand">
                View project detail
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

