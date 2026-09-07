import connectDB from "../../lib/mongodb";
import Job from "../../lib/models/Job";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const job = await Job.findById(id);
      if (!job) {
        return Response.json(
          { success: false, message: "Job not found" },
          { status: 404 }
        );
      }
      return Response.json({ success: true, job });
    }

    const { q, location } = Object.fromEntries(searchParams);

    const query = {};
    if (q) {
      const regex = new RegExp(q, "i");
      query.$or = [{ title: regex }, { company: regex }, { category: regex }];
    }
    if (location) {
      query.location = new RegExp(location, "i");
    }

    const jobs = await Job.find(query).sort({ featured: -1, createdAt: -1 });
    return Response.json({ success: true, jobs });
  } catch (error) {
    console.error("Get Jobs Error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch jobs", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    const job = await Job.create(data);
    return Response.json({ success: true, job }, { status: 201 });
  } catch (error) {
    console.error("Create Job Error:", error);
    return Response.json(
      { success: false, message: "Failed to create job", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, message: "Missing job id" },
        { status: 400 }
      );
    }

    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, message: "Job deleted" });
  } catch (error) {
    console.error("Delete Job Error:", error);
    return Response.json(
      { success: false, message: "Failed to delete job", error: error.message },
      { status: 500 }
    );
  }
}
