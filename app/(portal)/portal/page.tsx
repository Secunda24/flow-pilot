import { redirect } from "next/navigation";

import { getPortalHome, requireViewer } from "@/lib/auth";

export default function PortalIndexPage() {
  const viewer = requireViewer();
  redirect(getPortalHome(viewer.profile.role));
}

