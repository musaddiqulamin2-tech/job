import bcrypt from "bcryptjs";
import connectDB from "../../../lib/mongodb";
import Admin from "../../../lib/models/Admin";
import { signToken, setSessionCookie } from "../../../lib/auth";
import { withTimeout } from "../../../lib/db";
import {
  loginRateCheck,
  recordLoginFailure,
  clearLoginFailures,
  generateCsrfToken,
  setCsrfCookie,
} from "../../../lib/security";
import {
  log as liveLog,
  activity as liveActivity,
  emitEvent,
  trackApiCall,
} from "../../../lib/liveServer";

export async function POST(request) {
  const start = Date.now();
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return Response.json(
      { success: false, message: "Email and password are required." },
      { status: 400 }
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rateKey = `${ip}:${email}`;
  const rate = loginRateCheck(rateKey);
  if (!rate.ok) {
    liveLog({ level: "WARN", source: "AuthAPI", message: "Login rate limit hit (brute-force guard triggered)" });
    trackApiCall({ method: "POST", path: "/api/admin/login", status: 429, ms: Date.now() - start });
    return Response.json(
      { success: false, message: `Too many login attempts. Please try again in ${Math.ceil(rate.retryAfterMs / 60000)} minutes.` },
      { status: 429 }
    );
  }

  const envEmail = String(process.env.ADMIN_EMAIL || "")
    .trim()
    .toLowerCase();
  const envPassword = String(process.env.ADMIN_PASSWORD || "");
  const envMatch = envEmail === email && envPassword === password;

  let adminDoc = null;
  let dbReachable = false;

  try {
    await withTimeout(connectDB());
    dbReachable = true;
    adminDoc = await withTimeout(Admin.findOne({ email }), 3000);
  } catch (error) {
    dbReachable = false;
  }

  if (adminDoc) {
    const ok = await bcrypt.compare(password, adminDoc.passwordHash);
    if (!ok) {
      recordLoginFailure(rateKey);
      liveLog({ level: "WARN", source: "AuthAPI", message: "Admin login failed (invalid password)" });
      trackApiCall({ method: "POST", path: "/api/admin/login", status: 401, ms: Date.now() - start });
      return Response.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }
  } else if (envMatch) {
    if (dbReachable) {
      try {
        const passwordHash = await bcrypt.hash(password, 10);
        adminDoc = await withTimeout(
          Admin.findOneAndUpdate(
            { email },
            {
              $set: {
                email,
                passwordHash,
                name: "Admin",
                role: "admin",
              },
            },
            { upsert: true, new: true }
          ),
          3000
        );
      } catch {
        adminDoc = { _id: "env-bootstrap", email, name: "Admin" };
      }
    } else {
      adminDoc = { _id: "env-bootstrap", email, name: "Admin" };
    }
  } else {
    recordLoginFailure(rateKey);
    liveLog({ level: "WARN", source: "AuthAPI", message: "Admin login failed (unknown account)" });
    trackApiCall({ method: "POST", path: "/api/admin/login", status: 401, ms: Date.now() - start });
    return Response.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 }
    );
  }

  if (dbReachable && adminDoc && adminDoc._id && String(adminDoc._id) !== "env-bootstrap") {
    Admin.updateOne(
      { _id: adminDoc._id },
      { $set: { lastLoginAt: new Date() } }
    ).catch(() => {});
  }

  clearLoginFailures(rateKey);

  try {
    const token = await signToken(adminDoc);
    await setSessionCookie(token);
    const csrfToken = generateCsrfToken();
    await setCsrfCookie(csrfToken);

    const now = new Date();

    emitEvent("admin:activity", {
      adminEmail: adminDoc.email,
      adminName: adminDoc.name || "Admin",
      action: "Admin logged in",
    });
    liveLog({
      level: "SUCCESS",
      source: "AuthAPI",
      message: `Admin login successful: ${adminDoc.email}`,
    });
    liveActivity({
      tone: "admin",
      message: "Admin logged in",
      sub: adminDoc.email,
      link: "/admin",
    });
    trackApiCall({ method: "POST", path: "/api/admin/login", status: 200, ms: Date.now() - start });

    return Response.json({
      success: true,
      message: "Logged in successfully.",
      csrfToken,
      admin: {
        id: String(adminDoc._id),
        name: adminDoc.name || "Admin",
        email: adminDoc.email,
        lastLoginAt: now.toISOString(),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    liveLog({ level: "ERROR", source: "AuthAPI", message: `Admin login failed (server): ${error.message}` });
    return Response.json(
      { success: false, message: "Unable to log in right now." },
      { status: 500 }
    );
  }
}