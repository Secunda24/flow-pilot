"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Sparkles, Trash2, Wand2 } from "lucide-react";
import { useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  FlowPilotAutomationSummary,
  FlowPilotRole,
  FlowPilotTemplate
} from "@/lib/flowpilot-data";
import {
  canManageAutomations,
  flowPilotBuilderCatalog
} from "@/lib/flowpilot-data";

const schema = z.object({
  name: z.string().min(3, "Add a workflow name."),
  description: z.string().min(12, "Add a short workflow description."),
  triggerType: z.string().min(1, "Choose a trigger."),
  status: z.enum(["Active", "Paused", "Draft"]),
  conditions: z
    .array(
      z.object({
        field: z.string().min(1),
        operator: z.string().min(1),
        value: z.string().min(1)
      })
    )
    .min(1, "Add at least one condition."),
  actions: z
    .array(
      z.object({
        type: z.string().min(1),
        label: z.string().min(1),
        description: z.string().min(1),
        delayHours: z.string().optional()
      })
    )
    .min(1, "Add at least one action.")
});

type BuilderValues = z.infer<typeof schema>;

function createDefaults(
  source?: FlowPilotTemplate | FlowPilotAutomationSummary | null
): BuilderValues {
  const status = source && "status" in source ? source.status : "Active";

  return {
    name: source?.name ?? "",
    description: source?.description ?? "",
    triggerType: source?.triggerLabel ?? flowPilotBuilderCatalog.triggers[0],
    status,
    conditions:
      source?.conditions.map((condition) => ({
        field: condition.field,
        operator: condition.operator,
        value: condition.value
      })) ?? [
        {
          field: "Lead source",
          operator: "=",
          value: "Facebook"
        }
      ],
    actions:
      source?.actions.map((action) => ({
        type: action.type,
        label: action.label,
        description: action.description,
        delayHours: action.delayHours ? String(action.delayHours) : ""
      })) ?? [
        {
          type: "email",
          label: "Send email",
          description: "Send an immediate confirmation email.",
          delayHours: ""
        }
      ]
  };
}

export function AutomationBuilder({
  viewerRole,
  template,
  automation
}: {
  viewerRole: FlowPilotRole;
  template?: FlowPilotTemplate | null;
  automation?: FlowPilotAutomationSummary | null;
}) {
  const editable = canManageAutomations(viewerRole);
  const source = template ?? automation ?? null;
  const form = useForm<BuilderValues>({
    resolver: zodResolver(schema),
    defaultValues: createDefaults(source)
  });
  const conditions = useFieldArray({
    control: form.control,
    name: "conditions"
  });
  const actions = useFieldArray({
    control: form.control,
    name: "actions"
  });

  const preview = useMemo(() => form.watch(), [form]);

  function addDelayStep() {
    actions.append({
      type: "delay",
      label: "Wait step",
      description: "Pause this workflow before the next action executes.",
      delayHours: "24"
    });
  }

  function submit(values: BuilderValues) {
    if (!editable) {
      return;
    }

    toast.success(
      `${values.name} saved as a ${values.status.toLowerCase()} workflow for the demo.`
    );
  }

  return (
    <form className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]" onSubmit={form.handleSubmit(submit)}>
      <div className="space-y-6">
        {!editable ? (
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Staff viewers can inspect workflows but cannot edit or save changes.
            </CardContent>
          </Card>
        ) : null}
        <Card>
          <CardHeader>
            <CardTitle>Workflow details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="name">Automation name</Label>
              <Input id="name" disabled={!editable} {...form.register("name")} />
              {form.formState.errors.name ? (
                <p className="text-sm text-rose-500">{form.formState.errors.name.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                disabled={!editable}
                {...form.register("description")}
              />
              {form.formState.errors.description ? (
                <p className="text-sm text-rose-500">
                  {form.formState.errors.description.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Trigger type</Label>
                <Controller
                  control={form.control}
                  name="triggerType"
                  render={({ field }) => (
                    <Select
                      disabled={!editable}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        {flowPilotBuilderCatalog.triggers.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      disabled={!editable}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Active", "Paused", "Draft"].map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Conditions</CardTitle>
            {editable ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  conditions.append({
                    field: "Status",
                    operator: "=",
                    value: "Pending"
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add condition
              </Button>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-4">
            {conditions.fields.map((field, index) => (
              <div key={field.id} className="rounded-2xl border border-border/70 p-4">
                <div className="grid gap-4 md:grid-cols-[1fr_120px_1fr_auto]">
                  <Input
                    disabled={!editable}
                    placeholder="Field"
                    {...form.register(`conditions.${index}.field`)}
                  />
                  <Input
                    disabled={!editable}
                    placeholder="Operator"
                    {...form.register(`conditions.${index}.operator`)}
                  />
                  <Input
                    disabled={!editable}
                    placeholder="Value"
                    {...form.register(`conditions.${index}.value`)}
                  />
                  {editable ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => conditions.remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Actions and delays</CardTitle>
            {editable ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    actions.append({
                      type: "email",
                      label: "Send email",
                      description: "Send a message to the recipient.",
                      delayHours: ""
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add action
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={addDelayStep}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Add delay
                </Button>
              </div>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-4">
            {actions.fields.map((field, index) => (
              <div key={field.id} className="rounded-2xl border border-border/70 p-4">
                <div className="grid gap-4 md:grid-cols-[130px_1fr_1fr_110px_auto]">
                  <Input
                    disabled={!editable}
                    placeholder="Type"
                    {...form.register(`actions.${index}.type`)}
                  />
                  <Input
                    disabled={!editable}
                    placeholder="Label"
                    {...form.register(`actions.${index}.label`)}
                  />
                  <Input
                    disabled={!editable}
                    placeholder="Description"
                    {...form.register(`actions.${index}.description`)}
                  />
                  <Input
                    disabled={!editable}
                    placeholder="Delay h"
                    {...form.register(`actions.${index}.delayHours`)}
                  />
                  {editable ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => actions.remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Builder catalog</CardTitle>
            <Badge variant="accent">Demo-ready</Badge>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-3">
              <p className="text-sm font-semibold">Triggers</p>
              <div className="flex flex-wrap gap-2">
                {flowPilotBuilderCatalog.triggers.map((item) => (
                  <Badge key={item} variant="neutral">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold">Conditions</p>
              <div className="flex flex-wrap gap-2">
                {flowPilotBuilderCatalog.conditions.map((item) => (
                  <Badge key={item} variant="neutral">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold">Actions</p>
              <div className="flex flex-wrap gap-2">
                {flowPilotBuilderCatalog.actions.map((item) => (
                  <Badge key={item} variant="neutral">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand-soft p-3 text-brand">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Live preview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  See how the workflow reads as a premium stacked-step automation.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[1.75rem] border border-brand/15 bg-brand-soft/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Trigger
              </p>
              <p className="mt-2 text-lg font-semibold">
                {preview.triggerType || "Choose a trigger"}
              </p>
            </div>
            {preview.conditions.map((condition, index) => (
              <div key={`preview-condition-${index}`} className="rounded-2xl border border-border/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Condition {index + 1}
                </p>
                <p className="mt-2 text-sm">
                  {condition.field || "Field"} {condition.operator || "="} {condition.value || "Value"}
                </p>
              </div>
            ))}
            {preview.actions.map((action, index) => (
              <div key={`preview-action-${index}`} className="rounded-2xl border border-border/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{action.label || "Action"}</p>
                  <Badge variant={action.type === "delay" ? "warning" : "accent"}>
                    {action.type || "step"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{action.description}</p>
                {action.delayHours ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Delay window: {action.delayHours} hour(s)
                  </p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Save workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This demo saves locally for presentation purposes. The schema and seed script are ready
              for a real Supabase-backed implementation next.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={!editable}>
                Save automation
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.success("Test run started against demo data.")}
              >
                Run preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
