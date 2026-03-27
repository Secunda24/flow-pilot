"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const colors = ["#0f766e", "#0284c7", "#f59e0b", "#10b981", "#ef4444"];

export function StatusChart({
  title,
  data
}: {
  title: string;
  data: Array<{ status: string; count: number }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.status} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.map((entry, index) => (
            <div
              key={entry.status}
              className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm font-medium">{entry.status}</span>
              </div>
              <span className="text-sm text-muted-foreground">{entry.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

