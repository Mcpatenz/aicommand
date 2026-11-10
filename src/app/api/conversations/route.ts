import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requestHasSession } from "@/lib/auth";

export const runtime = "nodejs";
const LOCAL_USER_EMAIL = "local@custom-ai.local";

export async function GET(request: Request) {
  if (!(await requestHasSession(request))) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  try {
    const user = await prisma.user.upsert({ where: { email: LOCAL_USER_EMAIL }, update: {}, create: { email: LOCAL_USER_EMAIL, name: "Local User" } });
    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id }, orderBy: { updatedAt: "desc" }, take: 100,
      select: { id: true, title: true, updatedAt: true, _count: { select: { messages: true } } },
    });
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Conversation history error:", error);
    return NextResponse.json({ error: "Unable to load conversation history." }, { status: 500 });
  }
}
