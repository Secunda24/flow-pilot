import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import {
  adminProfiles,
  clientProfiles,
  getCompanyById,
  getProfileByEmail,
  getProfileById
} from "@/lib/demo-data";
import type { Profile, UserRole } from "@/lib/types";

export const authCookieName = "clientflow-session";
export const impersonationCookieName = "clientflow-impersonation";

export interface PortalSession {
  profileId: string;
  role: UserRole;
}

export interface PortalViewer {
  session: PortalSession;
  profile: Profile;
  actingAsProfile: Profile;
  isImpersonating: boolean;
}

export function createSessionValue(profile: Profile) {
  return JSON.stringify({
    profileId: profile.id,
    role: profile.role
  } satisfies PortalSession);
}

export function parseSessionValue(value?: string | null): PortalSession | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as PortalSession;
    if (!parsed.profileId || !parsed.role) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: NextRequest) {
  return parseSessionValue(request.cookies.get(authCookieName)?.value);
}

export function getImpersonationFromRequest(request: NextRequest) {
  return request.cookies.get(impersonationCookieName)?.value ?? null;
}

export function getViewer(): PortalViewer | null {
  const cookieStore = cookies();
  const session = parseSessionValue(cookieStore.get(authCookieName)?.value);

  if (!session) {
    return null;
  }

  const profile = getProfileById(session.profileId);

  if (!profile) {
    return null;
  }

  const impersonationId = cookieStore.get(impersonationCookieName)?.value;
  const actingAsProfile =
    session.role === "admin" && impersonationId
      ? getProfileById(impersonationId) ?? profile
      : profile;

  return {
    session,
    profile,
    actingAsProfile,
    isImpersonating: actingAsProfile.id !== profile.id
  };
}

export function requireViewer() {
  const viewer = getViewer();

  if (!viewer) {
    redirect("/login");
  }

  return viewer;
}

export function getPortalHome(role: UserRole) {
  return role === "admin" ? "/portal/admin" : "/portal/client";
}

export function requireClientViewer() {
  const viewer = requireViewer();

  if (viewer.profile.role !== "client" && !viewer.isImpersonating) {
    redirect(getPortalHome(viewer.profile.role));
  }

  return viewer;
}

export function requireAdminViewer() {
  const viewer = requireViewer();

  if (viewer.profile.role !== "admin") {
    redirect(getPortalHome(viewer.profile.role));
  }

  return viewer;
}

export function canAccessPath(role: UserRole, pathname: string) {
  if (pathname.startsWith("/portal/admin")) {
    return role === "admin";
  }

  if (pathname.startsWith("/portal/client")) {
    return role === "client" || role === "admin";
  }

  return true;
}

export function getDemoProfileForRole(role: UserRole) {
  return role === "admin" ? adminProfiles[0] : clientProfiles[0];
}

export function getProfileForLogin(email: string) {
  return getProfileByEmail(email);
}

export function getViewerCompany() {
  const viewer = getViewer();

  if (!viewer) {
    return null;
  }

  return getCompanyById(viewer.actingAsProfile.companyId);
}
