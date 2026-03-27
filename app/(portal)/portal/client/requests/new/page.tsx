import { PageHeader } from "@/components/shared/page-header";
import { RequestForm } from "@/components/forms/request-form";

export default function NewRequestPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="New request"
        title="Submit a new request"
        description="Capture the subject, category, priority, details, and supporting files so your team can respond quickly."
      />
      <RequestForm />
    </div>
  );
}

