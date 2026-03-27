"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Download, Play, Power, PowerOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type {
  FlowPilotAutomationSummary,
  FlowPilotContact,
  FlowPilotIntegration,
  FlowPilotNotification,
  FlowPilotRole,
  FlowPilotRun,
  FlowPilotTask,
  FlowPilotTemplate
} from "@/lib/flowpilot-data";
import {
  canManageAutomations,
  canManageIntegrations
} from "@/lib/flowpilot-data";
import { cn, formatDate, formatRelativeDate, toCsv } from "@/lib/utils";

function exportCsv<T extends Record<string, unknown>>(filename: string, rows: T[]) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function statusBadgeVariant(status: string) {
  switch (status) {
    case "Active":
    case "Connected":
    case "Completed":
    case "Delivered":
    case "Success":
      return "success" as const;
    case "Paused":
    case "Waiting":
    case "Queued":
    case "Pending":
      return "warning" as const;
    case "Failed":
    case "Critical":
      return "danger" as const;
    case "Draft":
    case "Not connected":
    case "Dormant":
      return "neutral" as const;
    default:
      return "info" as const;
  }
}

function ToolbarChip({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm transition",
        active
          ? "bg-brand text-brand-foreground"
          : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function AutomationDetailActions({
  automationId,
  name,
  status,
  viewerRole
}: {
  automationId: string;
  name: string;
  status: string;
  viewerRole: FlowPilotRole;
}) {
  const [currentStatus, setCurrentStatus] = useState(status);

  if (!canManageAutomations(viewerRole)) {
    return <Badge variant={statusBadgeVariant(currentStatus)}>{currentStatus}</Badge>;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" asChild>
        <Link href={`/workspace/automations/${automationId}/edit`}>Edit workflow</Link>
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success(`${name} test run queued for demo preview.`)}
      >
        <Play className="mr-2 h-4 w-4" />
        Run test
      </Button>
      <Button
        onClick={() => {
          setCurrentStatus((value) => (value === "Active" ? "Paused" : "Active"));
          toast.success(
            `${name} is now ${currentStatus === "Active" ? "paused" : "active"}.`
          );
        }}
      >
        {currentStatus === "Active" ? (
          <PowerOff className="mr-2 h-4 w-4" />
        ) : (
          <Power className="mr-2 h-4 w-4" />
        )}
        {currentStatus === "Active" ? "Pause" : "Resume"}
      </Button>
    </div>
  );
}

export function AutomationManager({
  items,
  viewerRole
}: {
  items: FlowPilotAutomationSummary[];
  viewerRole: FlowPilotRole;
}) {
  const [rows, setRows] = useState(items);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [savedFilter, setSavedFilter] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const editable = canManageAutomations(viewerRole);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery = `${row.name} ${row.triggerLabel} ${row.owner}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All" || row.status === statusFilter;
      const matchesSaved =
        savedFilter === "All"
          ? true
          : savedFilter === "Needs attention"
            ? row.failureCount > 0
            : savedFilter === "High volume"
              ? row.runs >= 10
              : row.status === "Paused";

      return matchesQuery && matchesStatus && matchesSaved;
    });
  }, [query, rows, savedFilter, statusFilter]);

  function updateStatus(id: string) {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              status:
                row.status === "Active"
                  ? "Paused"
                  : row.status === "Paused"
                    ? "Active"
                    : "Active"
            }
          : row
      )
    );
    toast.success("Automation status updated.");
  }

  function duplicateRow(id: string) {
    const target = rows.find((row) => row.id === id);

    if (!target) {
      return;
    }

    setRows((current) => [
      {
        ...target,
        id: `${target.id}-copy-${Date.now()}`,
        name: `${target.name} Copy`,
        status: "Draft"
      },
      ...current
    ]);
    toast.success(`${target.name} duplicated.`);
  }

  function pauseAll() {
    setRows((current) =>
      current.map((row) =>
        row.status === "Active" ? { ...row, status: "Paused" } : row
      )
    );
    toast.success("All active automations were paused.");
  }

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <CardTitle>Automation manager</CardTitle>
            <p className="text-sm text-muted-foreground">
              Search, filter, duplicate, pause, and inspect every workflow from one view.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/workspace/automations/new">Create automation</Link>
            </Button>
            {editable ? (
              <Button variant="outline" onClick={pauseAll}>
                Pause all automations
              </Button>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by automation, trigger, or owner..."
            className="max-w-md"
          />
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Active", "Paused", "Draft"].map((option) => (
              <ToolbarChip
                key={option}
                active={statusFilter === option}
                onClick={() => setStatusFilter(option)}
              >
                {option}
              </ToolbarChip>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Needs attention", "High volume", "Paused"].map((option) => (
            <ToolbarChip
              key={option}
              active={savedFilter === option}
              onClick={() => setSavedFilter(option)}
            >
              {option}
            </ToolbarChip>
          ))}
        </div>
        {!editable ? (
          <div className="rounded-2xl border border-border/70 bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            You are in read-only mode. Staff viewers can inspect performance and logs, but not
            edit or delete workflows.
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        {filteredRows.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Runs</TableHead>
                <TableHead>Last run</TableHead>
                <TableHead>Success rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div>
                      <Link
                        href={`/workspace/automations/${row.id}`}
                        className="font-semibold hover:text-brand"
                      >
                        {row.name}
                      </Link>
                      <p className="mt-1 max-w-md text-sm text-muted-foreground">
                        {row.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{row.triggerLabel}</TableCell>
                  <TableCell>{row.actions.length}</TableCell>
                  <TableCell>
                    {editable ? (
                      <button
                        type="button"
                        onClick={() => updateStatus(row.id)}
                        className="rounded-full"
                      >
                        <Badge variant={statusBadgeVariant(row.status)}>{row.status}</Badge>
                      </button>
                    ) : (
                      <Badge variant={statusBadgeVariant(row.status)}>{row.status}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{row.runs}</TableCell>
                  <TableCell>{row.lastRun ? formatRelativeDate(row.lastRun) : "Never"}</TableCell>
                  <TableCell>{row.successRate}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toast.success(`${row.name} test run queued.`)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      {editable ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => duplicateRow(row.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(row.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            title="No automations matched those filters"
            description="Try clearing your saved filters or search terms to see the full automation list again."
            actionLabel="Clear filters"
            actionHref="/workspace/automations"
          />
        )}
        <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this automation?</AlertDialogTitle>
              <AlertDialogDescription>
                This demo action removes the workflow from the current table view only.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setRows((current) => current.filter((row) => row.id !== deleteId));
                  toast.success("Automation deleted.");
                  setDeleteId(null);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

export function RunLogsTable({
  runs,
  limit
}: {
  runs: FlowPilotRun[];
  limit?: number;
}) {
  const [query, setQuery] = useState("");
  const [resultFilter, setResultFilter] = useState("All");

  const filtered = useMemo(() => {
    const rows = runs.filter((run) => {
      const matchesQuery = `${run.id} ${run.automationName} ${run.triggeredBy} ${run.sourceEvent}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesResult = resultFilter === "All" || run.result === resultFilter;

      return matchesQuery && matchesResult;
    });

    return limit ? rows.slice(0, limit) : rows;
  }, [limit, query, resultFilter, runs]);

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Run logs</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore every execution, filter by result, and jump into detailed run diagnostics.
            </p>
          </div>
          {!limit ? (
            <Button
              variant="outline"
              onClick={() =>
                exportCsv(
                  "flowpilot-run-logs.csv",
                  filtered.map((run) => ({
                    run_id: run.id,
                    automation: run.automationName,
                    triggered_by: run.triggeredBy,
                    time: run.startedAt,
                    result: run.result,
                    duration_ms: run.durationMs
                  }))
                )
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          ) : null}
        </div>
        {!limit ? (
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by run, automation, person, or trigger..."
              className="max-w-md"
            />
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Success", "Failed", "Pending"].map((option) => (
                <ToolbarChip
                  key={option}
                  active={resultFilter === option}
                  onClick={() => setResultFilter(option)}
                >
                  {option}
                </ToolbarChip>
              ))}
            </div>
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Run ID</TableHead>
              <TableHead>Automation</TableHead>
              <TableHead>Triggered by</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((run) => (
              <TableRow key={run.id}>
                <TableCell>
                  <Link href={`/workspace/logs/${run.id}`} className="font-semibold hover:text-brand">
                    {run.id.toUpperCase()}
                  </Link>
                </TableCell>
                <TableCell>{run.automationName}</TableCell>
                <TableCell>{run.triggeredBy}</TableCell>
                <TableCell>{formatDate(run.startedAt, "MMM d, HH:mm")}</TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant(run.result)}>{run.result}</Badge>
                </TableCell>
                <TableCell>{(run.durationMs / 1000).toFixed(1)}s</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function TasksTable({ items }: { items: FlowPilotTask[] }) {
  const [rows, setRows] = useState(items);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(
    () =>
      rows.filter((task) => {
        const matchesQuery = `${task.title} ${task.contactName} ${task.assignee}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesStatus = statusFilter === "All" || task.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [query, rows, statusFilter]
  );

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Automation-generated tasks</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Follow-ups, callbacks, and review items created from your workflows.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              exportCsv(
                "flowpilot-tasks.csv",
                filtered.map((task) => ({
                  id: task.id,
                  title: task.title,
                  contact: task.contactName,
                  due_at: task.dueAt,
                  assignee: task.assignee,
                  priority: task.priority,
                  status: task.status
                }))
              )
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by task, assignee, or contact..."
            className="max-w-md"
          />
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Open", "In Progress", "Waiting", "Completed"].map((option) => (
              <ToolbarChip
                key={option}
                active={statusFilter === option}
                onClick={() => setStatusFilter(option)}
              >
                {option}
              </ToolbarChip>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead>Assigned staff</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Complete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.contactName}</p>
                  </div>
                </TableCell>
                <TableCell>{formatDate(task.dueAt, "MMM d, yyyy")}</TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant(task.priority)}>{task.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant(task.status)}>{task.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRows((current) =>
                        current.map((row) =>
                          row.id === task.id ? { ...row, status: "Completed" } : row
                        )
                      );
                      toast.success("Task marked complete.");
                    }}
                    disabled={task.status === "Completed"}
                  >
                    Complete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function ContactsTable({ items }: { items: FlowPilotContact[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(
    () =>
      items.filter((contact) => {
        const matchesQuery = `${contact.name} ${contact.company} ${contact.email} ${contact.source}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesStatus = statusFilter === "All" || contact.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [items, query, statusFilter]
  );

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Leads and client records</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Demo source data powering your workflow triggers and follow-up logic.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              exportCsv(
                "flowpilot-contacts.csv",
                filtered.map((contact) => ({
                  name: contact.name,
                  company: contact.company,
                  email: contact.email,
                  phone: contact.phone,
                  status: contact.status,
                  source: contact.source,
                  assigned_user: contact.assignedUser,
                  tags: contact.tags.join("|")
                }))
              )
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, company, email, or source..."
            className="max-w-md"
          />
          <div className="flex flex-wrap items-center gap-2">
            {["All", "New", "Qualified", "Proposal", "Active", "Dormant"].map((option) => (
              <ToolbarChip
                key={option}
                active={statusFilter === option}
                onClick={() => setStatusFilter(option)}
              >
                {option}
              </ToolbarChip>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Assigned user</TableHead>
              <TableHead>Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-semibold">{contact.name}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant(contact.status)}>{contact.status}</Badge>
                </TableCell>
                <TableCell>{contact.source}</TableCell>
                <TableCell>{contact.assignedUser}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag) => (
                      <Badge key={`${contact.id}-${tag}`} variant="accent">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function NotificationsCenter({ items }: { items: FlowPilotNotification[] }) {
  const delivered = items.filter((item) => item.status === "Delivered").length;
  const queued = items.filter((item) => item.status === "Queued").length;
  const failed = items.filter((item) => item.status === "Failed").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Delivered</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{delivered}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Queued</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{queued}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{failed}</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Notification feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border/70 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">{item.channel}</Badge>
                  <Badge variant={statusBadgeVariant(item.status)}>{item.status}</Badge>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span>{item.recipient}</span>
                <span>{formatRelativeDate(item.createdAt)}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function TemplatesGrid({ items }: { items: FlowPilotTemplate[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {items.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>{template.name}</CardTitle>
              <Badge variant="accent">{template.category}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{template.description}</p>
            <div className="rounded-2xl border border-border/70 bg-muted/40 p-4 text-sm">
              <p className="font-medium">Trigger</p>
              <p className="mt-1 text-muted-foreground">{template.triggerLabel}</p>
              <p className="mt-3 font-medium">Workflow</p>
              <p className="mt-1 text-muted-foreground">{template.stepsSummary}</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-brand">{template.estimatedLift}</p>
              <Button asChild>
                <Link href={`/workspace/automations/new?template=${template.id}`}>Use template</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function IntegrationsGrid({
  items,
  viewerRole
}: {
  items: FlowPilotIntegration[];
  viewerRole: FlowPilotRole;
}) {
  const canConnect = canManageIntegrations(viewerRole);

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {items.map((integration) => (
        <Card key={integration.id}>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">{integration.name}</CardTitle>
              <Badge variant={statusBadgeVariant(integration.status)}>{integration.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{integration.description}</p>
            <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Category
              </p>
              <p className="mt-2 text-sm font-medium">{integration.category}</p>
              {integration.lastSync ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Last sync {formatRelativeDate(integration.lastSync)}
                </p>
              ) : null}
            </div>
            <Button
              className="w-full"
              variant={integration.status === "Connected" ? "outline" : "default"}
              disabled={integration.status === "Coming soon" || !canConnect}
              onClick={() =>
                toast.success(
                  integration.status === "Connected"
                    ? `${integration.name} is already connected.`
                    : `${integration.name} connected for the demo view.`
                )
              }
            >
              {integration.status === "Connected" ? "Manage connection" : "Connect"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
