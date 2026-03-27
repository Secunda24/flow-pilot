import { notFound } from "next/navigation";

import { InvoiceStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireClientViewer } from "@/lib/auth";
import { getCompanyById, getInvoiceById } from "@/lib/demo-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function InvoicePrintPage({
  params
}: {
  params: { id: string };
}) {
  const viewer = requireClientViewer();
  const invoice = getInvoiceById(params.id);

  if (!invoice || invoice.companyId !== viewer.actingAsProfile.companyId) {
    notFound();
  }

  const company = getCompanyById(invoice.companyId);

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-10 print:py-0">
      <div className="print:hidden">
        <p className="eyebrow">Print-friendly invoice</p>
      </div>
      <Card className="rounded-[2rem] print:shadow-none">
        <CardContent className="space-y-8 p-8 sm:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-display text-4xl font-semibold">Invoice</p>
              <p className="mt-2 text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
            </div>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Billed to</p>
              <p className="mt-3 font-semibold">{company?.name}</p>
              <p className="text-sm text-muted-foreground">{company?.contactName}</p>
              <p className="text-sm text-muted-foreground">{company?.contactEmail}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Amount due</p>
              <p className="mt-3 font-display text-4xl font-semibold">{formatCurrency(invoice.amount)}</p>
              <p className="text-sm text-muted-foreground">Issued {formatDate(invoice.issuedAt)}</p>
              <p className="text-sm text-muted-foreground">Due {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background/60 p-6">
            <p className="font-semibold">Summary</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{invoice.summary}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

