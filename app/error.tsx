"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <span className="eyebrow">Something went wrong</span>
      <h1 className="font-display text-5xl font-semibold tracking-tight">The portal hit an unexpected state</h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Try the action again. If this happens in production, connect error monitoring and route the event into your support workflow.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
