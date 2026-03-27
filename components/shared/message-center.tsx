"use client";

import { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelativeDate } from "@/lib/utils";
import type { RequestItem, RequestMessage } from "@/lib/types";

export function MessageCenter({
  requests,
  messages
}: {
  requests: RequestItem[];
  messages: RequestMessage[];
}) {
  const [selectedId, setSelectedId] = useState(requests[0]?.id ?? "");

  const threadMessages = useMemo(
    () => messages.filter((message) => message.requestId === selectedId),
    [messages, selectedId]
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      <Card>
        <ScrollArea className="h-[560px]">
          <CardContent className="space-y-3 p-4">
            {requests.map((request) => (
              <button
                key={request.id}
                type="button"
                onClick={() => setSelectedId(request.id)}
                className={`w-full rounded-3xl border p-4 text-left transition ${
                  selectedId === request.id
                    ? "border-brand bg-brand-soft/60"
                    : "border-border/70 bg-background/60 hover:bg-muted/60"
                }`}
              >
                <p className="font-medium">{request.subject}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {request.id} · {formatRelativeDate(request.lastUpdated)}
                </p>
              </button>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>
      <Card>
        <ScrollArea className="h-[560px]">
          <CardContent className="space-y-5 p-6">
            {threadMessages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-3xl px-5 py-4 ${
                  message.role === "staff"
                    ? "ml-auto bg-brand text-brand-foreground"
                    : "bg-background/80"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{message.author}</p>
                  <p
                    className={`text-xs ${
                      message.role === "staff" ? "text-brand-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {formatRelativeDate(message.createdAt)}
                  </p>
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
        </ScrollArea>
      </Card>
    </div>
  );
}

