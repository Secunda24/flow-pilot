import { MessageCenter } from "@/components/shared/message-center";
import { PageHeader } from "@/components/shared/page-header";
import { requireClientViewer } from "@/lib/auth";
import { getMessagesForRequest, getRequestsForCompany } from "@/lib/demo-data";

export default function ClientMessagesPage() {
  const viewer = requireClientViewer();
  const requests = getRequestsForCompany(viewer.actingAsProfile.companyId);
  const messages = requests.flatMap((request) => getMessagesForRequest(request.id));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Messages"
        title="Inbox and support threads"
        description="Keep communication tied to the actual work so clients and staff always share one source of context."
      />
      <MessageCenter requests={requests} messages={messages} />
    </div>
  );
}

