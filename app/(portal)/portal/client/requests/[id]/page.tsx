import { notFound } from "next/navigation";
import { MessageSquarePlus, Paperclip } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { RequestStatusBadge } from "@/components/shared/status-badge";
import { Timeline } from "@/components/shared/timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireClientViewer } from "@/lib/auth";
import {
  documents,
  getMessagesForRequest,
  getRequestById
} from "@/lib/demo-data";
import { formatDate, formatRelativeDate } from "@/lib/utils";

export default function RequestDetailPage({
  params
}: {
  params: { id: string };
}) {
  const viewer = requireClientViewer();
  const request = getRequestById(params.id);

  if (!request || request.companyId !== viewer.actingAsProfile.companyId) {
    notFound();
  }

  const messages = getMessagesForRequest(request.id);
  const relatedDocuments = documents.filter((document) =>
    request.relatedDocumentIds.includes(document.id)
  );

  const timelineItems = [
    {
      title: "Request created",
      detail: "Your request entered the client portal and was queued for review.",
      date: formatDate(request.createdAt),
      active: true
    },
    {
      title: "Internal triage",
      detail: `Assigned to ${request.assignee} for validation and delivery planning.`,
      date: formatDate(request.lastUpdated),
      active: request.status !== "New"
    },
    {
      title: request.status,
      detail: "Current request state shown across your dashboard and notifications.",
      date: formatRelativeDate(request.lastUpdated),
      active: true
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={request.id}
        title={request.subject}
        description={request.description}
        actions={
          <>
            <RequestStatusBadge status={request.status} />
            <Button variant="outline">
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              Add reply
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Timeline and status</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline items={timelineItems} />
          </CardContent>
        </Card>

        <Card id="conversation">
          <CardHeader>
            <CardTitle>Conversation thread</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-3xl px-5 py-4 ${
                  message.role === "staff" ? "bg-brand text-brand-foreground" : "bg-background/80"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{message.author}</p>
                  <span
                    className={`text-xs ${
                      message.role === "staff" ? "text-brand-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {formatRelativeDate(message.createdAt)}
                  </span>
                </div>
                <p
                  className={`mt-3 text-sm leading-7 ${
                    message.role === "staff" ? "text-brand-foreground/90" : "text-muted-foreground"
                  }`}
                >
                  {message.body}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Attachments and notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-dashed border-border p-5">
              <div className="flex items-center gap-3">
                <Paperclip className="h-4 w-4 text-brand" />
                <p className="font-medium">Upload zone ready</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                In production, files upload to Supabase Storage and appear directly inside the request thread.
              </p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
              <p className="text-sm font-medium">Internal delivery note</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Priority: {request.priority} · Category: {request.category} · Last updated {formatRelativeDate(request.lastUpdated)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Related documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {relatedDocuments.map((document) => (
              <div
                key={document.id}
                className="rounded-3xl border border-border/70 bg-background/60 p-4"
              >
                <p className="font-semibold">{document.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {document.category} · Uploaded {formatDate(document.uploadedAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

