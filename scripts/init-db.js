import mongoose from "mongoose";

import Admin from "../src/app/lib/models/Admin.js";
import SiteSetting from "../src/app/lib/models/SiteSetting.js";
import Category, { DEFAULT_CATEGORIES } from "../src/app/lib/models/Category.js";
import Post from "../src/app/lib/models/Post.js";
import Media from "../src/app/lib/models/Media.js";

const readEnv = (key, fallback = "") => process.env[key] || fallback;

async function ensureIndexes() {
  const postCol = Post.collection;
  const categoryCol = Category.collection;
  const mediaCol = Media.collection;

  await postCol.createIndex({ slug: 1 }, { unique: true });
  await postCol.createIndex({ status: 1, category: 1, publishedAt: -1 });
  await postCol.createIndex({ status: 1, publishedAt: -1 });
  await postCol.createIndex({ category: 1, createdAt: -1 });
  await postCol.createIndex({ title: "text", organization: "text", tags: "text" });

  await categoryCol.createIndex({ slug: 1 }, { unique: true });
  await categoryCol.createIndex({ enabled: 1, order: 1 });

  await mediaCol.createIndex({ createdAt: -1 });

  console.log("Indexes ensured (posts, categories, media).");
}

async function seedCategories() {
  for (const cat of DEFAULT_CATEGORIES) {
    await Category.updateOne(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true }
    );
  }
  console.log(`Seeded ${DEFAULT_CATEGORIES.length} default categories.`);
}

async function seedSettings() {
  await SiteSetting.updateOne(
    { key: "general" },
    {
      $setOnInsert: {
        siteName: "JobCareer",
        siteTagline: "Find your dream job today!",
        contactEmail: readEnv("CONTACT_EMAIL", ""),
        contactPhone: readEnv("CONTACT_PHONE", ""),
        footerText: "Connecting talent with opportunity. Your dream job is just one click away.",
        homepageCategories: ["government-job", "private-job", "admit-card", "result", "admission"],
        featuredSlots: { enabled: false, count: 4 },
        postOrder: "latest",
        notifications: { newApplication: true, weeklyDigest: true, emailAlerts: false, jobExpiry: true },
      },
    },
    { upsert: true }
  );
  console.log("Default site settings ensured.");
}

async function seedAdmin() {
  const email = readEnv("ADMIN_EMAIL");
  const password = readEnv("ADMIN_PASSWORD");
  const name = readEnv("ADMIN_NAME", "Admin");

  if (!email || !password) {
    console.warn("Skipping admin seed: set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local");
    return;
  }

  const bcrypt = (await import("bcryptjs")).default;
  const normalized = email.trim().toLowerCase();
  const hash = await bcrypt.hash(password.trim(), 10);

  await Admin.updateOne(
    { email: normalized },
    { $set: { email: normalized, passwordHash: hash, name, role: "admin" } },
    { upsert: true }
  );
  console.log(`Admin ensured: ${normalized}`);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI missing from .env.local");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
    console.log("Connected to MongoDB.");
    await ensureIndexes();
    await seedCategories();
    await seedSettings();
    await seedAdmin();
    console.log("init-db completed successfully.");
  } catch (error) {
    console.error("init-db error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

main();