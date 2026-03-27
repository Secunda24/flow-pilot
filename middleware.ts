import { NextResponse, type NextRequest } from "next/server";

import { getFlowPilotSessionFromRequest } from "@/lib/flowpilot-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/portal")) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  if (!pathname.startsWith("/workspace")) {
    return NextResponse.next();
  }

  const session = getFlowPilotSessionFromRequest(request);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/workspace/:path*"]
};
