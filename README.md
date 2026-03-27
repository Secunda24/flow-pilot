# FlowPilot Automation

FlowPilot Automation is a production-style SaaS demo for selling custom workflow systems. The app showcases a premium automation platform for businesses that want to automate repetitive work with trigger-and-action logic across leads, bookings, invoices, tasks, notifications, client follow-ups, and social media publishing.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Lucide icons
- Supabase-ready auth, database, and storage schema
- React Hook Form + Zod
- Framer Motion
- Recharts
- TanStack Table

## What is included

- Public landing page with hero, features, workflow illustration cards, testimonials, FAQ, and strong demo CTAs
- Protected workspace with a premium dashboard shell, global search, notification bell, breadcrumbs, and dark mode
- Dedicated social planner for post approvals, queue management, publishing visibility, and channel performance
- Admin, Manager, and Staff Viewer demo roles
- Dashboard, automations manager, automation builder, automation detail, logs, tasks, notifications, contacts, templates, reporting, settings, and integrations pages
- Realistic demo data:
  - 12 automations
  - 120 automation runs
  - 35 contacts
  - 40 tasks
  - 25 notifications
  - 8 readable failures
- Supabase SQL schema with foreign keys, enums, timestamps, RLS, and a storage bucket
- Seed script that provisions demo users and populates FlowPilot records

## Demo credentials

- Admin
  - Email: `olivia@flowpilotautomation.com`
  - Password: `AdminFlow123!`
- Manager
  - Email: `daniel@bluepeakgroup.com`
  - Password: `ManagerFlow123!`
- Staff Viewer
  - Email: `mia@bluepeakgroup.com`
  - Password: `StaffFlow123!`

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in your Supabase values if you want live auth and database seeding:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Install dependencies:

```bash
npm install
```

4. Start the app:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

1. Create a new Supabase project.
2. Run [`supabase/schema.sql`](./supabase/schema.sql).
3. Add your Supabase environment variables to `.env.local`.
4. Seed the demo data:

```bash
npm run seed:demo
```

The seed script creates auth users for the three demo accounts when they do not already exist, then upserts companies, profiles, contacts, automations, conditions, actions, runs, tasks, notifications, templates, activity logs, integrations, social posts, and branding settings.

## Environment variables

Core branding and demo settings live in `.env.local`:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_COMPANY_NAME`
- `NEXT_PUBLIC_LOGO_PLACEHOLDER`
- `NEXT_PUBLIC_ACCENT_HSL`
- `NEXT_PUBLIC_SUPPORT_EMAIL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DEMO_ADMIN_EMAIL`
- `DEMO_ADMIN_PASSWORD`
- `DEMO_MANAGER_EMAIL`
- `DEMO_MANAGER_PASSWORD`
- `DEMO_STAFF_EMAIL`
- `DEMO_STAFF_PASSWORD`

## App structure

```text
app/
  (marketing)/            landing page and public entry
  (auth)/                 login, signup, forgot password
  workspace/              protected FlowPilot app routes
  api/                    auth, impersonation, exports, health
components/
  flowpilot/              workspace shell, charts, tables, builder, settings
  layout/                 marketing header/footer, theme toggle
  shared/                 page header, logo, providers, helpers
  ui/                     reusable UI primitives
lib/
  flowpilot-data.ts       demo dataset, helpers, permissions
  flowpilot-auth.ts       cookie session auth for the workspace
  flowpilot-navigation.ts marketing and workspace navigation
  branding.ts             white-label settings helper
scripts/
  seed-demo.ts            Supabase seed script for FlowPilot data
supabase/
  schema.sql              database schema and RLS
```

## Notes

- The `/workspace` experience is the primary product surface.
- `/workspace/social` highlights the social media automation story for client demos.
- `/portal` routes from the older demo are redirected to `/workspace` by middleware so the FlowPilot app remains the active experience.
- Demo interactions such as duplicate automation, pause/resume, run test, exports, and task completion are intentionally optimized for presentation value.

## Verification

Production build verified locally with:

```bash
npm run build
```
