"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Megaphone,
  Sparkles
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  FlowPilotAutomationSummary,
  FlowPilotMetric,
  FlowPilotSocialChannel,
  FlowPilotSocialPost,
  FlowPilotTemplate
} from "@/lib/flowpilot-data";
import { formatDate } from "@/lib/utils";

function statusVariant(status: FlowPilotSocialPost["status"]) {
  switch (status) {
    case "Published":
      return "success" as const;
    case "Awaiting approval":
      return "warning" as const;
    case "Needs edits":
      return "danger" as const;
    default:
      return "accent" as const;
  }
}

function channelVariant(status: FlowPilotSocialChannel["status"]) {
  switch (status) {
    case "Healthy":
      return "success" as const;
    case "Needs review":
      return "warning" as const;
    default:
      return "neutral" as const;
  }
}

function toneIcon(tone: FlowPilotMetric["tone"]) {
  switch (tone) {
    case "success":
      return <CheckCircle2 className="h-4 w-4" />;
    case "warning":
      return <Clock3 className="h-4 w-4" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
}

export function SocialPlanner({
  snapshot
}: {
  snapshot: {
    metrics: FlowPilotMetric[];
    channels: FlowPilotSocialChannel[];
    queue: FlowPilotSocialPost[];
    published: FlowPilotSocialPost[];
    calendar: Array<{ label: string; posts: FlowPilotSocialPost[] }>;
    automations: FlowPilotAutomationSummary[];
    templates: FlowPilotTemplate[];
    channelPerformance: Array<{ label: string; queued: number; engagement: number }>;
  };
}) {
  const nextPost = snapshot.queue[0] ?? null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="space-y-3 pb-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <div className="rounded-full bg-brand-soft p-2 text-brand">{toneIcon(metric.tone)}</div>
              </div>
              <CardTitle className="text-3xl font-semibold">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden border-brand/15 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,246,255,0.92))] dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_34%),linear-gradient(135deg,rgba(9,14,28,0.96),rgba(15,23,42,0.94))]">
          <CardHeader className="gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <Badge variant="accent">Social automation</Badge>
                <div className="space-y-2">
                  <CardTitle className="text-2xl">Content queue with workflow controls</CardTitle>
                  <p className="max-w-2xl text-sm text-muted-foreground">
                    Schedule posts, route approvals, and publish to connected channels from the
                    same automation engine that handles leads and operations.
                  </p>
                </div>
              </div>
              <div className="hidden rounded-3xl bg-background/70 p-3 text-brand shadow-sm sm:block">
                <Megaphone className="h-6 w-6" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.75rem] border border-border/60 bg-background/75 p-5 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Next scheduled post
              </p>
              {nextPost ? (
                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xl font-semibold">{nextPost.title}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{nextPost.caption}</p>
                    </div>
                    <Badge variant={statusVariant(nextPost.status)}>{nextPost.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nextPost.channels.map((channel) => (
                      <Badge key={`${nextPost.id}-${channel}`} variant="neutral">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Campaign
                      </p>
                      <p className="mt-2 text-sm font-medium">{nextPost.campaign}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Owner
                      </p>
                      <p className="mt-2 text-sm font-medium">{nextPost.owner}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Publish time
                      </p>
                      <p className="mt-2 text-sm font-medium">
                        {formatDate(nextPost.scheduledFor, "MMM d, HH:mm")}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  No social posts are queued in this view yet.
                </p>
              )}
            </div>
            <div className="space-y-4">
              {snapshot.channels.slice(0, 3).map((channel) => (
                <div
                  key={channel.id}
                  className="rounded-[1.5rem] border border-border/60 bg-background/75 p-4 shadow-sm backdrop-blur"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{channel.name}</p>
                      <p className="text-sm text-muted-foreground">{channel.handle}</p>
                    </div>
                    <Badge variant={channelVariant(channel.status)}>{channel.status}</Badge>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Queue
                      </p>
                      <p className="mt-2 text-sm font-medium">{channel.queueDepth} posts</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Engagement
                      </p>
                      <p className="mt-2 text-sm font-medium">{channel.engagementRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Best window
                      </p>
                      <p className="mt-2 text-sm font-medium">{channel.bestWindow}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Channel performance</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Queue depth and engagement signals across the active publishing stack.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/workspace/integrations">
                Manage channels
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={snapshot.channelPerformance}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.18} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="queued" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="engagement" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queue" className="space-y-0">
        <TabsList>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="rules">Automation rules</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Upcoming post queue</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  Everything waiting on approval, scheduling, or final edits before it goes live.
                </p>
              </div>
              <Button asChild>
                <Link href="/workspace/automations/new?template=template-5">Create social rule</Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2">
              {snapshot.queue.map((post) => (
                <div key={post.id} className="rounded-[1.5rem] border border-border/70 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{post.title}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{post.caption}</p>
                    </div>
                    <Badge variant={statusVariant(post.status)}>{post.status}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.channels.map((channel) => (
                      <Badge key={`${post.id}-${channel}`} variant="neutral">
                        {channel}
                      </Badge>
                    ))}
                    <Badge variant="accent">{post.assetType}</Badge>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Campaign
                      </p>
                      <p className="mt-2 text-sm font-medium">{post.campaign}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Owner
                      </p>
                      <p className="mt-2 text-sm font-medium">{post.owner}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Scheduled
                      </p>
                      <p className="mt-2 text-sm font-medium">
                        {formatDate(post.scheduledFor, "MMM d, HH:mm")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Publishing calendar</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                A five-day view of what the workflow engine has queued for social delivery.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 xl:grid-cols-5">
              {snapshot.calendar.map((day) => (
                <div key={day.label} className="rounded-[1.5rem] border border-border/70 p-4">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-brand" />
                    <p className="font-semibold">{day.label}</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {day.posts.length ? (
                      day.posts.map((post) => (
                        <div
                          key={post.id}
                          className="rounded-2xl border border-border/60 bg-muted/40 p-3"
                        >
                          <p className="text-sm font-medium">{post.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatDate(post.scheduledFor, "HH:mm")} / {post.channels.join(", ")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
                        No posts queued for this day.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle>Live social automations</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Active workflow rules already shaping approvals and channel publishing.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/workspace/automations">View automations</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {snapshot.automations.length ? (
                  snapshot.automations.map((automation) => (
                    <div
                      key={automation.id}
                      className="rounded-[1.5rem] border border-border/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{automation.name}</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {automation.description}
                          </p>
                        </div>
                        <Badge variant={automation.status === "Active" ? "success" : "warning"}>
                          {automation.status}
                        </Badge>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            Trigger
                          </p>
                          <p className="mt-2 text-sm font-medium">{automation.triggerLabel}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            Runs
                          </p>
                          <p className="mt-2 text-sm font-medium">{automation.runs}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            Success
                          </p>
                          <p className="mt-2 text-sm font-medium">{automation.successRate}%</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.5rem] border border-dashed border-border/70 p-5 text-sm text-muted-foreground">
                    No dedicated social automations are visible in this scope yet.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle>Templates for fast setup</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Spin up social approval and publishing flows without starting from scratch.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/workspace/templates">Browse templates</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {snapshot.templates.map((template) => (
                  <div key={template.id} className="rounded-[1.5rem] border border-border/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{template.name}</p>
                      <Badge variant="accent">{template.category}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{template.description}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-brand">{template.estimatedLift}</p>
                      <Button size="sm" asChild>
                        <Link href={`/workspace/automations/new?template=${template.id}`}>
                          Use template
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="published">
          <Card>
            <CardHeader>
              <CardTitle>Recently published</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Examples of content that has already gone live through the demo workflow stack.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-3">
              {snapshot.published.map((post) => (
                <div key={post.id} className="rounded-[1.5rem] border border-border/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="success">Published</Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(post.publishedAt ?? post.scheduledFor, "MMM d, HH:mm")}
                    </p>
                  </div>
                  <p className="mt-4 font-semibold">{post.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{post.caption}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.channels.map((channel) => (
                      <Badge key={`${post.id}-${channel}`} variant="neutral">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
