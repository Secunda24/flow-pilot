import Link from "next/link";

import { cn } from "@/lib/utils";

export function SiteLogo({
  name,
  mark,
  href = "/",
  className,
  eyebrow = "Workflow automation"
}: {
  name: string;
  mark: string;
  href?: string;
  className?: string;
  eyebrow?: string;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3", className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-sm font-bold tracking-[0.2em] text-brand-foreground shadow-lg shadow-brand/20">
        {mark}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
          {eyebrow}
        </span>
        <span className="font-display text-lg font-semibold leading-none text-foreground">
          {name}
        </span>
      </div>
    </Link>
  );
}
