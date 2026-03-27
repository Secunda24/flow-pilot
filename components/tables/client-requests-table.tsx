"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { RequestStatusBadge } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatRelativeDate } from "@/lib/utils";
import type { RequestItem } from "@/lib/types";

export function ClientRequestsTable({ data }: { data: RequestItem[] }) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");

  const filteredData = React.useMemo(
    () =>
      data.filter((request) => {
        const matchesSearch = `${request.id} ${request.subject} ${request.category}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus = status === "all" ? true : request.status === status;
        return matchesSearch && matchesStatus;
      }),
    [data, search, status]
  );

  const columns = React.useMemo<ColumnDef<RequestItem>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Request ID"
      },
      {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.subject}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {row.original.category}
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
        accessorKey: "lastUpdated",
        header: "Last updated",
        cell: ({ row }) => formatRelativeDate(row.original.lastUpdated)
      }
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search requests..."
            className="pl-10"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Waiting on Client">Waiting on Client</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="surface overflow-hidden rounded-[2rem] p-3">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/portal/client/requests/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No requests match your current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
