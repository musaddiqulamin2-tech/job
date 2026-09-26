import { getSession, unauthorized } from "./auth.js";

export async function requireAdmin() {
  const session = await getSession();
  if (!session) return { session: null, error: unauthorized() };
  return { session, error: null };
}