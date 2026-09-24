import connectDB from "../../../lib/mongodb";
import Admin from "../../../lib/models/Admin";
import { getSession, unauthorized, signToken, setSessionCookie } from "../../../lib/auth";
import { withTimeout, dbUnavailable, isDbError } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  try {
    await withTimeout(connectDB());
    const admin = await Admin.findById(session.id).lean();
    if (!admin) {
      return Response.json(
        { success: false, message: "Admin account not found." },
        { status: 404 }
      );
    }
    return Response.json({
      success: true,
      admin: {
        _id: String(admin._id),
        name: admin.name || "Admin",
        email: admin.email,
        lastLoginAt: admin.lastLoginAt || null,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error("Admin profile get error:", error.message);
    return dbUnavailable();
  }
}

export async function PUT(request) {
  const session = await getSession();
  if (!session) return unauthorized();

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const name = String(data.name || "").trim();
  if (!name || name.length < 2 || name.length > 60) {
    return Response.json(
      { success: false, message: "Name must be between 2 and 60 characters." },
      { status: 400 }
    );
  }

  try {
    await withTimeout(connectDB());
    const admin = await Admin.findByIdAndUpdate(
      session.id,
      { $set: { name } },
      { new: true }
    );
    if (!admin) {
      return Response.json(
        { success: false, message: "Admin account not found." },
        { status: 404 }
      );
    }

    const token = await signToken(admin);
    await setSessionCookie(token);

    return Response.json({
      success: true,
      admin: { _id: String(admin._id), name: admin.name, email: admin.email },
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error("Admin profile update error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json(
      { success: false, message: "Failed to update profile." },
      { status: 500 }
    );
  }
}