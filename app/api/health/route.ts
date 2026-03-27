import { NextResponse } from "next/server";

import { getDefaultBranding } from "@/lib/branding";
import { isSupabaseConfigured } from "@/lib/env";

export async function GET() {
  const branding = getDefaultBranding();

  return NextResponse.json({
    status: "ok",
    app: branding.portalName,
    company: branding.companyName,
    mode: isSupabaseConfigured ? "supabase-configured" : "demo-mode"
  });
}

