"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { FlowPilotCompany, FlowPilotProfile } from "@/lib/flowpilot-data";

const schema = z.object({
  portalName: z.string().min(2),
  companyName: z.string().min(2),
  logoPlaceholder: z.string().min(1),
  accentHsl: z.string().min(3),
  supportEmail: z.string().email(),
  timezone: z.string().min(2),
  businessHours: z.string().min(3),
  notificationDefaults: z.string().min(3)
});

type SettingsValues = z.infer<typeof schema>;

export function SettingsPanel({
  branding,
  company,
  team
}: {
  branding: {
    portalName: string;
    companyName: string;
    logoPlaceholder: string;
    accentHsl: string;
    supportEmail?: string;
  };
  company: FlowPilotCompany;
  team: FlowPilotProfile[];
}) {
  const form = useForm<SettingsValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      portalName: branding.portalName,
      companyName: branding.companyName,
      logoPlaceholder: branding.logoPlaceholder,
      accentHsl: branding.accentHsl,
      supportEmail: branding.supportEmail ?? "support@flowpilotautomation.com",
      timezone: company.timezone,
      businessHours: "Mon-Fri · 08:00-17:00",
      notificationDefaults: "Email for confirmations, WhatsApp for reminders, in-app for internal alerts."
    }
  });

  function submit(values: SettingsValues) {
    toast.success(`${values.portalName} settings saved for the demo workspace.`);
  }

  return (
    <Tabs defaultValue="branding">
      <TabsList className="flex h-auto flex-wrap gap-2 rounded-[1.5rem] bg-transparent p-0">
        <TabsTrigger value="branding">Branding</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="api">Integrations</TabsTrigger>
      </TabsList>
      <form onSubmit={form.handleSubmit(submit)}>
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding settings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="portalName">App name</Label>
                <Input id="portalName" {...form.register("portalName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company name</Label>
                <Input id="companyName" {...form.register("companyName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoPlaceholder">Logo placeholder</Label>
                <Input id="logoPlaceholder" {...form.register("logoPlaceholder")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accentHsl">Accent color (HSL)</Label>
                <Input id="accentHsl" {...form.register("accentHsl")} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="supportEmail">Support email</Label>
                <Input id="supportEmail" {...form.register("supportEmail")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification defaults</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timezone">Time zone</Label>
                <Input id="timezone" {...form.register("timezone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessHours">Business hours</Label>
                <Input id="businessHours" {...form.register("businessHours")} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notificationDefaults">Default routing</Label>
                <Textarea
                  id="notificationDefaults"
                  rows={5}
                  {...form.register("notificationDefaults")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {team.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <CardTitle className="text-base">{member.fullName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">{member.title}</p>
                  <Badge variant="accent">{member.role}</Badge>
                  <p>{member.email}</p>
                  <p className="text-muted-foreground">{member.team}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Role permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-2xl border border-border/70 p-4">
                <p className="font-semibold">Admin</p>
                <p className="mt-2 text-muted-foreground">
                  Full access to branding, automation edits, integrations, team controls, and demo-company impersonation.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 p-4">
                <p className="font-semibold">Manager</p>
                <p className="mt-2 text-muted-foreground">
                  Can create and edit automations, review logs, manage tasks, and use templates without changing global branding settings.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 p-4">
                <p className="font-semibold">Staff Viewer</p>
                <p className="mt-2 text-muted-foreground">
                  Read-only access to dashboards, logs, notifications, tasks, and contacts for reporting and client support visibility.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API and integration placeholders</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Webhook endpoint</Label>
                <Input value="https://api.flowpilot-demo.com/hooks/incoming" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Gmail sender</Label>
                <Input value="automation@bluepeakgroup.com" readOnly />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp number</Label>
                <Input value="+27 86 000 0142" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Calendar integration</Label>
                <Input value="Pending approval" readOnly />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <div className="mt-6">
          <Button type="submit">Save settings</Button>
        </div>
      </form>
    </Tabs>
  );
}
