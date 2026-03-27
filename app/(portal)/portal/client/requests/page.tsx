import { Download, Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ClientRequestsTable } from "@/components/tables/client-requests-table";
import { requireClientViewer } from "@/lib/auth";
import { getRequestsForCompany } from "@/lib/demo-data";

export default function ClientRequestsPage() {
  const viewer = requireClientViewer();
  const requests = getRequestsForCompany(viewer.actingAsProfile.companyId);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Requests"
        title="My requests"
        description="Track every issue, ask, and delivery request with premium filtering, status visibility, and threaded context."
        actions={
          <>
            <Button variant="outline" asChild>
              <a href="/api/export/requests">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </a>
            </Button>
            <Button asChild>
              <a href="/portal/client/requests/new">
                <Plus className="mr-2 h-4 w-4" />
                New request
              </a>
            </Button>
          </>
        }
      />
      <ClientRequestsTable data={requests} />
    </div>
  );
}

