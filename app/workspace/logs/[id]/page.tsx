import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireFlowPilotViewer } from "@/lib/flowpilot-auth";
import { getRunById } from "@/lib/flowpilot-data";
import { formatDate } from "@/lib/utils";

export default function RunDetailPage({
  params
}: {
  params: { id: string };
}) {
  const viewer = requireFlowPilotViewer();
  const run = getRunById(params.id);

  if (!run) {
    notFound();
  }

  const companyScoped =
    viewer.profile.role === "admin" && !viewer.isImpersonatingCompany
      ? true
      : run.companyId === viewer.activeCompany.id;

  if (!companyScoped) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Run detail"
        title={run.id.toUpperCase()}
        description={`${run.automationName} triggered by ${run.triggeredBy} on ${formatDate(run.startedAt, "MMM d, yyyy 'at' HH:mm")}.`}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Result</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={run.result === "Success" ? "success" : run.result === "Failed" ? "danger" : "warning"}>
              {run.result}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Automation</CardTitle>
          </CardHeader>
          <CardContent className="font-semibold">{run.automationName}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Triggered by</CardTitle>
          </CardHeader>
          <CardContent className="font-semibold">{run.triggeredBy}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Duration</CardTitle>
          </CardHeader>
          <CardContent className="font-semibold">{(run.durationMs / 1000).toFixed(1)}s</CardContent>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Trigger event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {run.triggerFields.map((field) => (
              <div key={field.label} className="rounded-2xl border border-border/70 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {field.label}
                </p>
                <p className="mt-2 text-sm font-medium">{field.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Evaluated conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {run.conditionResults.map((condition) => (
              <div key={condition.id} className="rounded-2xl border border-border/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{condition.label}</p>
                  <Badge variant={condition.outcome === "Passed" ? "success" : "danger"}>
                    {condition.outcome}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{condition.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Action timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {run.actionTimeline.map((step) => (
            <div key={step.id} className="rounded-2xl border border-border/70 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{step.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.detail}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">{step.channel}</Badge>
                  <Badge
                    variant={
                      step.status === "Executed"
                        ? "success"
                        : step.status === "Failed"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {step.status}
                  </Badge>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {formatDate(step.happenedAt, "MMM d, yyyy 'at' HH:mm:ss")}
              </p>
            </div>
          ))}
          {run.errorReason ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-rose-500">Readable failure reason</p>
              <p className="mt-2">{run.errorReason}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
