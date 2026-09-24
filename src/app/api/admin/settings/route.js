import connectDB from "../../../lib/mongodb";
import SiteSetting from "../../../lib/models/SiteSetting";
import { getSession, unauthorized } from "../../../lib/auth";
import { withTimeout, dbUnavailable, isDbError } from "../../../lib/db";

export const dynamic = "force-dynamic";

const GENERAL_KEY = "general";

const NOTIF_KEYS = ["newApplication", "weeklyDigest", "emailAlerts", "jobExpiry"];

async function getOrCreate() {
  let doc = await SiteSetting.findOne({ key: GENERAL_KEY });
  if (!doc) {
    doc = await SiteSetting.create({ key: GENERAL_KEY });
  }
  return doc;
}

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  try {
    await withTimeout(connectDB());
    const doc = await getOrCreate();

    return Response.json({
      success: true,
      settings: {
        siteName: doc.siteName || "",
        contactEmail: doc.contactEmail || "",
        contactPhone: doc.contactPhone || "",
        siteTagline: doc.siteTagline || "",
        aboutText: doc.aboutText || "",
        notifications: {
          newApplication: doc.notifications?.newApplication ?? true,
          weeklyDigest: doc.notifications?.weeklyDigest ?? true,
          emailAlerts: doc.notifications?.emailAlerts ?? false,
          jobExpiry: doc.notifications?.jobExpiry ?? true,
        },
      },
    });
  } catch (error) {
    console.error("Admin settings get error:", error.message);
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

  const updates = {};
  for (const f of ["siteName", "contactEmail", "contactPhone", "siteTagline", "aboutText"]) {
    if (typeof data[f] === "string") {
      updates[f] = String(data[f]).trim();
    }
  }

  if (data.notifications && typeof data.notifications === "object") {
    updates["notifications.newApplication"] = Boolean(data.notifications.newApplication);
    updates["notifications.weeklyDigest"] = Boolean(data.notifications.weeklyDigest);
    updates["notifications.emailAlerts"] = Boolean(data.notifications.emailAlerts);
    updates["notifications.jobExpiry"] = Boolean(data.notifications.jobExpiry);
  }

  if (!Object.keys(updates).length) {
    return Response.json(
      { success: false, message: "No settings to save." },
      { status: 400 }
    );
  }

  try {
    await withTimeout(connectDB());
    const doc = await getOrCreate();
    await SiteSetting.updateOne({ _id: doc._id }, { $set: updates });

    return Response.json({ success: true, message: "Settings saved successfully." });
  } catch (error) {
    console.error("Admin settings update error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json(
      { success: false, message: "Failed to save settings." },
      { status: 500 }
    );
  }
}