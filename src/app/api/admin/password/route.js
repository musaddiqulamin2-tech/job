import bcrypt from "bcryptjs";
import connectDB from "../../../lib/mongodb";
import Admin from "../../../lib/models/Admin";
import { getSession, unauthorized } from "../../../lib/auth";
import { withTimeout, dbUnavailable, isDbError } from "../../../lib/db";

export const dynamic = "force-dynamic";

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

  const currentPassword = String(data.currentPassword || "");
  const newPassword = String(data.newPassword || "");

  if (!currentPassword) {
    return Response.json(
      { success: false, message: "Current password is required." },
      { status: 400 }
    );
  }
  if (newPassword.length < 8 || newPassword.length > 128) {
    return Response.json(
      { success: false, message: "New password must be between 8 and 128 characters." },
      { status: 400 }
    );
  }

  try {
    await withTimeout(connectDB());
    const admin = await Admin.findById(session.id);
    if (!admin) {
      return Response.json(
        { success: false, message: "Admin account not found." },
        { status: 404 }
      );
    }

    const ok = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!ok) {
      return Response.json(
        { success: false, message: "Current password is incorrect." },
        { status: 401 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    admin.passwordHash = passwordHash;
    await admin.save();

    return Response.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Admin password update error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json(
      { success: false, message: "Failed to update password." },
      { status: 500 }
    );
  }
}