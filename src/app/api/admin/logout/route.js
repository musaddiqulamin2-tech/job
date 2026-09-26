import { clearSessionCookie, getSession } from "../../../lib/auth";
import {
  log as liveLog,
  activity as liveActivity,
  emitEvent,
} from "../../../lib/liveServer";

export async function POST() {
  const session = await getSession();
  await clearSessionCookie();
  if (session) {
    emitEvent("admin:activity", {
      adminEmail: session.email,
      adminName: session.name || "Admin",
      action: "Admin logged out",
    });
    liveLog({ level: "INFO", source: "AuthAPI", message: `Admin logged out: ${session.email}` });
    liveActivity({ tone: "admin", message: "Admin logged out", sub: session.email });
  }
  return Response.json({ success: true, message: "Logged out successfully." });
}