"use client";

import * as React from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ClientRow = {
  id: string;
  company: string;
  contact: string;
  email: string;
  industry: string;
  plan: string;
  openRequests: number;
};

export function AdminClientsTable({ data }: { data: ClientRow[] }) {
  const columns = React.useMemo<ColumnDef<ClientRow>[]>(
    () => [
      {
        accessorKey: "company",
        header: "Client",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.company}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {row.original.industry}
            </p>
          </div>
        )
      },
      {
        accessorKey: "contact",
        header: "Primary contact"
      },
      {
        accessorKey: "email",
        header: "Email"
      },
      {
        accessorKey: "plan",
        header: "Plan",
        cell: ({ row }) => <Badge variant="accent">{row.original.plan}</Badge>
      },
      {
        accessorKey: "openRequests",
        header: "Open requests"
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/portal/admin/clients/${row.original.id}`}>View</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/api/impersonate?profileId=client-${row.original.id.split("-")[1]}&next=/portal/client`}>
                Impersonate
              </Link>
            </Button>
          </div>
        )
      }
    ],
    []
  );

  return <DataTable columns={columns} data={data} searchKey="company" placeholder="Search clients..." />;
}

