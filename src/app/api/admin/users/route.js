import connectDB from "../../../lib/mongodb";
import Worker from "../../../lib/models/Worker";
import { getSession, unauthorized } from "../../../lib/auth";
import { withTimeout, dbUnavailable, isDbError } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") || "10", 10) || 10)
  );

  const query = {};
  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [
      { name: regex },
      { mobile: regex },
      { state: regex },
      { district: regex },
      { workType: regex },
    ];
  }

  try {
    await withTimeout(connectDB());

    const [total, workers] = await Promise.all([
      Worker.countDocuments(query),
      Worker.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return Response.json({
      success: true,
      users: workers.map((w) => ({
        _id: String(w._id),
        name: w.name,
        mobile: w.mobile,
        state: w.state,
        district: w.district,
        workType: w.workType,
        kycType: w.kycType,
        kycNumber: w.kycNumber,
        documentUrl: w.documentUrl || "",
        createdAt: w.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin users list error:", error.message);
    return dbUnavailable();
  }
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json(
      { success: false, message: "Missing user id." },
      { status: 400 }
    );
  }

  try {
    await withTimeout(connectDB());
    const worker = await Worker.findByIdAndDelete(id);
    if (!worker) {
      return Response.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }
    return Response.json({ success: true, message: "User deleted." });
  } catch (error) {
    console.error("Admin delete user error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json(
      { success: false, message: "Failed to delete user." },
      { status: 500 }
    );
  }
}