import {
  Bell,
  BriefcaseBusiness,
  CreditCard,
  Files,
  MessageSquareText,
  ShieldCheck
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Client-first dashboards",
    description: "Beautiful overview cards, live request counts, project progress, and recent activity in one premium space.",
    icon: BriefcaseBusiness
  },
  {
    title: "Secure documents",
    description: "Upload, preview, download, and control client visibility for agreements, reports, and invoices.",
    icon: Files
  },
  {
    title: "Messaging and updates",
    description: "Keep support threads, request comments, and internal coordination visible without endless email chains.",
    icon: MessageSquareText
  },
  {
    title: "Billing clarity",
    description: "Unpaid totals, due dates, print-friendly invoice views, and downloadable exports for finance teams.",
    icon: CreditCard
  },
  {
    title: "Notifications that matter",
    description: "Unread counts, alerts, and activity feeds keep everyone aligned without making the portal noisy.",
    icon: Bell
  },
  {
    title: "Role-aware security",
    description: "Supabase auth, route protection, row-level security, and impersonation-ready admin workflows.",
    icon: ShieldCheck
  }
];

export function FeatureGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <Card key={feature.title}>
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

