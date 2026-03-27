import { NextResponse } from "next/server";

import { invoices } from "@/lib/demo-data";
import { toCsv } from "@/lib/utils";

export async function GET() {
  const rows = invoices.map((invoice) => ({
    invoice_number: invoice.invoiceNumber,
    amount: invoice.amount,
    issued_at: invoice.issuedAt,
    due_date: invoice.dueDate,
    status: invoice.status,
    summary: invoice.summary
  }));

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="clientflow-invoices.csv"'
    }
  });
}

