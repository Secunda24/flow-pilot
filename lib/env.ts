export const env = {
  portalName:
    process.env.NEXT_PUBLIC_APP_NAME ??
    process.env.NEXT_PUBLIC_PORTAL_NAME ??
    "FlowPilot Automation",
  companyName:
    process.env.NEXT_PUBLIC_COMPANY_NAME ?? "BluePeak Operations Group",
  logoPlaceholder: process.env.NEXT_PUBLIC_LOGO_PLACEHOLDER ?? "FP",
  accentHsl: process.env.NEXT_PUBLIC_ACCENT_HSL ?? "221 83% 53%",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ??
    "support@flowpilotautomation.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  demoClientEmail:
    process.env.DEMO_CLIENT_EMAIL ?? "sarah.chen@amandelstudio.com",
  demoClientPassword: process.env.DEMO_CLIENT_PASSWORD ?? "ClientFlow123!",
  demoAdminEmail:
    process.env.DEMO_ADMIN_EMAIL ?? "olivia@flowpilotautomation.com",
  demoAdminPassword: process.env.DEMO_ADMIN_PASSWORD ?? "AdminFlow123!",
  demoManagerEmail:
    process.env.DEMO_MANAGER_EMAIL ?? "daniel@bluepeakgroup.com",
  demoManagerPassword:
    process.env.DEMO_MANAGER_PASSWORD ?? "ManagerFlow123!",
  demoStaffEmail: process.env.DEMO_STAFF_EMAIL ?? "mia@bluepeakgroup.com",
  demoStaffPassword: process.env.DEMO_STAFF_PASSWORD ?? "StaffFlow123!"
};

export const isSupabaseConfigured = Boolean(
  env.supabaseUrl && env.supabaseAnonKey
);
