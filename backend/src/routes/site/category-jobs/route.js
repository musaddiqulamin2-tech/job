import { expressify } from "../../../compat.js";
import connectDB from "../../../lib/mongodb.js";
import Job from "../../../lib/models/Job.js";
import Result from "../../../lib/models/Result.js";
import Admission from "../../../lib/models/Admission.js";
import AdmitCard from "../../../lib/models/AdmitCard.js";
import { listPublishedPosts } from "../../../lib/cms.js";
import { withTimeout, dbUnavailable } from "../../../lib/db.js";

const TYPE_MODELS = {
  job: Job,
  result: Result,
  admission: Admission,
  "admit-card": AdmitCard,
};

// The posts an admin authors from the panel live in the Post collection, while
// these listings are backed by the legacy Job/Result/Admission/AdmitCard
// collections that only ever hold submitted rows. Merge both so a published
// post actually reaches the section it belongs to.
const CMS_CATEGORIES_BY_TYPE = {
  job: ["government-job", "private-job"],
  result: ["result"],
  admission: ["admission"],
  "admit-card": ["admit-card"],
};

function timeValue(item) {
  const t = new Date(item?.publishedAt || item?.createdAt || 0).getTime();
  return Number.isNaN(t) ? 0 : t;
}

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
    const cmsCategories = CMS_CATEGORIES_BY_TYPE[type] || [];
    let cmsPosts = [];
    let cmsTotal = 0;

    if (cmsCategories.length) {
      try {
        let wanted = cmsCategories;
        if (category) {
          const fc = String(category).toLowerCase();
          wanted = cmsCategories.filter((c) => c.includes(fc) || fc.includes(c));
        }
        const seen = new Set();
        for (const cat of wanted) {
          const result = await listPublishedPosts({ category: cat, page: 1, limit: 100, search: query || "" });
          cmsTotal += result.total;
          for (const p of result.posts || []) {
            if (seen.has(p.slug)) continue;
            seen.add(p.slug);
            cmsPosts.push({ ...p, _id: String(p._id), _source: "cms" });
          }
        }
        cmsPosts.sort((a, b) => timeValue(b) - timeValue(a));
      } catch (cmsErr) {
        console.error("category-jobs cms error:", cmsErr.message);
        cmsPosts = [];
        cmsTotal = 0;
      }
    }

    // CMS posts are listed first and are already newest-first, so the job rows
    // only need to cover whatever the current page still has room for.
    const start = (page - 1) * limit;
    const cmsSlice = cmsPosts.slice(start, start + limit);
    let legacyRows = [];
    const needed = limit - cmsSlice.length;
    if (needed > 0) {
      legacyRows = await model
        .find(filter)
        .sort({ featured: -1, createdAt: -1 })
        .skip(Math.max(0, start - cmsTotal))
        .limit(needed)
        .lean();
    }

    const posts = [
      ...cmsSlice,
      ...legacyRows.map((p) => ({ ...p, _id: String(p._id), _source: "legacy" })),
    ];
    const mergedTotal = (Number(total) || 0) + cmsTotal;

    return Response.json({
      success: true,
      posts,
      total: Number(mergedTotal) || 0,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil((Number(mergedTotal) || 0) / limit)),
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