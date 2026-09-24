import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Admin from "../src/app/lib/models/Admin.js";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "Admin";

if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
  process.exit(1);
}

if (password.length < 6) {
  console.error("ADMIN_PASSWORD must be at least 6 characters.");
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI missing from .env.local");
  process.exit(1);
}

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log("Connected to MongoDB");

    const normalized = email.trim().toLowerCase();
    const existing = await Admin.findOne({ email: normalized });

    const hash = await bcrypt.hash(password, 10);

    if (existing) {
      existing.email = normalized;
      existing.passwordHash = hash;
      existing.name = name;
      if (existing.role !== "admin") existing.role = "admin";
      await existing.save();
      console.log(`Updated admin: ${normalized}`);
    } else {
      await Admin.create({ email: normalized, passwordHash: hash, name, role: "admin" });
      console.log(`Created admin: ${normalized}`);
    }

    console.log("First-admin setup complete.");
  } catch (error) {
    console.error("Seed admin error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
  }
}

seedAdmin();