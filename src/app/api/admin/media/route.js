import { v2 as cloudinary } from "cloudinary";
import connectDB from "../../../lib/mongodb";
import Media from "../../../lib/models/Media";
import { requireAdmin } from "../../../lib/adminGuard";
import { withTimeout, dbUnavailable, isDbError } from "../../../lib/db";
import { verifyCsrf } from "../../../lib/security";

export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMAGE_FORMATS = ["jpeg", "jpg", "png", "webp", "gif"];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_PDF_BYTES = 20 * 1024 * 1024;

function detectMime(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,/);
  return match ? match[1].toLowerCase() : "";
}

function isAllowedFile(dataUrl, resourceType) {
  const mime = detectMime(dataUrl);
  if (resourceType === "pdf") {
    return mime === "application/pdf";
  }
  return mime === "image/jpeg" || mime === "image/png" || mime === "image/webp" || mime === "image/gif";
}

function decodeSize(dataUrl) {
  try {
    const base64 = String(dataUrl).split(",")[1] || "";
    return Buffer.from(base64, "base64").length;
  } catch {
    return 0;
  }
}

export async function GET(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Math.min(60, Number(searchParams.get("limit")) || 24));
  const type = searchParams.get("type") || "";
  const q = searchParams.get("q") || "";

  try {
    await withTimeout(connectDB());
    const query = {};
    if (type === "image" || type === "pdf") query.resourceType = type;
    if (q) query.$or = [{ filename: { $regex: q, $options: "i" } }, { publicId: { $regex: q, $options: "i" } }];

    const [total, items] = await Promise.all([
      Media.countDocuments(query),
      Media.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ]);

    return Response.json({
      success: true,
      items: items.map((m) => ({ ...m, _id: String(m._id) })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin media list error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to load media." }, { status: 500 });
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

  const dataUrl = String(data.dataUrl || "");
  const requestedType = data.resourceType === "pdf" ? "pdf" : "image";
  if (!dataUrl.startsWith("data:")) {
    return Response.json({ success: false, message: "Invalid file data." }, { status: 400 });
  }
  if (!isAllowedFile(dataUrl, requestedType)) {
    return Response.json(
      { success: false, message: requestedType === "pdf" ? "Only PDF files are allowed." : "Only JPG, PNG, WEBP or GIF images are allowed." },
      { status: 415 }
    );
  }
  const bytes = decodeSize(dataUrl);
  if ((requestedType === "image" && bytes > MAX_IMAGE_BYTES) || (requestedType === "pdf" && bytes > MAX_PDF_BYTES)) {
    return Response.json(
      { success: false, message: requestedType === "image" ? "Image must be under 8 MB." : "PDF must be under 20 MB." },
      { status: 413 }
    );
  }

  const folder = requestedType === "pdf" ? "jobcareer/media/pdf" : "jobcareer/media/images";

  try {
    await withTimeout(connectDB());
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder,
      resource_type: requestedType === "pdf" ? "auto" : "image",
    });

    const item = await Media.create({
      publicId: result.public_id || "",
      url: result.secure_url || result.url || "",
      secureUrl: result.secure_url || "",
      resourceType: requestedType,
      format: result.format || "",
      size: result.bytes || 0,
      width: result.width || 0,
      height: result.height || 0,
      filename: String(data.filename || "").replace(/[^\w.\-() ]/g, "").slice(0, 200),
      folder,
      uploadedBy: String(data.author || "").slice(0, 80),
    });

    return Response.json(
      { success: true, item: { ...item.toObject(), _id: String(item._id) } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin media upload error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json({ success: false, message: "Upload failed. Check Cloudinary configuration." }, { status: 500 });
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
  if (!id) return Response.json({ success: false, message: "Missing media id." }, { status: 400 });

  try {
    await withTimeout(connectDB());
    const item = await Media.findById(id);
    if (!item) return Response.json({ success: false, message: "Media not found." }, { status: 404 });

    if (item.publicId) {
      try {
        await cloudinary.uploader.destroy(item.publicId, { resource_type: item.resourceType === "pdf" ? "raw" : "image" });
      } catch (e) {
        console.warn("Cloudinary destroy warning:", e.message);
      }
    }

    await Media.findByIdAndDelete(id);
    return Response.json({ success: true, message: "Media deleted." });
  } catch (error) {
    console.error("Admin media delete error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to delete media." }, { status: 500 });
  }
}