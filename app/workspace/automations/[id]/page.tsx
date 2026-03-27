import { notFound } from "next/navigation";

import { AutomationDetailActions, RunLogsTable } from "@/components/flowpilot/tables";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireFlowPilotViewer } from "@/lib/flowpilot-auth";
import { getAutomationById, getRunsForAutomation } from "@/lib/flowpilot-data";

export default function AutomationDetailPage({
  params
}: {
  params: { id: string };
}) {
  const viewer = requireFlowPilotViewer();
  const automation = getAutomationById(params.id);

  if (!automation) {
    notFound();
  }

  const companyScoped =
    viewer.profile.role === "admin" && !viewer.isImpersonatingCompany
      ? true
      : automation.companyId === viewer.activeCompany.id;

  if (!companyScoped) {
    notFound();
  }

  const runs = getRunsForAutomation(automation.id);
  const successCount = runs.filter((run) => run.result === "Success").length;
  const averageDuration = Math.round(
    runs.reduce((total, run) => total + run.durationMs, 0) / runs.length
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Automation detail"
        title={automation.name}
        description={automation.description}
        actions={
          <AutomationDetailActions
            automationId={automation.id}
            name={automation.name}
            status={automation.status}
            viewerRole={viewer.profile.role}
          />
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Runs</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{automation.runs}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Success rate</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{automation.successRate}%</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Avg duration</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{averageDuration}ms</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Failures</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{automation.failureCount}</CardContent>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Trigger and conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-brand/15 bg-brand-soft/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Trigger
              </p>
              <p className="mt-2 text-lg font-semibold">{automation.triggerLabel}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {automation.triggerDescription}
              </p>
            </div>
            {automation.conditions.map((condition) => (
              <div key={condition.id} className="rounded-2xl border border-border/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{condition.label}</p>
                  <Badge variant="accent">Condition</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {condition.field} {condition.operator} {condition.value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Action sequence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {automation.actions.map((action, index) => (
              <div key={action.id} className="rounded-2xl border border-border/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">
                    Step {index + 1}: {action.label}
                  </p>
                  <Badge variant={action.type === "delay" ? "warning" : "accent"}>
                    {action.channel ?? action.type}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{action.description}</p>
                {action.delayHours ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Delay window: {action.delayHours} hours
                  </p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-2xl border border-border/70 p-4">
              <p className="font-semibold">Owner</p>
              <p className="mt-1 text-muted-foreground">{automation.owner}</p>
            </div>
            <div className="rounded-2xl border border-border/70 p-4">
              <p className="font-semibold">Vertical</p>
              <p className="mt-1 text-muted-foreground">{automation.vertical}</p>
            </div>
            <div className="rounded-2xl border border-border/70 p-4">
              <p className="font-semibold">Last edited</p>
              <p className="mt-1 text-muted-foreground">
                {automation.lastEditedBy} · {automation.lastEditedAt.slice(0, 10)}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 p-4">
              <p className="font-semibold">Outcome split</p>
              <p className="mt-1 text-muted-foreground">
                {successCount} successful, {automation.pendingCount} pending, {automation.failureCount} failed
              </p>
            </div>
          </CardContent>
        </Card>
        <RunLogsTable runs={runs} limit={20} />
      </div>
    </div>
  );
}

