import { expressify } from "../../../../compat.js";
import { requireAdmin } from "../../../../lib/adminGuard.js";
import { listSystemErrors } from "../../../../lib/systemLog.js";


export async function GET(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const limit = Math.max(1, Math.min(100, Number(new URL(request.url).searchParams.get("limit")) || 50));
  const errors = await listSystemErrors({ limit });

  return Response.json({ success: true, errors });
}
import { Router } from "express";
const router = Router();
router.get("/", expressify(GET));
export default router;
