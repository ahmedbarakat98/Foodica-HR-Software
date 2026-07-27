import crypto from "node:crypto";
import { cookies } from "next/headers";
import type { SafeSessionUser } from "@/types/user";

const COOKIE_NAME = "foodica_hr_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Missing SESSION_SECRET.");
  return secret;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSessionToken(user: SafeSessionUser): string {
  const payload = Buffer.from(JSON.stringify({ user, exp: Date.now() + MAX_AGE_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string): SafeSessionUser | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || sign(payload) !== signature) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!parsed?.exp || parsed.exp < Date.now()) return null;
    return parsed.user as SafeSessionUser;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SafeSessionUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function setSessionCookie(user: SafeSessionUser) {
  (await cookies()).set(COOKIE_NAME, createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(COOKIE_NAME);
}
