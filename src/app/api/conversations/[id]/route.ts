import { NextResponse } from "next/server";
import { MessageRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requestHasSession } from "@/lib/auth";

export const runtime = "nodejs";
const LOCAL_USER_EMAIL = "local@custom-ai.local";
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  if (!(await requestHasSession(request))) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  try {
    const { id } = await params;
    const user = await prisma.user.upsert({ where: { email: LOCAL_USER_EMAIL }, update: {}, create: { email: LOCAL_USER_EMAIL, name: "Local User" } });
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId: user.id },
      select: { id: true, title: true, messages: { orderBy: { createdAt: "asc" }, take: 200, select: { id: true, role: true, content: true, createdAt: true } } },
    });
    if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    return NextResponse.json({ conversation: { ...conversation, messages: conversation.messages.map((message) => ({ ...message, role: message.role === MessageRole.ASSISTANT ? "assistant" : "user" })) } });
  } catch (error) {
    console.error("Conversation detail error:", error);
    return NextResponse.json({ error: "Unable to load this conversation." }, { status: 500 });
  }
}
