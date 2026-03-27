"use client";

import { Activity, AlertTriangle, CheckCircle2, Clock3, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatRelativeDate } from "@/lib/utils";

function MetricCard({
  label,
  value,
  change,
  tone
}: {
  label: string;
  value: string;
  change: string;
  tone: "brand" | "success" | "warning" | "danger";
}) {
  const icon =
    tone === "success" ? (
      <CheckCircle2 className="h-4 w-4" />
    ) : tone === "warning" ? (
      <Clock3 className="h-4 w-4" />
    ) : tone === "danger" ? (
      <AlertTriangle className="h-4 w-4" />
    ) : (
      <TrendingUp className="h-4 w-4" />
    );

  return (
    <Card>
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div
            className={cn(
              "rounded-full p-2",
              tone === "success"
                ? "bg-emerald-500/10 text-emerald-500"
                : tone === "warning"
                  ? "bg-amber-500/10 text-amber-500"
                  : tone === "danger"
                    ? "bg-rose-500/10 text-rose-500"
                    : "bg-brand-soft text-brand"
            )}
          >
            {icon}
          </div>
        </div>
        <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardView({
  snapshot
}: {
  snapshot: {
    metrics: Array<{
      label: string;
      value: string;
      change: string;
      tone: "brand" | "success" | "warning" | "danger";
    }>;
    volumeChart: Array<{ label: string; runs: number }>;
    statusChart: Array<{ label: string; success: number; failed: number; pending: number }>;
    recentActivity: Array<{
      id: string;
      title: string;
      detail: string;
      createdAt: string;
      severity: "info" | "warning" | "success" | "danger";
    }>;
    topAutomations: Array<{
      id: string;
      name: string;
      successRate: number;
      runs: number;
      status: string;
    }>;
    failureReasons: Array<{
      id: string;
      automationName: string;
      errorReason?: string;
      startedAt: string;
    }>;
  };
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {snapshot.metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Automation runs over time</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={snapshot.volumeChart}>
                <defs>
                  <linearGradient id="runsGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--brand))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--brand))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="runs"
                  stroke="hsl(var(--brand))"
                  strokeWidth={3}
                  fill="url(#runsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.recentActivity.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{item.title}</p>
                  <Badge
                    variant={
                      item.severity === "success"
                        ? "success"
                        : item.severity === "warning"
                          ? "warning"
                          : item.severity === "danger"
                            ? "danger"
                            : "info"
                    }
                  >
                    {item.severity}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {formatRelativeDate(item.createdAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Success vs failure</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={snapshot.statusChart}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.18} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="success" stackId="a" fill="#22c55e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="failed" stackId="a" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top-performing automations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.topAutomations.map((automation) => (
              <div
                key={automation.id}
                className="flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3"
              >
                <div>
                  <p className="font-semibold">{automation.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {automation.runs} runs · {automation.successRate}% success
                  </p>
                </div>
                <Badge variant={automation.status === "Active" ? "success" : "warning"}>
                  {automation.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Latest failure reasons</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {snapshot.failureReasons.map((failure) => (
            <div key={failure.id} className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
              <div className="flex items-center gap-2 text-rose-500">
                <Activity className="h-4 w-4" />
                <p className="font-semibold">{failure.automationName}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {failure.errorReason ?? "Unknown failure"}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {formatRelativeDate(failure.startedAt)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function ReportingView({
  snapshot
}: {
  snapshot: {
    totalRunsWeek: number;
    totalRunsMonth: number;
    averageExecutionTime: number;
    topAutomations: Array<{ id: string; name: string; runs: number; successRate: number }>;
    failedAutomations: Array<{ id: string; name: string; failureCount: number }>;
    triggerBreakdown: Array<{ label: string; value: number }>;
    notificationSummary: Array<{ label: string; value: number }>;
    weeklyTrend: Array<{ label: string; runs: number }>;
  };
}) {
  const pieColors = ["#2563eb", "#f59e0b", "#f43f5e"];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Runs this week"
          value={String(snapshot.totalRunsWeek)}
          change="Across all visible workflows"
          tone="brand"
        />
        <MetricCard
          label="Runs this month"
          value={String(snapshot.totalRunsMonth)}
          change="Full 30-day window"
          tone="success"
        />
        <MetricCard
          label="Avg execution time"
          value={`${snapshot.averageExecutionTime}ms`}
          change="Measured across successful and pending runs"
          tone="warning"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Weekly run trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={snapshot.weeklyTrend}>
                <defs>
                  <linearGradient id="reportingGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.18} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="runs"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="url(#reportingGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notification delivery summary</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={snapshot.notificationSummary}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {snapshot.notificationSummary.map((entry, index) => (
                    <Cell key={entry.label} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Most common triggers</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[...snapshot.triggerBreakdown].sort((left, right) => right.value - left.value)}
                layout="vertical"
                margin={{ left: 40 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.18} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="label"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={120}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top-performing automations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {snapshot.topAutomations.map((automation) => (
                <div key={automation.id} className="rounded-2xl border border-border/70 p-4">
                  <p className="font-semibold">{automation.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {automation.runs} runs · {automation.successRate}% success
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Failed automations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {snapshot.failedAutomations.length ? (
                snapshot.failedAutomations.map((automation) => (
                  <div
                    key={automation.id}
                    className="flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3"
                  >
                    <p className="font-medium">{automation.name}</p>
                    <Badge variant="danger">{automation.failureCount} failures</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No failed automations in this view.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
