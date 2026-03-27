import { CheckCircle2, Download, ReceiptText } from "lucide-react";

import { InvoiceStatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminViewer } from "@/lib/auth";
import { companies, invoices } from "@/lib/demo-data";
import { formatCurrency, formatDate } from "@/lib/utils";

const companyMap = Object.fromEntries(companies.map((company) => [company.id, company.name]));

export default function AdminInvoicesPage() {
  requireAdminViewer();
  const totalOutstanding = invoices
    .filter((invoice) => invoice.status !== "Paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Invoices"
        title="Invoice management"
        description="Create, edit, and review invoice statuses with export-ready data and print-friendly output."
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
        <Card>
          <CardHeader>
            <CardTitle>Total outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-semibold">{formatCurrency(totalOutstanding)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Paid invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-semibold">
              {invoices.filter((invoice) => invoice.status === "Paid").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overdue invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-semibold">
              {invoices.filter((invoice) => invoice.status === "Overdue").length}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Invoice records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-background/60 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <p className="font-semibold">{invoice.invoiceNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {companyMap[invoice.companyId]} · Due {formatDate(invoice.dueDate)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg font-semibold">{formatCurrency(invoice.amount)}</span>
                <InvoiceStatusBadge status={invoice.status} />
                <Button variant="ghost" size="sm">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark paid
                </Button>
                <Button variant="ghost" size="sm">
                  <ReceiptText className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

