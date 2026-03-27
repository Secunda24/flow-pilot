import { BrandingForm } from "@/components/forms/branding-form";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBrandingSettings } from "@/lib/branding";
import { requireAdminViewer } from "@/lib/auth";

export default function AdminBrandingPage() {
  requireAdminViewer();
  const branding = getBrandingSettings();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="White-label settings"
        title="Branding settings"
        description="Configure the portal name, logo placeholder, company name, and accent color so the app can be repackaged for different service businesses."
      />
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <BrandingForm settings={branding} />
        <Card>
          <CardHeader>
            <CardTitle>Brand preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-sm font-bold tracking-[0.2em]">
                {branding.logoPlaceholder}
              </div>
              <p className="mt-5 font-display text-3xl font-semibold">{branding.portalName}</p>
              <p className="mt-2 text-sm text-slate-300">{branding.companyName}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              The demo persists branding in a cookie so you can showcase a fast white-label transformation without wiring a live backend first.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

