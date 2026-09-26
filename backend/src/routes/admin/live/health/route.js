import { expressify } from "../../../../compat.js";
import { requireAdmin } from "../../../../lib/adminGuard.js";
import { computeHealth, trackApiCall } from "../../../../lib/liveServer.js";


export async function GET(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const start = Date.now();
  const health = await computeHealth();
  trackApiCall({ method: "GET", path: "/api/admin/live/health", status: 200, ms: Date.now() - start });

  return Response.json({ success: true, health });
}
import { Router } from "express";
const router = Router();
router.get("/", expressify(GET));
export default router;
