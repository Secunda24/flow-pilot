import type { ComponentType } from "react";

import { ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <CardTitle className="mt-3 text-3xl">{value}</CardTitle>
        </div>
        <div className="rounded-2xl bg-brand-soft p-3 text-brand">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowUpRight className="h-4 w-4 text-brand" />
        <span>{detail}</span>
      </CardContent>
    </Card>
  );
}
