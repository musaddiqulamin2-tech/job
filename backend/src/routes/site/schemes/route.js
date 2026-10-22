import { expressify } from "../../../compat.js";
import connectDB from "../../../lib/mongodb.js";
import { listPublishedSchemes, publicScheme } from "../../../lib/schemes.js";
import { withTimeout, dbUnavailable } from "../../../lib/db.js";

export async function GET(request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 12;
  const category = url.searchParams.get("category")?.toString() || "";
  const search = url.searchParams.get("q")?.toString() || "";
  const featured = url.searchParams.get("featured") === "true";

  try {
    await withTimeout(connectDB());
    const data = await listPublishedSchemes({ category, page, limit, search, featured });
    const now = new Date();
    return Response.json({
      success: true,
      schemes: data.schemes.map((s) => publicScheme(s, now)),
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
    });
  } catch (error) {
    console.error("schemes listing error:", error.message);
    return dbUnavailable();
  }
}

import { Router } from "express";
const router = Router();
router.get("/", expressify(GET));
export default router;
