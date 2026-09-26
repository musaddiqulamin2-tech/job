import connectDB from "../../../lib/mongodb";
import Category, { DEFAULT_CATEGORIES } from "../../../lib/models/Category";
import { requireAdmin } from "../../../lib/adminGuard";
import { withTimeout, dbUnavailable, isDbError } from "../../../lib/db";
import { verifyCsrf } from "../../../lib/security";
import { slugify } from "../../../lib/cms";

export const dynamic = "force-dynamic";

function cleanCategory(data, existingSlug = "") {
  const name = String(data.name || "").trim().slice(0, 100);
  const slug = String(data.slug || "").trim() || slugify(name);
  return {
    name,
    slug,
    description: String(data.description || "").trim().slice(0, 500),
    parent: String(data.parent || "").trim().slice(0, 100),
    order: Math.max(0, Number(data.order) || 0),
    enabled: data.enabled === undefined ? true : Boolean(data.enabled),
    icon: String(data.icon || "").trim().slice(0, 50),
    _existingSlug: existingSlug,
  };
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await withTimeout(connectDB());
    const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
    return Response.json({
      success: true,
      categories: categories.map((c) => ({ ...c, _id: String(c._id) })),
    });
  } catch (err) {
    console.error("Admin list categories error:", err.message);
    if (isDbError(err)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to load categories." }, { status: 500 });
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

  const clean = cleanCategory(data);
  if (!clean.name || !clean.slug) {
    return Response.json({ success: false, message: "Name and slug are required." }, { status: 422 });
  }

  try {
    await withTimeout(connectDB());
    if (await Category.findOne({ slug: clean.slug }).lean()) {
      return Response.json({ success: false, message: "This slug is already used." }, { status: 409 });
    }

    delete clean._existingSlug;
    const cat = await Category.create(clean);
    return Response.json({ success: true, category: { ...cat.toObject(), _id: String(cat._id) } }, { status: 201 });
  } catch (err) {
    console.error("Admin create category error:", err.message);
    if (isDbError(err)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to create category." }, { status: 500 });
  }
}

export async function PATCH(request) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!(await verifyCsrf(request))) {
    return Response.json({ success: false, message: "Invalid security token. Refresh and try again." }, { status: 403 });
  }

  let data = {};
  try {
    data = await request.json();
  } catch {
    return Response.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const id = String(data.id || "");
  if (!id) return Response.json({ success: false, message: "Missing category id." }, { status: 400 });

  try {
    await withTimeout(connectDB());
    const existing = await Category.findById(id);
    if (!existing) return Response.json({ success: false, message: "Category not found." }, { status: 404 });

    const clean = cleanCategory(data, existing.slug);
    if (!clean.name || !clean.slug) {
      return Response.json({ success: false, message: "Name and slug are required." }, { status: 422 });
    }
    if (clean.slug !== existing.slug && (await Category.findOne({ slug: clean.slug }).lean())) {
      return Response.json({ success: false, message: "This slug is already used." }, { status: 409 });
    }
    delete clean._existingSlug;

    Object.assign(existing, clean);
    await existing.save();
    return Response.json({ success: true, message: "Category updated.", category: { ...existing.toObject(), _id: String(existing._id) } });
  } catch (err) {
    console.error("Admin update category error:", err.message);
    if (isDbError(err)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to update category." }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!(await verifyCsrf(request))) {
    return Response.json({ success: false, message: "Invalid security token. Refresh and try again." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ success: false, message: "Missing category id." }, { status: 400 });

  const isDefault = DEFAULT_CATEGORIES.some((c) => c.slug === searchParams.get("slug"));
  if (isDefault) {
    return Response.json(
      { success: false, message: "Default categories cannot be deleted. You can disable them instead." },
      { status: 400 }
    );
  }

  try {
    await withTimeout(connectDB());
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return Response.json({ success: false, message: "Category not found." }, { status: 404 });
    return Response.json({ success: true, message: "Category deleted." });
  } catch (err) {
    console.error("Admin delete category error:", err.message);
    if (isDbError(err)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to delete category." }, { status: 500 });
  }
}