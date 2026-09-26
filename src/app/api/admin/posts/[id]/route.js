import connectDB from "../../../../lib/mongodb";
import Post from "../../../../lib/models/Post";
import { requireAdmin } from "../../../../lib/adminGuard";
import { withTimeout, dbUnavailable, isDbError } from "../../../../lib/db";
import { verifyCsrf } from "../../../../lib/security";
import { validatePostInput, cleanPostPayload, slugExists } from "../../../../lib/cms";
import { validateContentJson, jsonToHtml, createEmptyDoc } from "../../../../lib/postRender";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    await withTimeout(connectDB());
    const post = await Post.findById(id).lean();
    if (!post) {
      return Response.json({ success: false, message: "Post not found." }, { status: 404 });
    }
    return Response.json({
      success: true,
      post: { ...post, _id: String(post._id) },
    });
  } catch (err) {
    console.error("Admin get post error:", err.message);
    if (isDbError(err)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to load post." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!(await verifyCsrf(request))) {
    return Response.json({ success: false, message: "Invalid security token. Refresh and try again." }, { status: 403 });
  }

  const { id } = await params;

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const { errors, slug } = validatePostInput(data, data.existingSlug || "");
  if (Object.keys(errors).length) {
    return Response.json({ success: false, message: "Please fix the highlighted fields.", errors }, { status: 422 });
  }

  try {
    await withTimeout(connectDB());

    const existing = await Post.findById(id);
    if (!existing) {
      return Response.json({ success: false, message: "Post not found." }, { status: 404 });
    }

    if (await slugExists(slug, id)) {
      return Response.json(
        { success: false, message: "This slug is already used. Please choose another.", errors: { slug } },
        { status: 409 }
      );
    }

    let payload = cleanPostPayload(data);
    payload.slug = slug;
    payload.scheduledAtInput = data.scheduledAt || existing.scheduledAt || null;
    const hasContent = Boolean(data.content && data.content.json);
    payload.content = hasContent
      ? {
          json: validateContentJson(data.content.json) || existing.content?.json || createEmptyDoc(),
          html: jsonToHtml(data.content.json),
        }
      : existing.content || { json: createEmptyDoc(), html: "" };

    if (data.status || data.status === "" ? true : false) {
      const now = new Date();
      if (data.status === "published") {
        payload.status = "published";
        payload.publishedAt = existing.publishedAt || now;
        payload.scheduledAt = null;
      } else if (data.status === "scheduled") {
        payload.status = "scheduled";
        payload.publishedAt = null;
        if (payload.scheduledAtInput) {
          const d = new Date(payload.scheduledAtInput);
          if (!Number.isNaN(d.getTime())) payload.scheduledAt = d;
        }
      } else {
        payload.status = data.status;
        payload.publishedAt = null;
        if (data.status === "draft") payload.scheduledAt = null;
      }
    }
    delete payload.scheduledAtInput;

    if (data.expiresAt) {
      const d = new Date(data.expiresAt);
      payload.expiresAt = Number.isNaN(d.getTime()) ? null : d;
    } else if (!data.expiresAt) {
      payload.expiresAt = null;
    }

    Object.assign(existing, payload);
    await existing.save();

    return Response.json({
      success: true,
      message: "Post updated.",
      post: { ...existing.toObject(), _id: String(existing._id) },
    });
  } catch (error) {
    console.error("Admin update post error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to update post." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!(await verifyCsrf(request))) {
    return Response.json({ success: false, message: "Invalid security token. Refresh and try again." }, { status: 403 });
  }

  const { id } = await params;

  try {
    await withTimeout(connectDB());
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ success: false, message: "Post not found." }, { status: 404 });
    }
    return Response.json({ success: true, message: "Post deleted." });
  } catch (error) {
    console.error("Admin delete post error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to delete post." }, { status: 500 });
  }
}