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
import { Textarea } from "@/components/ui/textarea";
import type { Company, Profile } from "@/lib/types";

const schema = z.object({
  fullName: z.string().min(2),
  companyName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export function ProfileForm({
  profile,
  company
}: {
  profile: Profile;
  company: Company;
}) {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: profile.fullName,
      companyName: company.name,
      email: profile.email,
      phone: profile.phone,
      notes: "Notify me about request status changes and invoice reminders."
    }
  });

  async function submit(values: FormValues) {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);
    toast.success(`Profile updated for ${values.fullName}.`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile and account settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={form.handleSubmit(submit)}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...form.register("fullName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company name</Label>
              <Input id="companyName" {...form.register("companyName")} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...form.register("phone")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notification preferences</Label>
            <Textarea id="notes" {...form.register("notes")} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save updates
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

