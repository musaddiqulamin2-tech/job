import { requireAdmin } from "../../../../lib/adminGuard";
import { listSystemErrors } from "../../../../lib/systemLog";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const limit = Math.max(1, Math.min(100, Number(new URL(request.url).searchParams.get("limit")) || 50));
  const errors = await listSystemErrors({ limit });

  return Response.json({ success: true, errors });
}