"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

const categories = [
  "onboarding",
  "support",
  "billing",
  "maintenance",
  "custom development",
  "compliance"
] as const;

const priorities = ["Low", "Medium", "High", "Critical"] as const;

const schema = z.object({
  subject: z.string().min(4),
  category: z.enum(categories),
  description: z.string().min(10),
  priority: z.enum(priorities),
  attachmentName: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export function RequestForm() {
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: "",
      category: "support",
      description: "",
      priority: "Medium",
      attachmentName: ""
    }
  });

  async function submit(values: FormValues) {
    setLoading(true);
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const payload = (await response.json()) as { error?: string; message?: string; requestId?: string };
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Unable to submit your request.");
      return;
    }

    toast.success(payload.message ?? "Request submitted.");
    form.reset();
    setSelectedFileName("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new request</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={form.handleSubmit(submit)}>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" {...form.register("subject")} placeholder="Describe what you need help with" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                defaultValue={form.getValues("category")}
                onValueChange={(value) => form.setValue("category", value as FormValues["category"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Share the context, urgency, and any approval or deadline requirements."
            />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                defaultValue={form.getValues("priority")}
                onValueChange={(value) => form.setValue("priority", value as FormValues["priority"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="attachment">Attachment upload</Label>
              <label
                htmlFor="attachment"
                className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-background/60 text-center"
              >
                <UploadCloud className="h-5 w-5 text-brand" />
                <span className="mt-3 text-sm font-medium">
                  {selectedFileName || "Choose a file to attach"}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  Supabase Storage upload ready
                </span>
              </label>
              <input
                id="attachment"
                type="file"
                className="hidden"
                onChange={(event) => {
                  const fileName = event.target.files?.[0]?.name ?? "";
                  setSelectedFileName(fileName);
                  form.setValue("attachmentName", fileName);
                }}
              />
            </div>
          </div>
          {Object.values(form.formState.errors).length ? (
            <p className="text-sm text-rose-500">
              {Object.values(form.formState.errors)[0]?.message?.toString()}
            </p>
          ) : null}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

