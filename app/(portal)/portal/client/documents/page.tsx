import { PageHeader } from "@/components/shared/page-header";
import { DocumentBrowser } from "@/components/shared/document-browser";
import { requireClientViewer } from "@/lib/auth";
import { getDocumentsForCompany } from "@/lib/demo-data";

export default function ClientDocumentsPage() {
  const viewer = requireClientViewer();
  const documents = getDocumentsForCompany(viewer.actingAsProfile.companyId).filter(
    (document) => document.visibility === "client"
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Documents"
        title="Secure document vault"
        description="Preview and download portal-ready files, with upload capability enabled for client collaboration."
      />
      <DocumentBrowser documents={documents} allowUpload />
    </div>
  );
}

