"use client";

import * as React from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";

import { RequestStatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RequestItem } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";

export function AdminRequestManagement({
  requests,
  companyMap
}: {
  requests: RequestItem[];
  companyMap: Record<string, string>;
}) {
  const [priority, setPriority] = React.useState("all");
  const [category, setCategory] = React.useState("all");

  const filtered = React.useMemo(
    () =>
      requests.filter((request) => {
        const matchesPriority = priority === "all" ? true : request.priority === priority;
        const matchesCategory = category === "all" ? true : request.category === category;
        return matchesPriority && matchesCategory;
      }),
    [category, priority, requests]
  );

  const columns = React.useMemo<ColumnDef<RequestItem>[]>(
    () => [
      {
        accessorKey: "subject",
        header: "Request",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.subject}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {companyMap[row.original.companyId]}
            </p>
          </div>
        )
      },
      {
        accessorKey: "priority",
        header: "Priority"
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <RequestStatusBadge status={row.original.status} />
      },
      {
        accessorKey: "assignee",
        header: "Assignee"
      },
      {
        accessorKey: "lastUpdated",
        header: "Updated",
        cell: ({ row }) => formatRelativeDate(row.original.lastUpdated)
      },
      {
        id: "open",
        header: "Open",
        cell: ({ row }) => (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/portal/client/requests/${row.original.id}`}>Preview</Link>
          </Button>
        )
      }
    ],
    [companyMap]
  );

  const statuses = ["New", "In Progress", "Waiting on Client", "Completed", "Overdue"] as const;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {["Low", "Medium", "High", "Critical"].map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {Array.from(new Set(requests.map((request) => request.category))).map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban board</TabsTrigger>
          <TabsTrigger value="table">Table view</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
          <div className="grid gap-5 xl:grid-cols-5">
            {statuses.map((status) => (
              <Card key={status}>
                <CardHeader>
                  <CardTitle className="text-base">{status}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filtered
                    .filter((request) => request.status === status)
                    .map((request) => (
                      <div
                        key={request.id}
                        className="rounded-3xl border border-border/70 bg-background/60 p-4"
                      >
                        <p className="font-medium">{request.subject}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {companyMap[request.companyId]}
                        </p>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {request.priority} priority · {request.assignee}
                        </p>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <DataTable columns={columns} data={filtered} searchKey="subject" placeholder="Search requests..." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
