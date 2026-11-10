import { jwtVerify } from "jose";

export const SESSION_COOKIE = "custom_ai_session";
const ISSUER = "custom-ai";
const AUDIENCE = "custom-ai-app";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function isValidSession(token: string | undefined) {
  const secret = getSecret();
  if (!secret || !token) return false;

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return payload.sub === "local-user";
  } catch {
    return false;
  }
}

export async function requestHasSession(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const prefix = `${SESSION_COOKIE}=`;
  const entry = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return isValidSession(entry ? decodeURIComponent(entry.slice(prefix.length)) : undefined);
}

export const SESSION_ISSUER = ISSUER;
export const SESSION_AUDIENCE = AUDIENCE;
