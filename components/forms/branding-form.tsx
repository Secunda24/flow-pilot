"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BrandingSettings } from "@/lib/types";

const schema = z.object({
  portalName: z.string().min(2),
  companyName: z.string().min(2),
  logoPlaceholder: z.string().min(1).max(4),
  accentHsl: z.string().min(5)
});

type FormValues = z.infer<typeof schema>;

export function BrandingForm({ settings }: { settings: BrandingSettings }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: settings
  });

  async function submit(values: FormValues) {
    setLoading(true);
    const response = await fetch("/api/branding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const payload = (await response.json()) as { error?: string; message?: string };
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Unable to update branding.");
      return;
    }

    toast.success(payload.message ?? "Branding updated.");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={form.handleSubmit(submit)}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="portalName">Portal name</Label>
              <Input id="portalName" {...form.register("portalName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company name</Label>
              <Input id="companyName" {...form.register("companyName")} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="logoPlaceholder">Logo placeholder</Label>
              <Input id="logoPlaceholder" {...form.register("logoPlaceholder")} maxLength={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentHsl">Accent color (HSL)</Label>
              <Input id="accentHsl" {...form.register("accentHsl")} placeholder="175 72% 32%" />
            </div>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
            <p className="text-sm font-medium">Live theme note</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Values are stored in a cookie for demo mode so you can show white-label flexibility immediately.
            </p>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save branding
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
