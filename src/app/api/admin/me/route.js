import { getSession, unauthorized } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  return Response.json({
    success: true,
    admin: {
      id: session.id,
      name: session.name,
      email: session.email,
    },
  });
}