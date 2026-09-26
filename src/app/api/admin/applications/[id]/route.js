import connectDB from "../../../../lib/mongodb";
import Application from "../../../../lib/models/Application";
import { getSession, unauthorized } from "../../../../lib/auth";
import { withTimeout, dbUnavailable, isDbError } from "../../../../lib/db";
import { APP_STATUSES } from "../../../../lib/admin";
import {
  log as liveLog,
  activity as liveActivity,
  emitEvent,
  bumpStats,
} from "../../../../lib/liveServer";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await params;

  try {
    await withTimeout(connectDB());
    const app = await Application.findById(id).lean();
    if (!app) {
      return Response.json(
        { success: false, message: "Application not found." },
        { status: 404 }
      );
    }
    return Response.json({
      success: true,
      application: { ...app, _id: String(app._id), status: app.status || "Pending" },
    });
  } catch (error) {
    console.error("Admin get application error:", error.message);
    return dbUnavailable();
  }
}

export async function PATCH(request, { params }) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await params;

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const status = data.status;
  if (!status) {
    return Response.json(
      { success: false, message: "Status is required." },
      { status: 400 }
    );
  }
  if (!APP_STATUSES.includes(status)) {
    return Response.json(
      { success: false, message: "Invalid status value." },
      { status: 400 }
    );
  }

  const updates = {
    status,
    reviewedAt: new Date(),
  };
  if (typeof data.statusNote === "string") {
    updates.statusNote = String(data.statusNote).trim();
  }

  try {
    await withTimeout(connectDB());
    const app = await Application.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!app) {
      return Response.json(
        { success: false, message: "Application not found." },
        { status: 404 }
      );
    }
    emitEvent("application:updated", {
      _id: String(app._id),
      jobTitle: app.jobTitle,
      status: app.status,
    });
    liveLog({
      level: "INFO",
      source: "ApplicationsAPI",
      message: `Application status -> ${app.status}: ${app.jobTitle || app.fullName}`,
    });
    liveActivity({
      tone: "appUpdated",
      message: `Application marked ${app.status}`,
      sub: app.jobTitle || app.fullName || "",
      id: String(app._id),
      link: `/admin/applications/${app._id}`,
    });
    bumpStats();
    return Response.json({
      success: true,
      application: { ...app.toObject(), _id: String(app._id), status: app.status },
      message: "Application status updated.",
    });
  } catch (error) {
    console.error("Admin update application error:", error.message);
    liveLog({ level: "ERROR", source: "ApplicationsAPI", message: `Admin update application failed: ${error.message}` });
    if (isDbError(error)) return dbUnavailable();
    return Response.json(
      { success: false, message: "Failed to update application." },
      { status: 500 }
    );
  }
}