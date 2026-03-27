import { Download } from "lucide-react";

import { AdminRequestManagement } from "@/components/shared/admin-request-management";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { requireAdminViewer } from "@/lib/auth";
import { companies, requests } from "@/lib/demo-data";

export default function AdminRequestsPage() {
  requireAdminViewer();
  const companyMap = Object.fromEntries(companies.map((company) => [company.id, company.name]));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Requests"
        title="Request management"
        description="Switch between kanban and table view, filter by category and priority, and preview the client-facing detail experience."
        actions={
          <Button variant="outline" asChild>
            <a href="/api/export/requests">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </a>
          </Button>
        }
      />
      <AdminRequestManagement requests={requests} companyMap={companyMap} />
    </div>
  );
}

