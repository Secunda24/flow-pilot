import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
        <div className="rounded-full bg-brand-soft px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Empty state
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="max-w-lg text-sm text-muted-foreground">{description}</p>
        </div>
        {actionLabel && actionHref ? (
          <Button asChild>
            <a href={actionHref}>{actionLabel}</a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

