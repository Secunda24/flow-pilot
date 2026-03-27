import { NextResponse } from "next/server";

import { brandingCookieName } from "@/lib/branding";
import {
  flowPilotAuthCookieName,
  flowPilotCompanyCookieName
} from "@/lib/flowpilot-auth";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(flowPilotAuthCookieName);
  response.cookies.delete(flowPilotCompanyCookieName);
  response.cookies.set(brandingCookieName, "", { path: "/", maxAge: 0 });
  return response;
}
