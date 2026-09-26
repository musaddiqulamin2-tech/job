import { requireAdmin } from "../../../../lib/adminGuard";
import { getSnapshot } from "../../../../lib/liveServer";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const limit = Math.max(1, Math.min(200, Number(new URL(request.url).searchParams.get("limit")) || 100));
  return Response.json({
    success: true,
    activity: (getSnapshot().activity || []).slice(0, limit),
  });
}