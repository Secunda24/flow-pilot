import { cookies } from "next/headers";

import { env } from "@/lib/env";
import type { BrandingSettings } from "@/lib/types";

const BRANDING_COOKIE = "clientflow-branding";

export function getDefaultBranding(): BrandingSettings {
  return {
    portalName: env.portalName,
    companyName: env.companyName,
    logoPlaceholder: env.logoPlaceholder,
    accentHsl: env.accentHsl,
    supportEmail: env.supportEmail
  };
}

export function getBrandingSettings(): BrandingSettings {
  const cookieStore = cookies();
  const raw = cookieStore.get(BRANDING_COOKIE)?.value;

  if (!raw) {
    return getDefaultBranding();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<BrandingSettings>;
    return {
      ...getDefaultBranding(),
      ...parsed
    };
  } catch {
    return getDefaultBranding();
  }
}

export const brandingCookieName = BRANDING_COOKIE;
