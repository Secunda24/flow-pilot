import { NextResponse } from "next/server";

import { documents } from "@/lib/demo-data";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const document = documents.find((item) => item.id === params.id);

  if (!document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const content = [
    `Document: ${document.name}`,
    `Category: ${document.category}`,
    `Uploaded By: ${document.uploadedBy}`,
    `Uploaded At: ${document.uploadedAt}`,
    "",
    document.summary
  ].join("\n");

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${document.name.replace(/\s+/g, "-")}"`
    }
  });
}
