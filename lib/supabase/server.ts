import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";

type CookieOptions = {
  domain?: string;
  path?: string;
  expires?: Date;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none" | boolean;
};

export function createServerSupabaseClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const cookieStore = cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options });
      }
    }
  });
}
