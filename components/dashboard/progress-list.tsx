import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { ProjectItem } from "@/lib/types";

export function ProgressList({
  title,
  projects
}: {
  title: string;
  projects: ProjectItem[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-3xl border border-border/70 bg-background/60 p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Due {formatDate(project.deadline)} · Budget {formatCurrency(project.budget)}
                </p>
              </div>
              <ProjectStatusBadge status={project.status} />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-brand"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

