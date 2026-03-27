import { NextResponse } from "next/server";

import { flowPilotCompanyCookieName } from "@/lib/flowpilot-auth";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/workspace", request.url));
  response.cookies.delete(flowPilotCompanyCookieName);
  return response;
}
