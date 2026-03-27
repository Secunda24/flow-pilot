"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function AiWidgetPlaceholder() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 print:hidden">
      {open ? (
        <div className="surface mb-3 w-[320px] rounded-[2rem] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">AI concierge coming soon</p>
              <p className="mt-2 text-sm text-muted-foreground">
                This placeholder shows where a future assistant can help clients draft requests, summarize updates, and answer account questions.
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              ×
            </Button>
          </div>
        </div>
      ) : null}
      <Button size="lg" className="h-14 rounded-full px-5" onClick={() => setOpen((value) => !value)}>
        <Sparkles className="mr-2 h-4 w-4" />
        AI Assistant
      </Button>
    </div>
  );
}
