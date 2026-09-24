import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "admin_session";
const SESSION_DAYS = 7;
const MAX_AGE_SECONDS = SESSION_DAYS * 24 * 60 * 60;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set in .env.local (at least 16 characters)");
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(admin) {
  return new SignJWT({
    email: admin.email,
    name: admin.name || "Admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(admin._id))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}

export async function setSessionCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: SESSION_COOKIE,
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub) return null;
    return {
      id: String(payload.sub),
      email: payload.email || "",
      name: payload.name || "Admin",
    };
  } catch {
    return null;
  }
}

export function unauthorized() {
  return Response.json(
    { success: false, message: "Unauthorized. Please log in again." },
    { status: 401 }
  );
}

export function forbidden() {
  return Response.json(
    { success: false, message: "You do not have permission to do that." },
    { status: 403 }
  );
}