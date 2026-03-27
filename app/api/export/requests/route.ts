import { NextResponse } from "next/server";

import { requests } from "@/lib/demo-data";
import { toCsv } from "@/lib/utils";

export async function GET() {
  const rows = requests.map((request) => ({
    id: request.id,
    subject: request.subject,
    category: request.category,
    priority: request.priority,
    status: request.status,
    assignee: request.assignee,
    updated_at: request.lastUpdated
  }));

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="clientflow-requests.csv"'
    }
  });
}

