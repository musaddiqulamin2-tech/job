import connectDB from "../../../lib/mongodb";
import Job from "../../../lib/models/Job";
import { getSession, unauthorized } from "../../../lib/auth";
import { withTimeout, dbUnavailable, isDbError } from "../../../lib/db";
import { jobStatus, JOB_STATUSES } from "../../../lib/admin";

export const dynamic = "force-dynamic";

function buildQuery(params) {
  const query = {};
  const q = params.q || "";

  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [
      { title: regex },
      { company: regex },
      { location: regex },
      { category: regex },
    ];
  }

  if (params.category) {
    query.category = new RegExp(params.category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  }

  if (params.status) {
    if (params.status === "Inactive") {
      query.$or = [{ status: "Inactive" }, { active: false }];
    } else if (params.status === "Expired") {
      query.status = "Expired";
    } else if (params.status === "Active") {
      query.$or = [
        { status: "Active", active: { $ne: false } },
        { status: { $exists: false }, active: { $ne: false } },
      ];
    }
  }

  return query;
}

export async function GET(request) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { searchParams } = new URL(request.url);
  const params = {
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    status: searchParams.get("status") || "",
  };
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") || "10", 10) || 10)
  );

  try {
    await withTimeout(connectDB());
    const query = buildQuery(params);

    const [total, jobs] = await Promise.all([
      Job.countDocuments(query),
      Job.find(query)
        .sort({ featured: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return Response.json({
      success: true,
      jobs: jobs.map((job) => ({ ...job, _id: String(job._id), status: jobStatus(job) })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin jobs list error:", error.message);
    return dbUnavailable();
  }
}

const REQUIRED = ["title", "company", "location"];

function cleanPayload(data) {
  const clean = {};
  const stringFields = [
    "title",
    "company",
    "location",
    "salary",
    "type",
    "category",
    "tagColor",
    "description",
    "requirements",
    "responsibilities",
    "experience",
    "posted",
    "lastDate",
    "officialLink",
  ];

  for (const field of stringFields) {
    if (data[field] !== undefined) clean[field] = String(data[field]).trim();
  }

  if (data.vacancies !== undefined) {
    const n = Number(data.vacancies);
    clean.vacancies = Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  }

  if (data.featured !== undefined) clean.featured = Boolean(data.featured);

  if (data.status !== undefined) {
    clean.status = JOB_STATUSES.includes(data.status) ? data.status : "Active";
    clean.active = clean.status === "Active";
  }

  return clean;
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return unauthorized();

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const missing = REQUIRED.filter((f) => !String(data[f] || "").trim());
  if (missing.length) {
    return Response.json(
      { success: false, message: `${missing.join(", ")} are required.` },
      { status: 400 }
    );
  }

  try {
    await withTimeout(connectDB());
    const clean = cleanPayload(data);
    const job = await Job.create({
      title: clean.title,
      company: clean.company,
      location: clean.location,
      salary: clean.salary || "",
      type: clean.type || "Full Time",
      category: clean.category || "Technology",
      tagColor: clean.tagColor || "teal",
      description: clean.description || "",
      requirements: [],
      responsibilities: [],
      experience: clean.experience || "",
      posted: clean.posted || "Just now",
      featured: clean.featured || false,
      status: clean.status || "Active",
      active: clean.active !== undefined ? clean.active : true,
      vacancies: clean.vacancies || 0,
      lastDate: clean.lastDate || "",
      officialLink: clean.officialLink || "",
    });

    return Response.json(
      { success: true, job: { ...job.toObject(), _id: String(job._id) }, message: "Job created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin create job error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json(
      { success: false, message: "Failed to create job." },
      { status: 500 }
    );
  }
}