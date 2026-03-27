"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { flowPilotDemoCredentials } from "@/lib/flowpilot-data";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: flowPilotDemoCredentials.manager
  });

  async function submit(values: FormValues) {
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...values,
        redirectTo: searchParams.get("redirectTo")
      })
    });

    const payload = (await response.json()) as { error?: string; redirectTo?: string };
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Unable to sign in.");
      return;
    }

    toast.success("Signed in successfully.");
    router.push(payload.redirectTo ?? "/workspace");
    router.refresh();
  }

  async function loginAs(role: "admin" | "manager" | "staff_viewer") {
    setLoading(true);
    const response = await fetch("/api/auth/demo-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role })
    });
    const payload = (await response.json()) as { redirectTo?: string; error?: string };
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Unable to launch demo session.");
      return;
    }

    toast.success(`Demo ${role.replace("_", " ")} session ready.`);
    router.push(payload.redirectTo ?? "/workspace");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="space-y-3">
        <span className="eyebrow w-fit">Access the workspace</span>
        <CardTitle className="font-display text-3xl">Welcome back</CardTitle>
        <p className="text-sm text-muted-foreground">
          Sign in with demo credentials or a Supabase-backed account to explore the FlowPilot automation workspace.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Button variant="outline" type="button" onClick={() => loginAs("admin")} disabled={loading}>
            Demo Admin
          </Button>
          <Button variant="outline" type="button" onClick={() => loginAs("manager")} disabled={loading}>
            Demo Manager
          </Button>
          <Button variant="outline" type="button" onClick={() => loginAs("staff_viewer")} disabled={loading}>
            Demo Staff
          </Button>
        </div>
        <div className="rounded-3xl border border-border/70 bg-background/60 p-4 text-sm">
          <p className="font-medium">Demo credentials</p>
          <p className="mt-2 text-muted-foreground">
            Admin: {flowPilotDemoCredentials.admin.email} / {flowPilotDemoCredentials.admin.password}
          </p>
          <p className="text-muted-foreground">
            Manager: {flowPilotDemoCredentials.manager.email} / {flowPilotDemoCredentials.manager.password}
          </p>
          <p className="text-muted-foreground">
            Staff: {flowPilotDemoCredentials.staff_viewer.email} / {flowPilotDemoCredentials.staff_viewer.password}
          </p>
        </div>
        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email ? (
              <p className="text-sm text-rose-500">{form.formState.errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-brand hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" {...form.register("password")} />
            {form.formState.errors.password ? (
              <p className="text-sm text-rose-500">{form.formState.errors.password.message}</p>
            ) : null}
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
