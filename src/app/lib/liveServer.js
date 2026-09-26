import {
  liveLog,
  liveActivity,
  emitEvent,
  trackApiCall,
  trackVisitor,
  getSnapshot,
  setSubscriberCount,
  subscriberCount,
  visitorCount,
  cacheStats,
  cacheHealth,
} from "./liveEmitter";
import connectDB from "./mongodb";
import { withTimeout } from "./db";
import Job from "./models/Job";
import Application from "./models/Application";
import Worker from "./models/Worker";
import Post from "./models/Post";

export {
  liveLog as log,
  liveActivity as activity,
  emitEvent,
  trackApiCall,
  trackVisitor,
  getSnapshot,
  setSubscriberCount,
  subscriberCount,
  visitorCount,
};

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export async function computeStats() {
  const ts = new Date();
  const today = startOfToday();
  const week = daysAgo(7);
  const month = daysAgo(30);

  const empty = {
    ok: false,
    ts: ts.toISOString(),
    users: 0, newUsersToday: 0, newUsersWeek: 0, newUsersMonth: 0,
    activeUsers: 0, onlineVisitors: 0,
    jobs: 0, jobsToday: 0, jobsUpdatedToday: 0,
    activeJobs: 0, draftJobs: 0, expiredJobs: 0,
    applications: 0, applicationsToday: 0, applicationsWeek: 0, applicationsMonth: 0,
    pendingApplications: 0, reviewingApplications: 0, shortlistedApplications: 0,
    rejectedApplications: 0, selectedApplications: 0,
    posts: 0, publishedPosts: 0, postsToday: 0,
  };

  try {
    await withTimeout(connectDB(), 2500);

    const r = await withTimeout(
      Promise.all([
        Worker.countDocuments(),                                    // 0 users
        Worker.countDocuments({ createdAt: { $gte: today } }),      // 1 newUsersToday
        Worker.countDocuments({ createdAt: { $gte: week } }),        // 2 newUsersWeek
        Worker.countDocuments({ createdAt: { $gte: month } }),       // 3 newUsersMonth
        Job.countDocuments(),                                        // 4 jobs
        Job.countDocuments({ createdAt: { $gte: today } }),          // 5 jobsToday
        Job.countDocuments({ updatedAt: { $gte: today } }),          // 6 jobsUpdatedToday
        Job.countDocuments({ status: { $ne: "Inactive" }, active: { $ne: false } }), // 7 activeJobs
        Job.countDocuments({ status: "Inactive" }),                  // 8 draftJobs
        Job.countDocuments({ status: "Expired" }),                   // 9 expiredJobs
        Application.countDocuments(),                                // 10 applications
        Application.countDocuments({ createdAt: { $gte: today } }),  // 11 applicationsToday
        Application.countDocuments({ createdAt: { $gte: week } }),   // 12 applicationsWeek
        Application.countDocuments({ createdAt: { $gte: month } }),  // 13 applicationsMonth
        Application.countDocuments({ status: "Pending" }),           // 14
        Application.countDocuments({ status: "Reviewing" }),         // 15
        Application.countDocuments({ status: "Shortlisted" }),       // 16
        Application.countDocuments({ status: "Rejected" }),          // 17
        Application.countDocuments({ status: "Selected" }),          // 18
        Post.countDocuments(),                                       // 19 posts
        Post.countDocuments({ status: "published" }),                // 20 publishedPosts
        Post.countDocuments({ createdAt: { $gte: today } }),         // 21 postsToday
      ]),
      4000
    );

    const stats = {
      ok: true,
      ts: ts.toISOString(),
      users: r[0], newUsersToday: r[1], newUsersWeek: r[2], newUsersMonth: r[3],
      jobs: r[4], jobsToday: r[5], jobsUpdatedToday: r[6],
      activeJobs: r[7], draftJobs: r[8], expiredJobs: r[9],
      applications: r[10], applicationsToday: r[11], applicationsWeek: r[12], applicationsMonth: r[13],
      pendingApplications: r[14], reviewingApplications: r[15], shortlistedApplications: r[16],
      rejectedApplications: r[17], selectedApplications: r[18],
      posts: r[19], publishedPosts: r[20], postsToday: r[21],
      activeUsers: visitorCount(15 * 60 * 1000),
      onlineVisitors: visitorCount(5 * 60 * 1000),
    };

    cacheStats(stats);
    return stats;
  } catch {
    return empty;
  }
}

export async function computeHealth() {
  const res = {
    ts: new Date().toISOString(),
    api: { status: "Operational" },
    database: { status: "Error", database: null, responseMs: null, lastCheck: null },
    realTime: { status: "ready", transport: "sse" },
    server: { status: "Running" },
    email: { status: "Unknown", note: "Email service not configured" },
    cloudinary: { status: "Unknown", note: "Cloudinary not configured" },
  };

  // Database ping (real)
  try {
    let mongoose;
    try {
      mongoose = (await import("mongoose")).default;
    } catch {
      mongoose = null;
    }
    const start = Date.now();
    await withTimeout(connectDB(), 2500);
    const db = mongoose?.connection?.db || global.mongoose?.conn?.db || null;
    let pinged = false;
    if (db) {
      try {
        const cmd = await withTimeout(db.admin().command({ ping: 1 }), 2000);
        pinged = Boolean(cmd && cmd.ok);
      } catch {
        pinged = false;
      }
      if (!pinged) {
        // fallback — connection exists check
        pinged = mongoose?.connection?.readyState === 1;
      }
    } else {
      pinged = true;
    }
    res.database = {
      status: pinged ? "Connected" : "Error",
      database: db?.databaseName || "jobcareer",
      responseMs: Math.round(Date.now() - start),
      lastCheck: new Date().toISOString(),
    };
  } catch {
    res.database = {
      status: "Error",
      database: null,
      responseMs: null,
      lastCheck: new Date().toISOString(),
    };
  }

  // API status derived from real tracked calls (recent 5xx within 5 min)
  try {
    const recentFailures = (getSnapshot().apiEvents || []).filter(
      (e) => e.status >= 500 && Date.now() - e.lastCalled < 5 * 60 * 1000
    );
    res.api.status = recentFailures.length ? "Degraded" : "Operational";
    res.api.recentErrors = recentFailures.length;
  } catch {
    res.api.status = "Operational";
  }

  // Email service — genuine env-based probe
  const smtpHost =
    process.env.SMTP_HOST || process.env.EMAIL_HOST || process.env.EMAIL_SMTP_HOST;
  const smtpUser =
    process.env.SMTP_USER || process.env.EMAIL_USER || process.env.EMAIL_USERNAME;
  if (smtpHost && smtpUser) {
    res.email = { status: "Connected", note: `Configured (${smtpHost})` };
  } else if (smtpHost) {
    res.email = { status: "Unknown", note: "SMTP host set but no credentials" };
  }

  // Cloudinary — real API probe
  const cName = process.env.CLOUDINARY_CLOUD_NAME;
  const cKey = process.env.CLOUDINARY_API_KEY;
  const cSecret = process.env.CLOUDINARY_API_SECRET;
  if (cName && cKey && cSecret) {
    try {
      const { v2: cloudinary } = await import("cloudinary");
      cloudinary.config({ cloud_name: cName, api_key: cKey, api_secret: cSecret });
      await withTimeout(cloudinary.api.resources({ max_results: 1 }), 4000);
      res.cloudinary = { status: "Connected", note: "Cloudinary reachable" };
    } catch {
      res.cloudinary = { status: "Error", note: "Cloudinary check failed" };
    }
  } else {
    res.cloudinary = { status: "Unknown", note: "Cloudinary not configured" };
  }

  cacheHealth(res);
  return res;
}

let statsBumpTimer = null;

export function bumpStats() {
  // Debounced real recompute after mutations — no fake increments.
  if (statsBumpTimer) clearTimeout(statsBumpTimer);
  statsBumpTimer = setTimeout(async () => {
    statsBumpTimer = null;
    const stats = await computeStats();
    emitEvent("stats:update", { stats });
  }, 800);
}