import { FileText, FolderKanban, ReceiptText, ShieldCheck, Ticket } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeDate } from "@/lib/utils";
import type { ActivityLog } from "@/lib/types";

const iconMap = {
  request: Ticket,
  invoice: ReceiptText,
  project: FolderKanban,
  document: FileText,
  account: ShieldCheck
};

export function ActivityFeed({
  title = "Recent activity",
  items
}: {
  title?: string;
  items: ActivityLog[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const Icon = iconMap[item.type];
          return (
            <div
              key={item.id}
              className="flex items-start gap-4 rounded-2xl border border-border/70 bg-background/60 p-4"
            >
              <div className="rounded-2xl bg-brand-soft p-3 text-brand">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeDate(item.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-brand">
                  {item.actor}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

