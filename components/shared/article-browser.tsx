"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { KnowledgeBaseArticle } from "@/lib/types";

export function ArticleBrowser({
  articles
}: {
  articles: KnowledgeBaseArticle[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((article) => article.category)))],
    [articles]
  );

  const filtered = useMemo(
    () =>
      articles.filter((article) => {
        const matchesQuery = `${article.title} ${article.excerpt}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesCategory = category === "All" ? true : article.category === category;
        return article.published && matchesQuery && matchesCategory;
      }),
    [articles, category, query]
  );

  return (
    <div className="space-y-5">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search help articles..."
        className="max-w-md"
      />
      <div className="flex flex-wrap gap-3">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              category === item ? "bg-brand text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((article) => (
          <Card key={article.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Badge variant="accent">{article.category}</Badge>
                <span className="text-xs text-muted-foreground">
                  Updated {formatDate(article.updatedAt)}
                </span>
              </div>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-7 text-muted-foreground">{article.excerpt}</p>
              <div className="rounded-3xl border border-border/70 bg-background/60 p-4 text-sm leading-7 text-muted-foreground">
                {article.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
