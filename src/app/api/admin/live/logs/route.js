import { requireAdmin } from "../../../../lib/adminGuard";
import { getSnapshot } from "../../../../lib/liveServer";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const level = (searchParams.get("level") || "").toUpperCase().trim();
  const limit = Math.max(1, Math.min(1000, Number(searchParams.get("limit")) || 500));

  const snapshot = getSnapshot();
  let logs = snapshot.logs || [];

  if (level) {
    const wanted = new Set(
      level.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean)
    );
    logs = logs.filter((l) => wanted.has(l.level));
  }

  if (q) {
    logs = logs.filter(
      (l) =>
        (l.message || "").toLowerCase().includes(q) ||
        (l.source || "").toLowerCase().includes(q)
    );
  }

  return Response.json({ success: true, logs: logs.slice(0, limit) });
}