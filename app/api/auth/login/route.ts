import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getSessionCookieOptions } from "@/lib/cookie-options";
import { env, isSupabaseConfigured } from "@/lib/env";
import {
  createFlowPilotSessionValue,
  flowPilotAuthCookieName,
  getFlowPilotDemoProfile,
  getFlowPilotHome,
  getFlowPilotProfileForLogin
} from "@/lib/flowpilot-auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  redirectTo: z.string().optional().nullable()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a valid email and password." }, { status: 400 });
  }

  const { email, password, redirectTo } = parsed.data;
  const profile = getFlowPilotProfileForLogin(email);

  if (isSupabaseConfigured && env.supabaseUrl && env.supabaseAnonKey) {
    const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user) {
      return NextResponse.json({ error: "We couldn't sign you in with those credentials." }, { status: 401 });
    }
  } else {
    const isDemoAdmin = email === env.demoAdminEmail && password === env.demoAdminPassword;
    const isDemoManager =
      email === env.demoManagerEmail && password === env.demoManagerPassword;
    const isDemoStaff = email === env.demoStaffEmail && password === env.demoStaffPassword;

    if (!isDemoAdmin && !isDemoManager && !isDemoStaff && !profile) {
      return NextResponse.json(
        { error: "Use the demo credentials listed on the sign-in screen or connect Supabase for full auth." },
        { status: 401 }
      );
    }
  }

  const resolvedProfile =
    profile ??
    (email === env.demoAdminEmail
      ? getFlowPilotDemoProfile("admin")
      : email === env.demoStaffEmail
        ? getFlowPilotDemoProfile("staff_viewer")
        : getFlowPilotDemoProfile("manager"));

  const response = NextResponse.json({
    redirectTo: redirectTo || getFlowPilotHome()
  });

  response.cookies.set(
    flowPilotAuthCookieName,
    createFlowPilotSessionValue(resolvedProfile),
    getSessionCookieOptions()
  );

  return response;
}
