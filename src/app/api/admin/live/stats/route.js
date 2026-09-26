import { requireAdmin } from "../../../../lib/adminGuard";
import { computeStats, trackApiCall } from "../../../../lib/liveServer";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const start = Date.now();
  const stats = await computeStats();
  trackApiCall({ method: "GET", path: "/api/admin/live/stats", status: 200, ms: Date.now() - start });

  return Response.json({ success: true, stats });
}