import connectDB from "../../../lib/mongodb";
import Post from "../../../lib/models/Post";
import { requireAdmin } from "../../../lib/adminGuard";
import { withTimeout, dbUnavailable, isDbError } from "../../../lib/db";
import { verifyCsrf } from "../../../lib/security";
import {
  validatePostInput,
  cleanPostPayload,
  slugExists,
} from "../../../lib/cms";
import { validateContentJson, jsonToHtml, createEmptyDoc } from "../../../lib/postRender";

export const dynamic = "force-dynamic";

function applyStatus(payload, status, existing) {
  const now = new Date();
  const finalStatus = POST_STATUS_FALLBACK(status);
  if (finalStatus === "published") {
    payload.status = "published";
    payload.publishedAt = existing?.publishedAt || now;
    payload.scheduledAt = null;
  } else if (finalStatus === "scheduled") {
    payload.status = "scheduled";
    payload.publishedAt = null;
    if (payload.scheduledAtInput) {
      const d = new Date(payload.scheduledAtInput);
      if (!Number.isNaN(d.getTime())) payload.scheduledAt = d;
    }
  } else {
    payload.status = finalStatus;
    payload.publishedAt = null;
    if (finalStatus === "draft") payload.scheduledAt = null;
  }
  delete payload.scheduledAtInput;
  return payload;
}

function POST_STATUS_FALLBACK(s) {
  return ["draft", "scheduled", "published", "unpublished"].includes(s) ? s : "draft";
}

function applyContent(payload, data, existing) {
  if (data.content && data.content.json) {
    const cleaned = validateContentJson(data.content.json);
    payload.content = cleaned
      ? { json: cleaned, html: jsonToHtml(cleaned) }
      : existing?.content || { json: createEmptyDoc(), html: "" };
  } else {
    payload.content = existing?.content || { json: createEmptyDoc(), html: "" };
  }
  return payload;
}

export async function GET(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await withTimeout(connectDB());
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Math.min(50, Number(searchParams.get("limit")) || 10));
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") === "asc" ? 1 : -1;

    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { slug: { $regex: q, $options: "i" } },
        { organization: { $regex: q, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (status) query.status = status;

    const sortable = new Set(["createdAt", "updatedAt", "title", "publishedAt", "lastDate"]);
    const sortKey = sortable.has(sort) ? sort : "createdAt";
    const sortStage = {};
    sortStage[sortKey] = order;
    sortStage["_id"] = 1;

    const [total, posts] = await Promise.all([
      Post.countDocuments(query),
      Post.find(query)
        .sort(sortStage)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return Response.json({
      success: true,
      posts: posts.map((p) => ({
        ...p,
        _id: String(p._id),
        seo: p.seo || {},
        importantLinks: p.importantLinks || [],
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin list posts error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to load posts." }, { status: 500 });
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

  const { errors, slug } = validatePostInput(data);
  if (Object.keys(errors).length) {
    return Response.json({ success: false, message: "Please fix the highlighted fields.", errors }, { status: 422 });
  }

  try {
    await withTimeout(connectDB());

    if (await slugExists(slug)) {
      return Response.json(
        { success: false, message: "This slug is already used. Please choose another.", errors: { slug } },
        { status: 409 }
      );
    }

    let payload = cleanPostPayload(data);
    payload.slug = slug;
    payload.scheduledAtInput = data.scheduledAt || null;
    payload = applyStatus(payload, data.status || "draft", null);
    payload = applyContent(payload, data, null);

    const post = await Post.create(payload);
    return Response.json({ success: true, post: { ...post.toObject(), _id: String(post._id) } }, { status: 201 });
  } catch (error) {
    console.error("Admin create post error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to save post." }, { status: 500 });
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
      const r = await Post.deleteMany({ _id: { $in: ids } });
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

    const r = await Post.updateMany({ _id: { $in: ids } }, { $set: set });
    return Response.json({ success: true, modified: r.modifiedCount });
  } catch (error) {
    console.error("Admin bulk post error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json({ success: false, message: "Bulk action failed." }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!(await verifyCsrf(request))) {
    return Response.json({ success: false, message: "Invalid security token. Refresh and try again." }, { status: 403 });
  }

  let ids = [];
  try {
    const data = await request.json();
    ids = Array.isArray(data.ids) ? data.ids.map(String).filter(Boolean).slice(0, 50) : [];
  } catch {
    const { searchParams } = new URL(request.url);
    ids = searchParams.get("ids") ? searchParams.get("ids").split(",").filter(Boolean) : [];
  }

  if (!ids.length) {
    return Response.json({ success: false, message: "No posts selected." }, { status: 400 });
  }

  try {
    await withTimeout(connectDB());
    const r = await Post.deleteMany({ _id: { $in: ids } });
    return Response.json({ success: true, deleted: r.deletedCount });
  } catch (error) {
    console.error("Admin bulk delete posts error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json({ success: false, message: "Delete failed." }, { status: 500 });
  }
}