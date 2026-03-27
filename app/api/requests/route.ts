import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  subject: z.string().min(4),
  category: z.string().min(2),
  description: z.string().min(10),
  priority: z.string().min(2),
  attachmentName: z.string().optional()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete the request form." }, { status: 400 });
  }

  return NextResponse.json({
    message: "Request submitted. In demo mode this shows the success path; wire the route to Supabase inserts for production persistence.",
    requestId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`
  });
}

