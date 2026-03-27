import { NextResponse } from "next/server";

import { getSessionCookieOptions } from "@/lib/cookie-options";
import {
  flowPilotCompanyCookieName,
  parseFlowPilotSessionValue
} from "@/lib/flowpilot-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const companyId = url.searchParams.get("companyId");
  const nextUrl = url.searchParams.get("next") ?? "/workspace";
  const cookieValue = request.headers
    .get("cookie")
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith("flowpilot-session="))
    ?.split("=")[1];
  const session = parseFlowPilotSessionValue(cookieValue ? decodeURIComponent(cookieValue) : null);

  if (!session || session.role !== "admin" || !companyId) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  const response = NextResponse.redirect(new URL(nextUrl, request.url));
  response.cookies.set(flowPilotCompanyCookieName, companyId, getSessionCookieOptions());
  return response;
}
