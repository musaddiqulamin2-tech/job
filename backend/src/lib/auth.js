import { SignJWT, jwtVerify } from "jose";
import { getAuthRequest } from "../compat.js";

export const SESSION_COOKIE = "admin_session";
const SESSION_DAYS = 7;
const MAX_AGE_SECONDS = SESSION_DAYS * 24 * 60 * 60;
const AUTH_HEADER = "authorization";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set (one .env file) — at least 16 characters");
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

// Cross-origin Bearer auth: cookies are not used by the frontend.
export async function setSessionCookie() {
  return null;
}

export async function clearSessionCookie() {
  return null;
}

export async function getSession() {
  const request = getAuthRequest();
  if (!request) return null;

  const header = request.headers.get(AUTH_HEADER) || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
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