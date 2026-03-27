import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
      <span className="eyebrow">404</span>
      <h1 className="font-display text-5xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        The page you requested is unavailable or may have moved. Head back to the portal home or the marketing site.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/portal">Back to portal</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">View landing page</Link>
        </Button>
      </div>
    </div>
  );
}

