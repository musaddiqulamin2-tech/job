import connectDB from "../../../lib/mongodb";
import SiteSetting from "../../../lib/models/SiteSetting";
import { requireAdmin } from "../../../lib/adminGuard";
import { withTimeout, dbUnavailable, isDbError } from "../../../lib/db";
import { verifyCsrf } from "../../../lib/security";

export const dynamic = "force-dynamic";

const GENERAL_KEY = "general";

const NOTIF_KEYS = ["newApplication", "weeklyDigest", "emailAlerts", "jobExpiry"];
const SOCIAL_KEYS = ["facebook", "twitter", "instagram", "linkedin", "youtube", "telegram", "whatsapp"];
const CMS_CATEGORY_SLUGS = [
  "government-job",
  "private-job",
  "admit-card",
  "result",
  "admission",
  "answer-key",
  "syllabus",
];

async function getOrCreate() {
  let doc = await SiteSetting.findOne({ key: GENERAL_KEY });
  if (!doc) {
    doc = await SiteSetting.create({ key: GENERAL_KEY });
  }
  return doc;
}

function safeUrl(value) {
  const v = String(value || "").trim();
  if (!v) return "";
  return /^https?:\/\/[^\s]+$/i.test(v) ? v.slice(0, 500) : "";
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await withTimeout(connectDB());
    const doc = await getOrCreate();

    return Response.json({
      success: true,
      settings: {
        siteName: doc.siteName || "",
        siteTagline: doc.siteTagline || "",
        siteLogo: doc.siteLogo || "",
        favicon: doc.favicon || "",
        contactEmail: doc.contactEmail || "",
        contactPhone: doc.contactPhone || "",
        footerText: doc.footerText || "",
        aboutText: doc.aboutText || "",
        socialLinks: {
          facebook: doc.socialLinks?.facebook || "",
          twitter: doc.socialLinks?.twitter || "",
          instagram: doc.socialLinks?.instagram || "",
          linkedin: doc.socialLinks?.linkedin || "",
          youtube: doc.socialLinks?.youtube || "",
          telegram: doc.socialLinks?.telegram || "",
          whatsapp: doc.socialLinks?.whatsapp || "",
        },
        homepageCategories: Array.isArray(doc.homepageCategories) ? doc.homepageCategories : [],
        featuredSlots: {
          enabled: Boolean(doc.featuredSlots?.enabled),
          count: Number(doc.featuredSlots?.count) || 4,
        },
        postOrder: doc.postOrder || "latest",
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
    if (isDbError(error)) return dbUnavailable();
    return Response.json({ success: false, message: "Failed to load settings." }, { status: 500 });
  }
}

export async function PUT(request) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!(await verifyCsrf(request))) {
    return Response.json({ success: false, message: "Invalid security token. Refresh and try again." }, { status: 403 });
  }

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
  for (const f of ["siteName", "siteTagline", "contactEmail", "contactPhone", "siteTagline", "aboutText", "footerText"]) {
    if (typeof data[f] === "string") {
      updates[f] = String(data[f]).trim().slice(0, 2000);
    }
  }
  updates.siteLogo = safeUrl(data.siteLogo);
  updates.favicon = safeUrl(data.favicon);

  if (data.socialLinks && typeof data.socialLinks === "object") {
    for (const key of SOCIAL_KEYS) {
      updates[`socialLinks.${key}`] = safeUrl(data.socialLinks[key]);
    }
  }

  if (Array.isArray(data.homepageCategories)) {
    updates.homepageCategories = data.homepageCategories
      .filter((c) => CMS_CATEGORY_SLUGS.includes(c))
      .slice(0, 7);
  }

  if (data.featuredSlots && typeof data.featuredSlots === "object") {
    updates["featuredSlots.enabled"] = Boolean(data.featuredSlots.enabled);
    updates["featuredSlots.count"] = Math.max(1, Math.min(12, Number(data.featuredSlots.count) || 4));
  }

  if (data.postOrder === "latest" || data.postOrder === "featured") {
    updates.postOrder = data.postOrder;
  }

  if (data.notifications && typeof data.notifications === "object") {
    for (const key of NOTIF_KEYS) {
      updates[`notifications.${key}`] = Boolean(data.notifications[key]);
    }
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