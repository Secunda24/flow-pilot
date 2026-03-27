import { ArticleBrowser } from "@/components/shared/article-browser";
import { PageHeader } from "@/components/shared/page-header";
import { requireClientViewer } from "@/lib/auth";
import { knowledgeBaseArticles } from "@/lib/demo-data";

export default function KnowledgeBasePage() {
  requireClientViewer();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Knowledge base"
        title="Help articles and FAQs"
        description="Give clients a polished self-service layer with searchable articles, categorized answers, and guided next steps."
      />
      <ArticleBrowser articles={knowledgeBaseArticles} />
    </div>
  );
}
