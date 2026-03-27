import { NextResponse } from "next/server";
import { z } from "zod";

import { brandingCookieName, getDefaultBranding } from "@/lib/branding";
import { getClientCookieOptions } from "@/lib/cookie-options";

const schema = z.object({
  portalName: z.string().min(2),
  companyName: z.string().min(2),
  logoPlaceholder: z.string().min(1).max(4),
  accentHsl: z.string().min(5)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all branding fields." }, { status: 400 });
  }

  const response = NextResponse.json({
    message: "Branding updated."
  });

  response.cookies.set(
    brandingCookieName,
    JSON.stringify({
      ...getDefaultBranding(),
      ...parsed.data
    }),
    getClientCookieOptions()
  );

  return response;
}
