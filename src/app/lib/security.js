import { cookies } from "next/headers";
import crypto from "crypto";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 6;

const attempts = new Map();

export function loginRateCheck(key) {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now > rec.resetAt) {
    return { ok: true, remaining: LOGIN_MAX_ATTEMPTS, retryAfterMs: 0 };
  }
  return {
    ok: rec.count < LOGIN_MAX_ATTEMPTS,
    remaining: Math.max(0, LOGIN_MAX_ATTEMPTS - rec.count),
    retryAfterMs: rec.resetAt - now,
  };
}

export function recordLoginFailure(key) {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now > rec.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  } else {
    rec.count += 1;
  }
  if (attempts.size > 5000) {
    const cutoff = now - LOGIN_WINDOW_MS;
    for (const [k, v] of attempts) {
      if (v.resetAt < cutoff) attempts.delete(k);
    }
  }
}

export function clearLoginFailures(key) {
  attempts.delete(key);
}

export function generateCsrfToken() {
  return crypto.randomBytes(24).toString("hex");
}

export async function setCsrfCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "csrf_token",
    value: token,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function csrfTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get("csrf_token")?.value || "";
}

export async function verifyCsrf(request) {
  const header = request.headers.get("x-csrf-token") || "";
  const cookie = await csrfTokenFromCookies();
  if (!cookie || !header) return false;
  return header === cookie;
}