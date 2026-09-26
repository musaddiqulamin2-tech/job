import connectDB from "../../lib/mongodb";
import Job from "../../lib/models/Job";
import { getSampleJobs } from "../../lib/categoryData";
import { getSession, unauthorized } from "../../lib/auth";

const DB_TIMEOUT_MS = 2000;

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("db-timeout")), ms)),
  ]);
}

const TOKEN_ALIASES = {
  defence: ["defence", "defense", "army", "navy", "air force", "airforce", "coast guard", "rpf", "bsf", "constable", "agniveer"],
  bank: ["bank"],
  it: ["it", "computer", "software", "tech"],
  railway: ["railway", "rail"],
  police: ["police"],
  teaching: ["teaching", "teacher", "tet"],
};

function tokenMatches(haystack, token) {
  const aliases = TOKEN_ALIASES[token] || [token];
  return aliases.some((alias) => {
    if (alias.length < 3) {
      return new RegExp(`\\b${alias}\\b`).test(haystack);
    }
    return haystack.includes(alias);
  });
}

function searchStaticJobs(q, location, category) {
  let jobs = getSampleJobs();
  const includes = (value, needle) =>
    value && value.toLowerCase().includes(needle);

  if (q) {
    const segments = q
      .toLowerCase()
      .split("/")
      .map((s) => s.trim())
      .filter(Boolean);
    jobs = jobs.filter((job) => {
      const haystack = [job.title, job.company, job.org, job.jobType, job.category, job.location]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return segments.some((segment) => {
        const tokens = segment.split(/\s+/).filter((t) => t.length > 0);
        return tokens.every((token) => tokenMatches(haystack, token));
      });
    });
  }
  if (location) {
    const loc = location.toLowerCase().trim();
    jobs = jobs.filter((j) => includes(j.location, loc));
  }
  if (category) {
    const cat = category.toLowerCase().trim();
    jobs = jobs.filter(
      (j) => includes(j.category, cat) || includes(j.title, cat)
    );
  }
  return jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const { q, location, category } = Object.fromEntries(searchParams);

  if (id) {
    try {
      await withTimeout(connectDB(), DB_TIMEOUT_MS);
      const job = await Job.findById(id);
      if (!job) {
        return Response.json(
          { success: false, message: "Job not found" },
          { status: 404 }
        );
      }
      return Response.json({ success: true, job });
    } catch (err) {
      const job = getSampleJobs().find((j) => j._id === id || j.slug === id);
      if (!job) {
        return Response.json(
          { success: false, message: "Job not found" },
          { status: 404 }
        );
      }
      return Response.json({ success: true, job });
    }
  }

  try {
    await withTimeout(connectDB(), DB_TIMEOUT_MS);

    const query = {};
    if (q) {
      const regex = new RegExp(q, "i");
      query.$or = [{ title: regex }, { company: regex }, { category: regex }];
    }
    if (location) {
      query.location = new RegExp(location, "i");
    }
    if (category) {
      const catRegex = new RegExp(category, "i");
      query.$or = [{ category: catRegex }, { title: catRegex }];
    }

    const jobs = await Job.find(query).sort({ featured: -1, createdAt: -1 });

    let cmsPosts = [];
    try {
      const { listPublishedPosts } = await import("../../lib/cms");
      const { posts } = await listPublishedPosts({ page: 1, limit: 10 });
      cmsPosts = (posts || []).map((p) => ({
        _source: "cms",
        _id: `cms-${p.slug}`,
        slug: p.slug,
        title: p.title,
        category: p.category,
        location: p.location,
        company: p.organization,
        org: p.organization,
        summary: p.summary,
        lastDate: p.lastDate,
        vacancyCount: p.vacancyCount,
        featuredImage: p.featuredImage,
        publishedAt: p.publishedAt,
        createdAt: p.publishedAt || p.createdAt,
      }));
    } catch (cmsErr) {
      console.error("Get CMS posts Error:", cmsErr.message);
    }

    return Response.json({ success: true, jobs, cmsPosts, cmsCount: cmsPosts.length });
  } catch (error) {
    if (error.message !== "db-timeout") {
      console.error("Get Jobs Error:", error);
    }
    return Response.json({ success: true, jobs: searchStaticJobs(q, location, category), cmsPosts: [], cmsCount: 0 });
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return unauthorized();

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
  const session = await getSession();
  if (!session) return unauthorized();

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
