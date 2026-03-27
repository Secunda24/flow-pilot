import { PencilLine } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminViewer } from "@/lib/auth";
import { knowledgeBaseArticles } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

export default function AdminKnowledgeBasePage() {
  requireAdminViewer();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Knowledge base"
        title="Knowledge base management"
        description="Create, categorize, and publish help content that reduces support load while keeping the portal feeling thoughtful and premium."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        {knowledgeBaseArticles.map((article) => (
          <Card key={article.id}>
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Badge variant={article.published ? "success" : "warning"}>
                  {article.published ? "Published" : "Draft"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Updated {formatDate(article.updatedAt)}
                </span>
              </div>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.18em] text-brand">{article.category}</span>
                <Button variant="outline" size="sm">
                  <PencilLine className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

