"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";

export function GlobalSearch({
  items
}: {
  items: Array<{ id: string; type: string; label: string; href: string }>;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    return items
      .filter((item) =>
        `${item.label} ${item.type}`.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }, [items, query]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search requests, projects, articles..."
        className="pl-10"
      />
      {results.length ? (
        <div className="absolute top-full z-30 mt-2 w-full rounded-3xl border border-border bg-popover p-2 shadow-card">
          {results.map((result) => (
            <Link
              key={result.id}
              href={result.href}
              className="flex items-center justify-between rounded-2xl px-4 py-3 transition hover:bg-accent"
              onClick={() => setQuery("")}
            >
              <div>
                <p className="font-medium">{result.label}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {result.type}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

