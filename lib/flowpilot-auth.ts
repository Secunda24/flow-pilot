import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import {
  flowPilotCompanies,
  getFlowPilotCompanyById,
  getFlowPilotDefaultProfile,
  getFlowPilotProfileByEmail,
  getFlowPilotProfileById,
  type FlowPilotCompany,
  type FlowPilotProfile,
  type FlowPilotRole
} from "@/lib/flowpilot-data";

export const flowPilotAuthCookieName = "flowpilot-session";
export const flowPilotCompanyCookieName = "flowpilot-company";

export interface FlowPilotSession {
  profileId: string;
  role: FlowPilotRole;
}

export interface FlowPilotViewer {
  session: FlowPilotSession;
  profile: FlowPilotProfile;
  activeCompany: FlowPilotCompany;
  availableCompanies: FlowPilotCompany[];
  isImpersonatingCompany: boolean;
}

export function createFlowPilotSessionValue(profile: FlowPilotProfile) {
  return JSON.stringify({
    profileId: profile.id,
    role: profile.role
  } satisfies FlowPilotSession);
}

export function parseFlowPilotSessionValue(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as FlowPilotSession;

    if (!parsed.profileId || !parsed.role) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getFlowPilotSessionFromRequest(request: NextRequest) {
  return parseFlowPilotSessionValue(request.cookies.get(flowPilotAuthCookieName)?.value);
}

export function getFlowPilotCompanyFromRequest(request: NextRequest) {
  return request.cookies.get(flowPilotCompanyCookieName)?.value ?? null;
}

export function getFlowPilotHome() {
  return "/workspace";
}

export function getFlowPilotViewer() {
  const cookieStore = cookies();
  const session = parseFlowPilotSessionValue(
    cookieStore.get(flowPilotAuthCookieName)?.value
  );

  if (!session) {
    return null;
  }

  const profile = getFlowPilotProfileById(session.profileId);

  if (!profile) {
    return null;
  }

  const companyId =
    profile.role === "admin"
      ? cookieStore.get(flowPilotCompanyCookieName)?.value ?? profile.companyId
      : profile.companyId;
  const activeCompany =
    getFlowPilotCompanyById(companyId) ??
    getFlowPilotCompanyById(profile.companyId) ??
    flowPilotCompanies[0];

  return {
    session,
    profile,
    activeCompany,
    availableCompanies: flowPilotCompanies,
    isImpersonatingCompany:
      profile.role === "admin" && activeCompany.id !== profile.companyId
  } satisfies FlowPilotViewer;
}

export function requireFlowPilotViewer() {
  const viewer = getFlowPilotViewer();

  if (!viewer) {
    redirect("/login");
  }

  return viewer;
}

export function requireFlowPilotEditor() {
  const viewer = requireFlowPilotViewer();

  if (viewer.profile.role === "staff_viewer") {
    redirect("/workspace/automations");
  }

  return viewer;
}

export function requireFlowPilotAdmin() {
  const viewer = requireFlowPilotViewer();

  if (viewer.profile.role !== "admin") {
    redirect("/workspace");
  }

  return viewer;
}

export function getFlowPilotDemoProfile(role: FlowPilotRole) {
  return getFlowPilotDefaultProfile(role);
}

export function getFlowPilotProfileForLogin(email: string) {
  return getFlowPilotProfileByEmail(email);
}
