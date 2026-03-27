import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";

import { env, isSupabaseConfigured } from "@/lib/env";

const schema = z.object({
  email: z.string().email()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  if (isSupabaseConfigured && env.supabaseUrl && env.supabaseAnonKey) {
    const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${env.siteUrl}/login`
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  return NextResponse.json({
    message: "If that email exists, reset instructions are on the way."
  });
}

