import bcrypt from "bcryptjs";
import connectDB from "../../../lib/mongodb";
import Admin from "../../../lib/models/Admin";
import { signToken, setSessionCookie } from "../../../lib/auth";
import { withTimeout } from "../../../lib/db";

export async function POST(request) {
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

  try {
    const token = await signToken(adminDoc);
    await setSessionCookie(token);

    const now = new Date();

    return Response.json({
      success: true,
      message: "Logged in successfully.",
      admin: {
        id: String(adminDoc._id),
        name: adminDoc.name || "Admin",
        email: adminDoc.email,
        lastLoginAt: now.toISOString(),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { success: false, message: "Unable to log in right now." },
      { status: 500 }
    );
  }
}