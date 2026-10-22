import { expressify } from "../../../../compat.js";
import connectDB from "../../../../lib/mongodb.js";
import Scheme from "../../../../lib/models/Scheme.js";
import { requireAdmin } from "../../../../lib/adminGuard.js";
import { withTimeout, dbUnavailable, isDbError } from "../../../../lib/db.js";
import { verifyCsrf } from "../../../../lib/security.js";
import {
  validateSchemeInput,
  cleanSchemePayload,
  applySchemeStatus,
  schemeSlugExists,
} from "../../../../lib/schemes.js";
import {
  log as liveLog,
  activity as liveActivity,
  emitEvent,
  bumpStats,
} from "../../../../lib/liveServer.js";

export async function GET(_request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    await withTimeout(connectDB());
    const scheme = await Scheme.findById(id).lean();
    if (!scheme) {
      return Response.json({ success: false, message: "Scheme not found." }, { status: 404 });
    }
    return Response.json({
      success: true,
      scheme: { ...scheme, _id: String(scheme._id) },
    });
  } catch (err) {
    console.error("Admin get scheme error:", err.message);
    if (isDbError(err)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to load scheme." }, { status: 500 });
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

  try {
    await withTimeout(connectDB());

    const existing = await Scheme.findById(id);
    if (!existing) {
      return Response.json({ success: false, message: "Scheme not found." }, { status: 404 });
    }

    const { errors, slug } = validateSchemeInput(data, existing.slug);
    if (Object.keys(errors).length) {
      return Response.json({ success: false, message: "Please fix the highlighted fields.", errors }, { status: 422 });
    }

    if (await schemeSlugExists(slug, id)) {
      return Response.json(
        { success: false, message: "This slug is already used. Please choose another.", errors: { slug } },
        { status: 409 }
      );
    }

    let payload = cleanSchemePayload(data);
    payload.slug = slug;
    payload.scheduledAtInput = data.scheduledAt || existing.scheduledAt || null;
    payload = applySchemeStatus(payload, data.status || existing.status, existing);

    Object.assign(existing, payload);
    await existing.save();

    emitEvent("scheme:updated", { _id: String(existing._id), title: existing.title, status: existing.status });
    liveLog({ level: "INFO", source: "SchemesAPI", message: `Scheme updated: ${existing.title}` });
    liveActivity({
      tone: existing.status === "published" ? "postPublished" : "postUpdated",
      message: "Scheme updated",
      sub: existing.title,
      id: String(existing._id),
      link: `/admin/schemes/${existing._id}`,
    });
    bumpStats();

    return Response.json({
      success: true,
      message: "Scheme updated.",
      scheme: { ...existing.toObject(), _id: String(existing._id) },
    });
  } catch (err) {
    console.error("Admin update scheme error:", err.message);
    liveLog({ level: "ERROR", source: "SchemesAPI", message: `Admin update scheme failed: ${err.message}` });
    if (isDbError(err)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to update scheme." }, { status: 500 });
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
    const deleted = await Scheme.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ success: false, message: "Scheme not found." }, { status: 404 });
    }
    emitEvent("scheme:deleted", { _id: String(deleted._id), title: deleted.title });
    liveLog({ level: "INFO", source: "SchemesAPI", message: `Scheme deleted: ${deleted.title}` });
    bumpStats();
    return Response.json({ success: true, message: "Scheme deleted." });
  } catch (err) {
    console.error("Admin delete scheme error:", err.message);
    if (isDbError(err)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to delete scheme." }, { status: 500 });
  }
}

import { Router } from "express";
const router = Router();
router.get("/:id", expressify(GET));
router.put("/:id", expressify(PUT));
router.delete("/:id", expressify(DELETE));
export default router;
