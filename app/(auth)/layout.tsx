import type { ReactNode } from "react";

export default function AuthLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="container grid min-h-screen items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <span className="eyebrow">FlowPilot Automation</span>
        <h1 className="font-display text-5xl font-semibold tracking-tight">
          Automate the work that slows your business down
        </h1>
        <p className="max-w-xl text-lg leading-8 text-muted-foreground">
          A premium workflow automation demo for leads, bookings, invoices, tasks, notifications, and cross-team follow-ups.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
            <p className="font-semibold">Built for demos</p>
            <p className="mt-2 text-sm text-muted-foreground">Polished tables, charts, empty states, and workflow builder screens help the product feel ready to sell.</p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
            <p className="font-semibold">Supabase ready</p>
            <p className="mt-2 text-sm text-muted-foreground">Auth, schema, RLS policies, and realistic seed data are included for a future production rollout.</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center lg:justify-end">{children}</div>
    </div>
  );
}
