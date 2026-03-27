import Link from "next/link";

import { Button } from "@/components/ui/button";

export function ImpersonationBanner({
  clientName
}: {
  clientName: string;
}) {
  return (
    <div className="surface flex flex-col gap-3 rounded-[2rem] border border-brand/20 bg-brand-soft/70 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-brand">Impersonation mode active</p>
        <p className="text-sm text-muted-foreground">
          You are currently viewing the portal as {clientName}.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link href="/api/impersonate/clear">Return to admin view</Link>
      </Button>
    </div>
  );
}

