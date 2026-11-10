import { NextResponse } from "next/server";
import { MessageRole } from "@prisma/client";
import { getOpenAIClient } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 4000;
const LOCAL_USER_EMAIL = "local@custom-ai.local";

export async function POST(request: Request) {
  // This starter has no authentication. Refuse production requests rather
  // than exposing an unauthenticated personal assistant API to the internet.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Authentication must be configured before production use." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { message, conversationId } = body as {
    message?: unknown;
    conversationId?: unknown;
  };

  if (
    typeof message !== "string" ||
    !message.trim() ||
    message.trim().length > MAX_MESSAGE_LENGTH
  ) {
    return NextResponse.json(
      { error: `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 },
    );
  }

  if (conversationId !== undefined && typeof conversationId !== "string") {
    return NextResponse.json({ error: "Invalid conversation ID." }, { status: 400 });
  }

  try {
    const user = await prisma.user.upsert({
      where: { email: LOCAL_USER_EMAIL },
      update: {},
      create: { email: LOCAL_USER_EMAIL, name: "Local User" },
    });

    const conversation = conversationId
      ? await prisma.conversation.findFirst({
          where: { id: conversationId, userId: user.id },
        })
      : await prisma.conversation.create({
          data: {
            title: message.trim().slice(0, 60),
            userId: user.id,
          },
        });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: MessageRole.USER,
        content: message.trim(),
      },
    });

    const history = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const response = await getOpenAIClient().responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      instructions: `You are ${process.env.ASSISTANT_NAME || "Custom AI"}, a friendly, capable personal assistant. Give practical and accurate answers. Do not claim to have performed actions you did not perform, and do not imply you can access the user's computer or applications unless an authorized tool actually provides that access. Ask before consequential actions.`,
      input: history.map((item) => ({
        role: item.role === MessageRole.ASSISTANT ? "assistant" as const : "user" as const,
        content: item.content,
      })),
    });

    const answer = response.output_text?.trim();
    if (!answer) {
      return NextResponse.json(
        { error: "The AI returned an empty response. Please try again." },
        { status: 502 },
      );
    }

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: MessageRole.ASSISTANT,
        content: answer,
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ answer, conversationId: conversation.id });
  } catch (error) {
    console.error("Assistant API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const isConfigurationError = message.includes("OPENAI_API_KEY");

    return NextResponse.json(
      {
        error: isConfigurationError
          ? "The AI service is not configured. Add OPENAI_API_KEY to your local .env file."
          : "Unable to process your request. Check that PostgreSQL is running and your environment is configured.",
      },
      { status: isConfigurationError ? 503 : 500 },
    );
  }
}
