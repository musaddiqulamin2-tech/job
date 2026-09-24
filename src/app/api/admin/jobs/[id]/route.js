import connectDB from "../../../../lib/mongodb";
import Job from "../../../../lib/models/Job";
import { getSession, unauthorized } from "../../../../lib/auth";
import { withTimeout, dbUnavailable, isDbError } from "../../../../lib/db";
import { jobStatus, JOB_STATUSES } from "../../../../lib/admin";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await params;

  try {
    await withTimeout(connectDB());
    const job = await Job.findById(id).lean();
    if (!job) {
      return Response.json(
        { success: false, message: "Job not found." },
        { status: 404 }
      );
    }
    return Response.json({
      success: true,
      job: { ...job, _id: String(job._id), status: jobStatus(job) },
    });
  } catch (error) {
    console.error("Admin get job error:", error.message);
    return dbUnavailable();
  }
}

export async function PUT(request, { params }) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await params;

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const updates = {};
  const stringFields = [
    "title",
    "company",
    "location",
    "salary",
    "type",
    "category",
    "tagColor",
    "description",
    "experience",
    "posted",
    "lastDate",
    "officialLink",
  ];

  for (const f of stringFields) {
    if (data[f] !== undefined) updates[f] = String(data[f]).trim();
  }
  if (Array.isArray(data.requirements)) updates.requirements = data.requirements;
  if (Array.isArray(data.responsibilities)) updates.responsibilities = data.responsibilities;
  if (data.featured !== undefined) updates.featured = Boolean(data.featured);
  if (data.vacancies !== undefined) {
    const n = Number(data.vacancies);
    updates.vacancies = Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  }
  if (data.status !== undefined) {
    updates.status = JOB_STATUSES.includes(data.status) ? data.status : "Active";
    updates.active = updates.status === "Active";
  }

  try {
    await withTimeout(connectDB());
    const job = await Job.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!job) {
      return Response.json(
        { success: false, message: "Job not found." },
        { status: 404 }
      );
    }
    return Response.json({
      success: true,
      job: { ...job.toObject(), _id: String(job._id), status: jobStatus(job) },
      message: "Job updated successfully.",
    });
  } catch (error) {
    console.error("Admin update job error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json(
      { success: false, message: "Failed to update job." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await params;

  try {
    await withTimeout(connectDB());
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return Response.json(
        { success: false, message: "Job not found." },
        { status: 404 }
      );
    }
    return Response.json({ success: true, message: "Job deleted." });
  } catch (error) {
    console.error("Admin delete job error:", error.message);
    if (isDbError(error)) return dbUnavailable();
    return Response.json(
      { success: false, message: "Failed to delete job." },
      { status: 500 }
    );
  }
}