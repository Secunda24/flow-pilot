import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createFlowPilotSessionValue,
  flowPilotAuthCookieName,
  getFlowPilotDemoProfile,
  getFlowPilotHome
} from "@/lib/flowpilot-auth";
import { getSessionCookieOptions } from "@/lib/cookie-options";

const schema = z.object({
  role: z.enum(["admin", "manager", "staff_viewer"])
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid demo role." }, { status: 400 });
  }

  const profile = getFlowPilotDemoProfile(parsed.data.role);
  const response = NextResponse.json({
    redirectTo: getFlowPilotHome()
  });

  response.cookies.set(
    flowPilotAuthCookieName,
    createFlowPilotSessionValue(profile),
    getSessionCookieOptions()
  );

  return response;
}
