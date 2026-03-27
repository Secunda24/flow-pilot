import { DocumentBrowser } from "@/components/shared/document-browser";
import { PageHeader } from "@/components/shared/page-header";
import { requireAdminViewer } from "@/lib/auth";
import { documents } from "@/lib/demo-data";

export default function AdminDocumentsPage() {
  requireAdminViewer();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Documents"
        title="Document management"
        description="Upload, tag, and control visibility for client files, reports, and finance documents in one secure workspace."
      />
      <DocumentBrowser documents={documents} allowUpload />
    </div>
  );
}

