import type { ReactNode } from "react";

import { WorkspaceShell } from "@/components/flowpilot/workspace-shell";
import { getBrandingSettings } from "@/lib/branding";
import { requireFlowPilotViewer } from "@/lib/flowpilot-auth";
import { getScopedNotifications, getSearchItems } from "@/lib/flowpilot-data";
import { getWorkspaceNav } from "@/lib/flowpilot-navigation";

export default function WorkspaceLayout({
  children
}: {
  children: ReactNode;
}) {
  const viewer = requireFlowPilotViewer();
  const companyScope =
    viewer.profile.role === "admin" && !viewer.isImpersonatingCompany
      ? null
      : viewer.activeCompany.id;

  return (
    <WorkspaceShell
      viewer={viewer}
      branding={getBrandingSettings()}
      navItems={getWorkspaceNav(viewer.profile.role)}
      searchItems={getSearchItems(companyScope)}
      notifications={getScopedNotifications(companyScope)}
    >
      {children}
    </WorkspaceShell>
  );
}

