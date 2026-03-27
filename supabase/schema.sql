create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'manager', 'staff_viewer');
create type public.automation_status as enum ('Active', 'Paused', 'Draft');
create type public.contact_status as enum ('New', 'Qualified', 'Proposal', 'Active', 'Dormant');
create type public.run_result as enum ('Success', 'Failed', 'Pending');
create type public.task_priority as enum ('Low', 'Medium', 'High', 'Critical');
create type public.task_status as enum ('Open', 'In Progress', 'Waiting', 'Completed');
create type public.notification_channel as enum ('Email', 'WhatsApp', 'In-app');
create type public.notification_status as enum ('Delivered', 'Queued', 'Failed');
create type public.integration_status as enum ('Connected', 'Not connected', 'Coming soon');
create type public.social_post_status as enum ('Scheduled', 'Awaiting approval', 'Published', 'Needs edits');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text not null,
  location text,
  timezone text not null default 'UTC',
  team_size integer not null default 1,
  active_workflows integer not null default 0,
  plan text not null default 'Growth',
  business_hours text,
  support_email text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role public.user_role not null default 'staff_viewer',
  title text,
  avatar text,
  team text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  company_name text,
  email text,
  phone text,
  status public.contact_status not null default 'New',
  source text,
  assigned_user text,
  tags text[] not null default '{}',
  last_touch_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.automations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  owner_profile_id uuid references public.profiles (id) on delete set null,
  owner_name text not null,
  name text not null,
  description text,
  status public.automation_status not null default 'Draft',
  trigger_type text not null,
  trigger_label text not null,
  trigger_description text,
  vertical text,
  last_edited_by_name text,
  last_edited_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.automation_conditions (
  id uuid primary key default gen_random_uuid(),
  automation_id uuid not null references public.automations (id) on delete cascade,
  label text not null,
  field_name text not null,
  operator text not null,
  value_text text not null,
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.automation_actions (
  id uuid primary key default gen_random_uuid(),
  automation_id uuid not null references public.automations (id) on delete cascade,
  action_type text not null,
  label text not null,
  description text,
  channel text,
  delay_hours integer,
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  automation_id uuid not null references public.automations (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  triggered_by_contact_id uuid references public.contacts (id) on delete set null,
  triggered_by_name text,
  source_event text not null,
  started_at timestamptz not null default timezone('utc', now()),
  duration_ms integer not null default 0 check (duration_ms >= 0),
  result public.run_result not null default 'Success',
  error_reason text,
  trigger_snapshot jsonb not null default '[]'::jsonb,
  condition_results jsonb not null default '[]'::jsonb,
  action_timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  automation_id uuid references public.automations (id) on delete set null,
  contact_id uuid references public.contacts (id) on delete set null,
  title text not null,
  due_at timestamptz,
  assignee_name text,
  priority public.task_priority not null default 'Medium',
  status public.task_status not null default 'Open',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  automation_id uuid references public.automations (id) on delete set null,
  profile_id uuid references public.profiles (id) on delete set null,
  title text not null,
  detail text,
  channel public.notification_channel not null default 'In-app',
  status public.notification_status not null default 'Delivered',
  recipient text,
  unread boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies (id) on delete set null,
  is_global boolean not null default true,
  name text not null,
  category text,
  description text,
  trigger_type text not null,
  trigger_label text not null,
  estimated_lift text,
  steps_summary text,
  conditions jsonb not null default '[]'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  automation_id uuid references public.automations (id) on delete set null,
  title text not null,
  detail text not null,
  severity text not null check (severity in ('info', 'warning', 'success', 'danger')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies (id) on delete set null,
  name text not null,
  category text,
  description text,
  status public.integration_status not null default 'Not connected',
  last_sync_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  automation_id uuid references public.automations (id) on delete set null,
  title text not null,
  caption text,
  campaign text,
  channels text[] not null default '{}',
  status public.social_post_status not null default 'Scheduled',
  owner_name text,
  asset_type text,
  scheduled_for timestamptz not null,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.branding_settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies (id) on delete cascade,
  portal_name text not null,
  company_name text not null,
  logo_placeholder text not null,
  accent_hsl text not null,
  support_email text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_company_id on public.profiles (company_id);
create index if not exists idx_contacts_company_id on public.contacts (company_id);
create index if not exists idx_automations_company_id on public.automations (company_id);
create index if not exists idx_automation_conditions_automation_id on public.automation_conditions (automation_id);
create index if not exists idx_automation_actions_automation_id on public.automation_actions (automation_id);
create index if not exists idx_automation_runs_company_id on public.automation_runs (company_id);
create index if not exists idx_automation_runs_automation_id on public.automation_runs (automation_id);
create index if not exists idx_tasks_company_id on public.tasks (company_id);
create index if not exists idx_notifications_company_id on public.notifications (company_id);
create index if not exists idx_templates_company_id on public.templates (company_id);
create index if not exists idx_activity_logs_company_id on public.activity_logs (company_id);
create index if not exists idx_integrations_company_id on public.integrations (company_id);
create index if not exists idx_social_posts_company_id on public.social_posts (company_id);

create trigger set_companies_updated_at
before update on public.companies
for each row execute procedure public.set_updated_at();

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger set_contacts_updated_at
before update on public.contacts
for each row execute procedure public.set_updated_at();

create trigger set_automations_updated_at
before update on public.automations
for each row execute procedure public.set_updated_at();

create trigger set_automation_conditions_updated_at
before update on public.automation_conditions
for each row execute procedure public.set_updated_at();

create trigger set_automation_actions_updated_at
before update on public.automation_actions
for each row execute procedure public.set_updated_at();

create trigger set_automation_runs_updated_at
before update on public.automation_runs
for each row execute procedure public.set_updated_at();

create trigger set_tasks_updated_at
before update on public.tasks
for each row execute procedure public.set_updated_at();

create trigger set_notifications_updated_at
before update on public.notifications
for each row execute procedure public.set_updated_at();

create trigger set_templates_updated_at
before update on public.templates
for each row execute procedure public.set_updated_at();

create trigger set_integrations_updated_at
before update on public.integrations
for each row execute procedure public.set_updated_at();

create trigger set_social_posts_updated_at
before update on public.social_posts
for each row execute procedure public.set_updated_at();

create trigger set_branding_settings_updated_at
before update on public.branding_settings
for each row execute procedure public.set_updated_at();

create or replace function public.current_role()
returns public.user_role
language sql
stable
as $$
  select role
  from public.profiles
  where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.is_manager_or_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'manager')
  );
$$;

create or replace function public.is_company_member(target_company_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and company_id = target_company_id
  );
$$;

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.contacts enable row level security;
alter table public.automations enable row level security;
alter table public.automation_conditions enable row level security;
alter table public.automation_actions enable row level security;
alter table public.automation_runs enable row level security;
alter table public.tasks enable row level security;
alter table public.notifications enable row level security;
alter table public.templates enable row level security;
alter table public.activity_logs enable row level security;
alter table public.integrations enable row level security;
alter table public.social_posts enable row level security;
alter table public.branding_settings enable row level security;

create policy "companies_select_same_company_or_admin"
on public.companies for select
using (public.is_admin() or public.is_company_member(id));

create policy "companies_update_manager_or_admin"
on public.companies for update
using (public.is_admin() or (public.is_manager_or_admin() and public.is_company_member(id)))
with check (public.is_admin() or (public.is_manager_or_admin() and public.is_company_member(id)));

create policy "profiles_select_same_company_or_admin"
on public.profiles for select
using (public.is_admin() or public.is_company_member(company_id) or auth.uid() = id);

create policy "profiles_update_self_or_admin"
on public.profiles for update
using (public.is_admin() or auth.uid() = id)
with check (public.is_admin() or auth.uid() = id);

create policy "contacts_select_same_company_or_admin"
on public.contacts for select
using (public.is_admin() or public.is_company_member(company_id));

create policy "contacts_write_manager_or_admin"
on public.contacts for all
using (public.is_admin() or (public.is_manager_or_admin() and public.is_company_member(company_id)))
with check (public.is_admin() or (public.is_manager_or_admin() and public.is_company_member(company_id)));

create policy "automations_select_same_company_or_admin"
on public.automations for select
using (public.is_admin() or public.is_company_member(company_id));

create policy "automations_write_manager_or_admin"
on public.automations for all
using (public.is_admin() or (public.is_manager_or_admin() and public.is_company_member(company_id)))
with check (public.is_admin() or (public.is_manager_or_admin() and public.is_company_member(company_id)));

create policy "automation_conditions_select"
on public.automation_conditions for select
using (
  public.is_admin()
  or exists (
    select 1 from public.automations
    where automations.id = automation_conditions.automation_id
      and public.is_company_member(automations.company_id)
  )
);

create policy "automation_conditions_write"
on public.automation_conditions for all
using (
  public.is_admin()
  or exists (
    select 1 from public.automations
    where automations.id = automation_conditions.automation_id
      and public.is_company_member(automations.company_id)
      and public.is_manager_or_admin()
  )
)
with check (
  public.is_admin()
  or exists (
    select 1 from public.automations
    where automations.id = automation_conditions.automation_id
      and public.is_company_member(automations.company_id)
      and public.is_manager_or_admin()
  )
);

create policy "automation_actions_select"
on public.automation_actions for select
using (
  public.is_admin()
  or exists (
    select 1 from public.automations
    where automations.id = automation_actions.automation_id
      and public.is_company_member(automations.company_id)
  )
);

create policy "automation_actions_write"
on public.automation_actions for all
using (
  public.is_admin()
  or exists (
    select 1 from public.automations
    where automations.id = automation_actions.automation_id
      and public.is_company_member(automations.company_id)
      and public.is_manager_or_admin()
  )
)
with check (
  public.is_admin()
  or exists (
    select 1 from public.automations
    where automations.id = automation_actions.automation_id
      and public.is_company_member(automations.company_id)
      and public.is_manager_or_admin()
  )
);

create policy "automation_runs_select_same_company_or_admin"
on public.automation_runs for select
using (public.is_admin() or public.is_company_member(company_id));

create policy "automation_runs_insert_manager_or_admin"
on public.automation_runs for insert
with check (public.is_admin() or (public.is_manager_or_admin() and public.is_company_member(company_id)));

create policy "tasks_select_same_company_or_admin"
on public.tasks for select
using (public.is_admin() or public.is_company_member(company_id));

create policy "tasks_write_manager_or_admin"
on public.tasks for all
using (public.is_admin() or (public.is_manager_or_admin() and public.is_company_member(company_id)))
with check (public.is_admin() or (public.is_manager_or_admin() and public.is_company_member(company_id)));

create policy "notifications_select_same_company_or_admin"
on public.notifications for select
using (public.is_admin() or public.is_company_member(company_id));

create policy "notifications_write_manager_or_admin"
on public.notifications for all
using (public.is_admin() or (public.is_manager_or_admin() and public.is_company_member(company_id)))
with check (public.is_admin() or (public.is_manager_or_admin() and public.is_company_member(company_id)));

create policy "templates_select_authenticated"
on public.templates for select
using (auth.uid() is not null);

create policy "templates_write_admin_only"
on public.templates for all
using (public.is_admin())
with check (public.is_admin());

create policy "activity_logs_select_same_company_or_admin"
on public.activity_logs for select
using (public.is_admin() or public.is_company_member(company_id));

create policy "activity_logs_insert_manager_or_admin"
on public.activity_logs for insert
with check (public.is_admin() or (public.is_manager_or_admin() and public.is_company_member(company_id)));

create policy "integrations_select_authenticated"
on public.integrations for select
using (auth.uid() is not null);

create policy "integrations_write_admin_only"
on public.integrations for all
using (public.is_admin())
with check (public.is_admin());

create policy "social_posts_select_same_company_or_admin"
on public.social_posts for select
using (public.is_admin() or public.is_company_member(company_id));

create policy "social_posts_write_manager_or_admin"
on public.social_posts for all
using (public.is_admin() or (public.is_manager_or_admin() and public.is_company_member(company_id)))
with check (public.is_admin() or (public.is_manager_or_admin() and public.is_company_member(company_id)));

create policy "branding_select_same_company_or_admin"
on public.branding_settings for select
using (
  public.is_admin()
  or exists (
    select 1 from public.companies
    where companies.id = branding_settings.company_id
      and public.is_company_member(companies.id)
  )
);

create policy "branding_write_admin_only"
on public.branding_settings for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('flowpilot-assets', 'flowpilot-assets', false)
on conflict (id) do nothing;
