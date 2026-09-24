import connectDB from "../../../lib/mongodb";
import Application from "../../../lib/models/Application";
import Job from "../../../lib/models/Job";
import { getSession, unauthorized } from "../../../lib/auth";
import { withTimeout, dbUnavailable } from "../../../lib/db";
import { jobStatus } from "../../../lib/admin";

export const dynamic = "force-dynamic";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  try {
    await withTimeout(connectDB());

    const [totalApplications, weeklyApplications, totalJobs, activeJobs, jobCategories] =
      await Promise.all([
        Application.countDocuments(),
        Application.countDocuments({ createdAt: { $gte: weekStart } }),
        Job.countDocuments(),
        Job.countDocuments({ status: { $ne: "Inactive" }, active: { $ne: false } }),
        Job.distinct("category"),
      ]);

    const [recentApplications, openJobs, dailyCounts, jobCounts] = await Promise.all([
      Application.find().sort({ createdAt: -1 }).limit(6).lean(),
      Job.find().sort({ createdAt: -1 }).limit(5).lean(),
      Application.aggregate([
        { $match: { createdAt: { $gte: weekStart } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
      ]),
      Application.aggregate([
        { $group: { _id: "$jobTitle", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      days.push({ day: d, next });
    }

    const perDay = days.map(({ day, next }) => {
      const match = dailyCounts.find(
        (c) =>
          c._id.year === day.getFullYear() &&
          c._id.month === day.getMonth() + 1 &&
          c._id.day === day.getDate()
      );
      return { label: formatDate(day), value: match ? match.count : 0 };
    });

    const jobTotals = jobCounts.reduce((sum, j) => sum + j.count, 0);
    const perJob = jobCounts.map((j) => ({
      title: j._id,
      count: j.count,
      percent: jobTotals ? Math.round((j.count / jobTotals) * 100) : 0,
    }));

    return Response.json({
      success: true,
      stats: {
        totalApplications,
        weeklyApplications,
        totalJobs,
        activeJobs,
        jobCategories: jobCategories.length,
      },
      perDay,
      perJob,
      recentApplications: recentApplications.map((app) => ({
        _id: String(app._id),
        fullName: app.fullName,
        jobTitle: app.jobTitle,
        photoUrl: app.photoUrl || "",
        status: app.status || "Pending",
        createdAt: app.createdAt,
      })),
      openJobs: openJobs.map((job) => ({
        _id: String(job._id),
        title: job.title,
        company: job.company,
        location: job.location,
        status: jobStatus(job),
        createdAt: job.createdAt,
      })),
    });
  } catch (error) {
    console.error("Admin dashboard error:", error.message);
    return dbUnavailable();
  }
}