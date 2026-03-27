import "dotenv/config";

import crypto from "node:crypto";

import { createClient } from "@supabase/supabase-js";

import { env } from "../lib/env";
import {
  flowPilotActivity,
  flowPilotAutomations,
  flowPilotCompanies,
  flowPilotContacts,
  flowPilotDemoCredentials,
  flowPilotIntegrations,
  flowPilotNotifications,
  flowPilotProfiles,
  flowPilotRuns,
  flowPilotSocialPosts,
  flowPilotTasks,
  flowPilotTemplates
} from "../lib/flowpilot-data";

function stableUuid(seed: string) {
  const hash = crypto.createHash("md5").update(seed).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

async function main() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running the seed.");
  }

  const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      persistSession: false
    }
  });

  const existingUsers = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200
  });

  if (existingUsers.error) {
    throw existingUsers.error;
  }

  const userByEmail = new Map(
    (existingUsers.data.users ?? []).map((user) => [user.email?.toLowerCase() ?? "", user])
  );

  const profileIdMap = new Map<string, string>();
  const companyIdMap = new Map(
    flowPilotCompanies.map((company) => [company.id, stableUuid(`company:${company.id}`)])
  );
  const contactIdMap = new Map(
    flowPilotContacts.map((contact) => [contact.id, stableUuid(`contact:${contact.id}`)])
  );
  const automationIdMap = new Map(
    flowPilotAutomations.map((automation) => [
      automation.id,
      stableUuid(`automation:${automation.id}`)
    ])
  );

  for (const profile of flowPilotProfiles) {
    const existing = userByEmail.get(profile.email.toLowerCase());
    let userId = existing?.id;

    if (!userId) {
      const createResult = await supabase.auth.admin.createUser({
        email: profile.email,
        password:
          profile.role === "admin"
            ? flowPilotDemoCredentials.admin.password
            : profile.role === "manager"
              ? flowPilotDemoCredentials.manager.password
              : flowPilotDemoCredentials.staff_viewer.password,
        email_confirm: true,
        user_metadata: {
          full_name: profile.fullName,
          role: profile.role
        }
      });

      if (createResult.error || !createResult.data.user) {
        throw createResult.error ?? new Error(`Unable to create auth user for ${profile.email}`);
      }

      userId = createResult.data.user.id;
    }

    profileIdMap.set(profile.id, userId);
  }

  const fallbackProfileId = profileIdMap.get(flowPilotProfiles[0].id) ?? null;
  const ownerProfileLookup = new Map(
    flowPilotProfiles.map((profile) => [profile.fullName, profileIdMap.get(profile.id) ?? null])
  );

  await supabase.from("companies").upsert(
    flowPilotCompanies.map((company) => ({
      id: companyIdMap.get(company.id),
      name: company.name,
      industry: company.industry,
      location: company.location,
      timezone: company.timezone,
      team_size: company.teamSize,
      active_workflows: company.activeWorkflows,
      plan: company.plan,
      business_hours: "Mon-Fri · 08:00-17:00",
      support_email: env.supportEmail
    })),
    { onConflict: "id" }
  );

  await supabase.from("profiles").upsert(
    flowPilotProfiles.map((profile) => ({
      id: profileIdMap.get(profile.id),
      company_id: companyIdMap.get(profile.companyId),
      full_name: profile.fullName,
      email: profile.email,
      role: profile.role,
      title: profile.title,
      avatar: profile.avatar,
      team: profile.team
    })),
    { onConflict: "id" }
  );

  await supabase.from("contacts").upsert(
    flowPilotContacts.map((contact) => ({
      id: contactIdMap.get(contact.id),
      company_id: companyIdMap.get(contact.companyId),
      name: contact.name,
      company_name: contact.company,
      email: contact.email,
      phone: contact.phone,
      status: contact.status,
      source: contact.source,
      assigned_user: contact.assignedUser,
      tags: contact.tags,
      last_touch_at: contact.lastTouchAt
    })),
    { onConflict: "id" }
  );

  await supabase.from("automations").upsert(
    flowPilotAutomations.map((automation) => ({
      id: automationIdMap.get(automation.id),
      company_id: companyIdMap.get(automation.companyId),
      owner_profile_id: ownerProfileLookup.get(automation.owner) ?? fallbackProfileId,
      owner_name: automation.owner,
      name: automation.name,
      description: automation.description,
      status: automation.status,
      trigger_type: automation.triggerType,
      trigger_label: automation.triggerLabel,
      trigger_description: automation.triggerDescription,
      vertical: automation.vertical,
      last_edited_by_name: automation.lastEditedBy,
      last_edited_at: automation.lastEditedAt
    })),
    { onConflict: "id" }
  );

  await supabase.from("automation_conditions").upsert(
    flowPilotAutomations.flatMap((automation) =>
      automation.conditions.map((condition, index) => ({
        id: stableUuid(`condition:${condition.id}`),
        automation_id: automationIdMap.get(automation.id),
        label: condition.label,
        field_name: condition.field,
        operator: condition.operator,
        value_text: condition.value,
        position: index
      }))
    ),
    { onConflict: "id" }
  );

  await supabase.from("automation_actions").upsert(
    flowPilotAutomations.flatMap((automation) =>
      automation.actions.map((action, index) => ({
        id: stableUuid(`action:${action.id}`),
        automation_id: automationIdMap.get(automation.id),
        action_type: action.type,
        label: action.label,
        description: action.description,
        channel: action.channel ?? null,
        delay_hours: action.delayHours ?? null,
        position: index
      }))
    ),
    { onConflict: "id" }
  );

  await supabase.from("automation_runs").upsert(
    flowPilotRuns.map((run) => ({
      id: stableUuid(`run:${run.id}`),
      automation_id: automationIdMap.get(run.automationId),
      company_id: companyIdMap.get(run.companyId),
      triggered_by_contact_id:
        contactIdMap.get(
          flowPilotContacts.find((contact) => contact.name === run.triggeredBy)?.id ?? ""
        ) ?? null,
      triggered_by_name: run.triggeredBy,
      source_event: run.sourceEvent,
      started_at: run.startedAt,
      duration_ms: run.durationMs,
      result: run.result,
      error_reason: run.errorReason ?? null,
      trigger_snapshot: run.triggerFields,
      condition_results: run.conditionResults,
      action_timeline: run.actionTimeline
    })),
    { onConflict: "id" }
  );

  await supabase.from("tasks").upsert(
    flowPilotTasks.map((task) => ({
      id: stableUuid(`task:${task.id}`),
      company_id: companyIdMap.get(task.companyId),
      automation_id: task.automationId ? automationIdMap.get(task.automationId) : null,
      contact_id:
        contactIdMap.get(
          flowPilotContacts.find((contact) => contact.name === task.contactName)?.id ?? ""
        ) ?? null,
      title: task.title,
      due_at: task.dueAt,
      assignee_name: task.assignee,
      priority: task.priority,
      status: task.status
    })),
    { onConflict: "id" }
  );

  await supabase.from("notifications").upsert(
    flowPilotNotifications.map((notification) => ({
      id: stableUuid(`notification:${notification.id}`),
      company_id: companyIdMap.get(notification.companyId),
      automation_id: notification.automationId
        ? automationIdMap.get(notification.automationId)
        : null,
      profile_id: fallbackProfileId,
      title: notification.title,
      detail: notification.detail,
      channel: notification.channel,
      status: notification.status,
      recipient: notification.recipient,
      unread: notification.unread,
      created_at: notification.createdAt
    })),
    { onConflict: "id" }
  );

  await supabase.from("templates").upsert(
    flowPilotTemplates.map((template) => ({
      id: stableUuid(`template:${template.id}`),
      company_id: null,
      is_global: true,
      name: template.name,
      category: template.category,
      description: template.description,
      trigger_type: template.triggerType,
      trigger_label: template.triggerLabel,
      estimated_lift: template.estimatedLift,
      steps_summary: template.stepsSummary,
      conditions: template.conditions,
      actions: template.actions
    })),
    { onConflict: "id" }
  );

  await supabase.from("activity_logs").upsert(
    flowPilotActivity.map((log) => ({
      id: stableUuid(`activity:${log.id}`),
      company_id: companyIdMap.get(log.companyId),
      automation_id: null,
      title: log.title,
      detail: log.detail,
      severity: log.severity,
      created_at: log.createdAt
    })),
    { onConflict: "id" }
  );

  await supabase.from("integrations").upsert(
    flowPilotIntegrations.map((integration) => ({
      id: stableUuid(`integration:${integration.id}`),
      company_id: null,
      name: integration.name,
      category: integration.category,
      description: integration.description,
      status: integration.status,
      last_sync_at: integration.lastSync ?? null
    })),
    { onConflict: "id" }
  );

  await supabase.from("social_posts").upsert(
    flowPilotSocialPosts.map((post) => ({
      id: stableUuid(`social-post:${post.id}`),
      company_id: companyIdMap.get(post.companyId),
      automation_id: post.automationId ? automationIdMap.get(post.automationId) : null,
      title: post.title,
      caption: post.caption,
      campaign: post.campaign,
      channels: post.channels,
      status: post.status,
      owner_name: post.owner,
      asset_type: post.assetType,
      scheduled_for: post.scheduledFor,
      published_at: post.publishedAt ?? null
    })),
    { onConflict: "id" }
  );

  await supabase.from("branding_settings").upsert(
    flowPilotCompanies.map((company, index) => ({
      id: stableUuid(`branding:${company.id}`),
      company_id: companyIdMap.get(company.id),
      portal_name: env.portalName,
      company_name: index === 0 ? env.companyName : company.name,
      logo_placeholder: env.logoPlaceholder,
      accent_hsl: env.accentHsl,
      support_email: env.supportEmail,
      is_active: index === 0
    })),
    { onConflict: "id" }
  );

  console.log("FlowPilot demo seed completed successfully.");
  console.log(`Companies: ${flowPilotCompanies.length}`);
  console.log(`Profiles: ${flowPilotProfiles.length}`);
  console.log(`Contacts: ${flowPilotContacts.length}`);
  console.log(`Automations: ${flowPilotAutomations.length}`);
  console.log(`Runs: ${flowPilotRuns.length}`);
  console.log(`Tasks: ${flowPilotTasks.length}`);
  console.log(`Notifications: ${flowPilotNotifications.length}`);
  console.log(`Social posts: ${flowPilotSocialPosts.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
