import { timingSafeEqual } from "node:crypto";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { SESSION_AUDIENCE, SESSION_COOKIE, SESSION_ISSUER } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const password = process.env.APP_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!password || !secret || secret.length < 32) {
    return NextResponse.json(
      { error: "Set APP_PASSWORD and an AUTH_SECRET of at least 32 characters in the deployment environment." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const submitted = body && typeof body === "object" && "password" in body && typeof body.password === "string"
    ? body.password
    : "";
  const expectedBuffer = Buffer.from(password);
  const submittedBuffer = Buffer.from(submitted);
  const passwordMatches = expectedBuffer.length === submittedBuffer.length && timingSafeEqual(expectedBuffer, submittedBuffer);

  if (!passwordMatches) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await new SignJWT({ name: "Local User" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("local-user")
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(secret));

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
