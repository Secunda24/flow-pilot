import { Download, Printer } from "lucide-react";

import { InvoiceStatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireClientViewer } from "@/lib/auth";
import { getInvoicesForCompany } from "@/lib/demo-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ClientInvoicesPage() {
  const viewer = requireClientViewer();
  const invoices = getInvoicesForCompany(viewer.actingAsProfile.companyId);
  const totalOutstanding = invoices
    .filter((invoice) => invoice.status !== "Paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Invoices"
        title="Billing overview"
        description="Keep finance conversations simple with transparent due dates, invoice status badges, and print-friendly output."
        actions={
          <Button variant="outline" asChild>
            <a href="/api/export/invoices">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </a>
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Outstanding balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-semibold">{formatCurrency(totalOutstanding)}</p>
            <p className="mt-3 text-sm text-muted-foreground">Includes unpaid and overdue invoices.</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invoice list</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-background/60 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <p className="font-semibold">{invoice.invoiceNumber}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {invoice.summary} · Due {formatDate(invoice.dueDate)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-lg font-semibold">{formatCurrency(invoice.amount)}</span>
                  <InvoiceStatusBadge status={invoice.status} />
                  <Button variant="ghost" asChild>
                    <a href={`/portal/client/invoices/${invoice.id}/print`}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print / PDF
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

