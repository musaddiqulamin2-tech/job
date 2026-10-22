import { expressify } from "../../../compat.js";
import connectDB from "../../../lib/mongodb.js";
import Scheme from "../../../lib/models/Scheme.js";
import { requireAdmin } from "../../../lib/adminGuard.js";
import { withTimeout, dbUnavailable, isDbError } from "../../../lib/db.js";
import { verifyCsrf } from "../../../lib/security.js";
import {
  validateSchemeInput,
  cleanSchemePayload,
  applySchemeStatus,
  schemeSlugExists,
} from "../../../lib/schemes.js";
import {
  log as liveLog,
  activity as liveActivity,
  emitEvent,
  bumpStats,
} from "../../../lib/liveServer.js";

export async function GET(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await withTimeout(connectDB());
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Math.min(50, Number(searchParams.get("limit")) || 10));
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") === "asc" ? 1 : -1;

    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { slug: { $regex: q, $options: "i" } },
        { department: { $regex: q, $options: "i" } },
      ];
    }
    if (status) query.status = status;
    if (category) query.category = category;

    const sortable = new Set(["createdAt", "updatedAt", "title", "publishedAt", "lastDate"]);
    const sortKey = sortable.has(sort) ? sort : "createdAt";
    const sortStage = { [sortKey]: order, _id: 1 };

    const [total, schemes] = await Promise.all([
      Scheme.countDocuments(query),
      Scheme.find(query).sort(sortStage).skip((page - 1) * limit).limit(limit).lean(),
    ]);

    return Response.json({
      success: true,
      schemes: schemes.map((s) => ({
        ...s,
        _id: String(s._id),
        seo: s.seo || {},
        faqs: s.faqs || [],
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin list schemes error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to load schemes." }, { status: 500 });
  }
}

export async function POST(request) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!(await verifyCsrf(request))) {
    return Response.json({ success: false, message: "Invalid security token. Refresh and try again." }, { status: 403 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const { errors, slug } = validateSchemeInput(data);
  if (Object.keys(errors).length) {
    return Response.json({ success: false, message: "Please fix the highlighted fields.", errors }, { status: 422 });
  }

  try {
    await withTimeout(connectDB());

    if (await schemeSlugExists(slug)) {
      return Response.json(
        { success: false, message: "This slug is already used. Please choose another.", errors: { slug } },
        { status: 409 }
      );
    }

    let payload = cleanSchemePayload(data);
    payload.slug = slug;
    payload.scheduledAtInput = data.scheduledAt || null;
    payload = applySchemeStatus(payload, data.status || "draft", null);

    const scheme = await Scheme.create(payload);

    emitEvent("scheme:created", { _id: String(scheme._id), title: scheme.title, status: scheme.status });
    if (scheme.status === "published") {
      emitEvent("scheme:published", { _id: String(scheme._id), title: scheme.title });
      emitEvent("notify", { tone: "scheme", message: `New scheme published: ${scheme.title}` });
      liveLog({ level: "SUCCESS", source: "SchemesAPI", message: `Scheme published: ${scheme.title}` });
    } else {
      liveLog({ level: "INFO", source: "SchemesAPI", message: `Scheme created (${scheme.status}): ${scheme.title}` });
    }
    liveActivity({
      tone: scheme.status === "published" ? "postPublished" : "postCreated",
      message: scheme.status === "published" ? "New scheme published" : "Scheme created",
      sub: scheme.title,
      id: String(scheme._id),
      link: `/admin/schemes/${scheme._id}`,
    });
    bumpStats();

    return Response.json({ success: true, scheme: { ...scheme.toObject(), _id: String(scheme._id) } }, { status: 201 });
  } catch (error) {
    console.error("Admin create scheme error:", error.message);
    liveLog({ level: "ERROR", source: "SchemesAPI", message: `Admin create scheme failed: ${error.message}` });
    if (isDbError(error)) return dbUnavailable();
    if (error?.code === 11000) {
      return Response.json({ success: false, message: "This slug is already used.", errors: { slug: data.slug } }, { status: 409 });
    }
    return Response.json({ success: false, message: "Failed to save scheme." }, { status: 500 });
  }
}

export async function PATCH(request) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!(await verifyCsrf(request))) {
    return Response.json({ success: false, message: "Invalid security token. Refresh and try again." }, { status: 403 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const ids = Array.isArray(data.ids) ? data.ids.map(String).filter(Boolean).slice(0, 50) : [];
  const action = String(data.action || "");
  if (!ids.length || !["publish", "unpublish", "feature", "unfeature", "delete"].includes(action)) {
    return Response.json({ success: false, message: "Invalid bulk action or ids." }, { status: 400 });
  }

  try {
    await withTimeout(connectDB());
    const now = new Date();

    if (action === "delete") {
      const r = await Scheme.deleteMany({ _id: { $in: ids } });
      liveLog({ level: "INFO", source: "SchemesAPI", message: `Bulk deleted ${r.deletedCount} scheme(s)` });
      bumpStats();
      return Response.json({ success: true, deleted: r.deletedCount });
    }

    const set = {};
    if (action === "publish") {
      set.status = "published";
      set.publishedAt = now;
      set.scheduledAt = null;
    } else if (action === "unpublish") {
      set.status = "unpublished";
      set.publishedAt = null;
    } else if (action === "feature") {
      set.featured = true;
    } else if (action === "unfeature") {
      set.featured = false;
    }

    const r = await Scheme.updateMany({ _id: { $in: ids } }, { $set: set });
    emitEvent("scheme:updated", { ids, action, modified: r.modifiedCount });
    liveLog({ level: "INFO", source: "SchemesAPI", message: `Bulk action '${action}' applied to ${r.modifiedCount} scheme(s)` });
    bumpStats();
    return Response.json({ success: true, modified: r.modifiedCount });
  } catch (error) {
    console.error("Admin bulk scheme error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json({ success: false, message: "Bulk action failed." }, { status: 500 });
  }
}

import { Router } from "express";
const router = Router();
router.get("/", expressify(GET));
router.post("/", expressify(POST));
router.patch("/", expressify(PATCH));
export default router;
