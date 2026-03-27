import { Plus } from "lucide-react";

import { AdminClientsTable } from "@/components/tables/admin-clients-table";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { requireAdminViewer } from "@/lib/auth";
import { companies, getRequestsForCompany } from "@/lib/demo-data";

export default function AdminClientsPage() {
  requireAdminViewer();
  const rows = companies.map((company) => ({
    id: company.id,
    company: company.name,
    contact: company.contactName,
    email: company.contactEmail,
    industry: company.industry,
    plan: company.plan,
    openRequests: getRequestsForCompany(company.id).filter((request) => request.status !== "Completed").length
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Clients"
        title="Client management"
        description="Search client accounts, review stats, open detail views, and impersonate the exact portal experience for demos."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add client
          </Button>
        }
      />
      <AdminClientsTable data={rows} />
    </div>
  );
}

