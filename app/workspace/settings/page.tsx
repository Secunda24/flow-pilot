import { SettingsPanel } from "@/components/flowpilot/settings-panel";
import { PageHeader } from "@/components/shared/page-header";
import { getBrandingSettings } from "@/lib/branding";
import { requireFlowPilotAdmin } from "@/lib/flowpilot-auth";
import { flowPilotProfiles } from "@/lib/flowpilot-data";

export default function SettingsPage() {
  const viewer = requireFlowPilotAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace settings"
        title="Settings"
        description="Control branding, notifications, team roles, workflow defaults, time zone rules, and integration placeholders from one admin view."
      />
      <SettingsPanel
        branding={getBrandingSettings()}
        company={viewer.activeCompany}
        team={flowPilotProfiles}
      />
    </div>
  );
}
