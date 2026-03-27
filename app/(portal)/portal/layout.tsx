import type { ReactNode } from "react";

import { PortalShell } from "@/components/layout/portal-shell";
import { requireViewer } from "@/lib/auth";

export default function PortalLayout({
  children
}: {
  children: ReactNode;
}) {
  const viewer = requireViewer();

  return <PortalShell viewer={viewer}>{children}</PortalShell>;
}
