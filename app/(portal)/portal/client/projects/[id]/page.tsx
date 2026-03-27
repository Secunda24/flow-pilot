import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { Timeline } from "@/components/shared/timeline";
import { ProjectStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireClientViewer } from "@/lib/auth";
import { getMilestonesForProject, getProjectById } from "@/lib/demo-data";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function ProjectDetailPage({
  params
}: {
  params: { id: string };
}) {
  const viewer = requireClientViewer();
  const project = getProjectById(params.id);

  if (!project || project.companyId !== viewer.actingAsProfile.companyId) {
    notFound();
  }

  const milestones = getMilestonesForProject(project.id).map((milestone) => ({
    title: milestone.title,
    detail: milestone.status,
    date: formatDate(milestone.dueDate),
    active: milestone.status !== "Upcoming"
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={project.id}
        title={project.name}
        description={project.description}
        actions={<ProjectStatusBadge status={project.status} />}
      />

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Project overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Progress</p>
              <p className="mt-2 text-3xl font-semibold">{project.progress}%</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Budget</p>
              <p className="mt-2 text-3xl font-semibold">{formatCurrency(project.budget)}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Manager</p>
              <p className="mt-2 text-lg font-semibold">{project.manager}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Deadline</p>
              <p className="mt-2 text-lg font-semibold">{formatDate(project.deadline)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline items={milestones} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

