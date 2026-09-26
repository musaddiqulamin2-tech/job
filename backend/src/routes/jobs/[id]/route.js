import { expressify } from "../../../compat.js";
import connectDB from "../../../lib/mongodb.js";
import Job from "../../../lib/models/Job.js";
import { withTimeout } from "../../../lib/db.js";
import { jobStatus } from "../../../lib/admin.js";

export async function GET(_request, { params }) {
  const { id } = params;
  try {
    await withTimeout(connectDB());
    const job = await Job.findById(String(id)).lean();
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
    console.error("Job detail error:", error.message);
    return Response.json(
      { success: false, message: "Failed to load job." },
      { status: 500 }
    );
  }
}

import { Router } from "express";
const router = Router();
router.get("/:id", expressify(GET));
export default router;