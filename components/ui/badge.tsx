import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-muted-foreground",
        info: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
        success:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
        warning:
          "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
        danger: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
        accent: "bg-brand-soft text-brand"
      }
    },
    defaultVariants: {
      variant: "neutral"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

