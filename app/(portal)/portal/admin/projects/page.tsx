import { Plus } from "lucide-react";

import { ProgressList } from "@/components/dashboard/progress-list";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminViewer } from "@/lib/auth";
import { projectMilestones, projects } from "@/lib/demo-data";

export default function AdminProjectsPage() {
  requireAdminViewer();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Projects"
        title="Project management"
        description="Track project health, progress, assigned managers, and milestone timing across active client work."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create project
          </Button>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <ProgressList title="Active project portfolio" projects={projects} />
        <Card>
          <CardHeader>
            <CardTitle>Upcoming milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectMilestones.slice(0, 8).map((milestone) => (
              <div key={milestone.id} className="rounded-3xl border border-border/70 bg-background/60 p-4">
                <p className="font-semibold">{milestone.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {milestone.projectId} · {milestone.status}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

