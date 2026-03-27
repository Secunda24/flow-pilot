"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email()
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: ""
    }
  });

  async function submit(values: FormValues) {
    setLoading(true);
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const payload = (await response.json()) as { error?: string; message?: string };
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Unable to send reset instructions.");
      return;
    }

    toast.success(payload.message ?? "Reset instructions sent.");
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="space-y-3">
        <span className="eyebrow w-fit">Account recovery</span>
        <CardTitle className="font-display text-3xl">Reset your password</CardTitle>
        <p className="text-sm text-muted-foreground">
          We’ll email reset instructions. In demo mode this shows an immediate success toast so the experience still feels complete.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email ? (
              <p className="text-sm text-rose-500">{form.formState.errors.email.message}</p>
            ) : null}
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Send reset link
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
