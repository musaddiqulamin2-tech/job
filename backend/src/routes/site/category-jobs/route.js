import { expressify } from "../../../compat.js";
import connectDB from "../../../lib/mongodb.js";
import Job from "../../../lib/models/Job.js";
import Result from "../../../lib/models/Result.js";
import Admission from "../../../lib/models/Admission.js";
import AdmitCard from "../../../lib/models/AdmitCard.js";
import { withTimeout, dbUnavailable } from "../../../lib/db.js";

const TYPE_MODELS = {
  job: Job,
  result: Result,
  admission: Admission,
  "admit-card": AdmitCard,
};

export async function GET(request) {
  const url = new URL(request.url);
  const type = String(url.searchParams.get("type") || "job").trim().toLowerCase();
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = Math.max(1, Math.min(100, Number(url.searchParams.get("limit")) || 12));
  const category = String(url.searchParams.get("category") || "").trim() || undefined;
  const query = url.searchParams.get("q")?.toString().trim();

  const model = TYPE_MODELS[type];
  if (!model) {
    return Response.json(
      { success: false, message: "Unknown category type." },
      { status: 400 }
    );
  }

  try {
    await withTimeout(connectDB());
    const filter = { active: true };
    if (category) {
      const fc = String(category).toLowerCase();
      filter.$or = [{ category: { $regex: fc, $options: "i" } }, { categorySlug: fc }];
    }
    if (query) {
      filter.title = { $regex: escapeRegExp(String(query)), $options: "i" };
    }
    const total = await model.countDocuments(filter);
    const posts = await model
      .find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return Response.json({
      success: true,
      posts: posts.map((p) => ({ ...p, _id: String(p._id) })),
      total: Number(total) || 0,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil((Number(total) || 0) / limit)),
    });
  } catch (error) {
    console.error("category-jobs error:", error.message);
    return dbUnavailable();
  }
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

import { Router } from "express";
const router = Router();
router.get("/", expressify(GET));
export default router;