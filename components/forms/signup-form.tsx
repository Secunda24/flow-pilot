"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z
  .object({
    fullName: z.string().min(2),
    companyName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match."
  });

type FormValues = z.infer<typeof schema>;

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  async function submit(values: FormValues) {
    setLoading(true);
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const payload = (await response.json()) as { error?: string; redirectTo?: string };
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Unable to create your FlowPilot workspace access.");
      return;
    }

    toast.success("Workspace access created.");
    router.push(payload.redirectTo ?? "/workspace");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="space-y-3">
        <span className="eyebrow w-fit">Launch quickly</span>
        <CardTitle className="font-display text-3xl">Create your workspace access</CardTitle>
        <p className="text-sm text-muted-foreground">
          Start with a polished demo workspace today, then connect Supabase later for production auth and persistence.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={form.handleSubmit(submit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...form.register("fullName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company</Label>
              <Input id="companyName" {...form.register("companyName")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" {...form.register("email")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register("password")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
            </div>
          </div>
          {Object.values(form.formState.errors).length ? (
            <p className="text-sm text-rose-500">
              {Object.values(form.formState.errors)[0]?.message?.toString()}
            </p>
          ) : null}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have access?{" "}
            <Link href="/login" className="text-brand hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
