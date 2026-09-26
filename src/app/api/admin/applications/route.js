import connectDB from "../../../lib/mongodb";
import Application from "../../../lib/models/Application";
import { getSession, unauthorized } from "../../../lib/auth";
import { withTimeout, dbUnavailable } from "../../../lib/db";
import { APP_STATUSES } from "../../../lib/admin";
import { trackApiCall } from "../../../lib/liveServer";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const session = await getSession();
  if (!session) return unauthorized();

  const start = Date.now();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") || "10", 10) || 10)
  );

  const query = {};
  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [
      { fullName: regex },
      { email: regex },
      { phone: regex },
      { jobTitle: regex },
    ];
  }
  if (status && APP_STATUSES.includes(status)) {
    query.status = status;
  }

  try {
    await withTimeout(connectDB());

    const [total, applications] = await Promise.all([
      Application.countDocuments(query),
      Application.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const res = Response.json({
      success: true,
      applications: applications.map((app) => ({
        ...app,
        _id: String(app._id),
        status: app.status || "Pending",
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
    trackApiCall({ method: "GET", path: "/api/admin/applications", status: 200, ms: Date.now() - start });
    return res;
  } catch (error) {
    console.error("Admin applications list error:", error.message);
    const res = dbUnavailable();
    trackApiCall({ method: "GET", path: "/api/admin/applications", status: 503, ms: Date.now() - start });
    return res;
  }
}