import connectDB from "./mongodb";
import { withTimeout } from "./db";

let ensuredIndexes = false;

function getModel() {
  // Lazy import to avoid any module cycle / heavy coupling at build time.
  return import("./models/SystemLog").then((m) => m.default);
}

export async function persistSystemLog(rec) {
  if (!rec || !["ERROR", "WARN"].includes(rec.level)) return false;
  try {
    await withTimeout(connectDB(), 2500);
    const SystemLog = await getModel();

    if (!ensuredIndexes) {
      try {
        await withTimeout(
          SystemLog.syncIndexes().catch(() => {}),
          3000
        );
      } catch {
        // indexes may already exist — ignore
      }
      ensuredIndexes = true;
    }

    await withTimeout(
      SystemLog.create({
        level: rec.level,
        source: rec.source || "System",
        message: rec.message || "",
        status: rec.status != null ? Number(rec.status) : null,
        requestId: rec.requestId || null,
        meta: rec.meta || null,
      }),
      3000
    );
    return true;
  } catch {
    return false;
  }
}

export async function listSystemErrors({ limit = 50 } = {}) {
  try {
    await withTimeout(connectDB(), 2500);
    const SystemLog = await getModel();
    const rows = await withTimeout(
      SystemLog.find({ level: "ERROR" }).sort({ createdAt: -1 }).limit(limit).lean(),
      3000
    );
    return rows.map((r) => ({
      _id: String(r._id),
      timestamp: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
      level: r.level,
      source: r.source,
      message: r.message,
      status: r.status,
      requestId: r.requestId,
    }));
  } catch {
    return [];
  }
}