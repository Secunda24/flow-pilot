import type { ReactNode } from "react";

import { getBrandingSettings } from "@/lib/branding";
import { getGlobalSearchIndex, notifications } from "@/lib/demo-data";
import type { PortalViewer } from "@/lib/auth";
import type { NotificationItem } from "@/lib/types";
import { adminNav, clientNav } from "@/lib/navigation";

import { PortalHeader } from "@/components/layout/portal-header";
import { PortalSidebar } from "@/components/layout/portal-sidebar";
import { ImpersonationBanner } from "@/components/layout/impersonation-banner";
import { AiWidgetPlaceholder } from "@/components/shared/ai-widget";

export function PortalShell({
  viewer,
  children
}: {
  viewer: PortalViewer;
  children: ReactNode;
}) {
  const branding = getBrandingSettings();
  const effectiveRole = viewer.isImpersonating ? "client" : viewer.profile.role;
  const navItems = effectiveRole === "admin" ? adminNav : clientNav;
  const searchItems = getGlobalSearchIndex();
  const visibleNotifications = notifications.filter(
    (item) => item.audience === "all" || item.audience === effectiveRole
  ) as NotificationItem[];

  return (
    <div className="container py-4 sm:py-6">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="print:hidden">
          <PortalSidebar
            items={navItems}
            portalName={branding.portalName}
            mark={branding.logoPlaceholder}
          />
        </div>
        <div className="space-y-6">
          <div className="print:hidden">
            <PortalHeader
              profile={viewer.actingAsProfile}
              searchItems={searchItems}
              notifications={visibleNotifications}
            />
          </div>
          {viewer.isImpersonating ? (
            <div className="print:hidden">
              <ImpersonationBanner clientName={viewer.actingAsProfile.fullName} />
            </div>
          ) : null}
          <main className="space-y-6 pb-24">{children}</main>
        </div>
      </div>
      <AiWidgetPlaceholder />
    </div>
  );
}
