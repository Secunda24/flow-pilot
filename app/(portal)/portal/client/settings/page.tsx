import { LockKeyhole, MailCheck } from "lucide-react";

import { ProfileForm } from "@/components/forms/profile-form";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireClientViewer } from "@/lib/auth";
import { getCompanyById } from "@/lib/demo-data";

export default function ClientSettingsPage() {
  const viewer = requireClientViewer();
  const company = getCompanyById(viewer.actingAsProfile.companyId);

  if (!company) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Profile and preferences"
        description="Manage account details, company information, notification preferences, and password reset options."
      />
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <ProfileForm profile={viewer.actingAsProfile} company={company} />
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Account security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
                <div className="flex items-center gap-3">
                  <LockKeyhole className="h-4 w-4 text-brand" />
                  <p className="font-medium">Password reset</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use the forgot password flow to send a secure reset link.
                </p>
              </div>
              <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
                <div className="flex items-center gap-3">
                  <MailCheck className="h-4 w-4 text-brand" />
                  <p className="font-medium">Notification routing</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Email reminders cover request changes, invoice due dates, and shared documents.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
