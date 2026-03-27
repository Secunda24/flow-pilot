"use client";

import { Download, Eye, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import type { DocumentItem } from "@/lib/types";

export function DocumentBrowser({
  documents,
  allowUpload = false
}: {
  documents: DocumentItem[];
  allowUpload?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(documents.map((document) => document.category)))],
    [documents]
  );

  const filtered = useMemo(
    () =>
      documents.filter((document) => {
        const matchesQuery = `${document.name} ${document.category}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesCategory = category === "all" ? true : document.category === category;
        return matchesQuery && matchesCategory;
      }),
    [category, documents, query]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search documents..."
          className="max-w-sm"
        />
        <div className="flex items-center gap-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item === "all" ? "All categories" : item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {allowUpload ? (
            <Button variant="outline" onClick={() => toast.success("Upload flow ready for Supabase Storage.")}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload
            </Button>
          ) : null}
        </div>
      </div>
      <div className="grid gap-4">
        {filtered.map((document) => (
          <Card key={document.id}>
            <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <p className="font-semibold">{document.name}</p>
                <p className="text-sm text-muted-foreground">
                  {document.category} · {document.size} · Uploaded {formatDate(document.uploadedAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{document.name}</DialogTitle>
                      <DialogDescription>
                        {document.category} · Uploaded by {document.uploadedBy}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-3xl border border-border/70 bg-background/70 p-5">
                      <p className="text-sm leading-7 text-muted-foreground">{document.summary}</p>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" asChild>
                  <a href={`/api/documents/${document.id}/download`}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

