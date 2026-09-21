import { createCategoryPagination } from "./categoryPagination";
import connectDB from "./mongodb";
import Admission from "./models/Admission";
import {
  admissionPosts,
  getAdmissionPage,
  getAdmissionPost,
  enrichAdmission,
  canonicalAdmissionSlug,
} from "./categoryData";

const DB_TIMEOUT_MS = 2000;

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("db-timeout")), ms)
    ),
  ]);
}

const pagination = createCategoryPagination({
  model: Admission,
  fallbackPosts: admissionPosts,
  getFallbackPage: getAdmissionPage,
  limit: 12,
});

export const ADMISSION_LIMIT = pagination.limit;

export async function loadAdmissionPage(page, limit = ADMISSION_LIMIT) {
  const data = await pagination.loadPage(page, limit);
  return {
    posts: data.posts.map(enrichAdmission),
    total: data.total,
  };
}

export async function loadAdmissionTotal() {
  return pagination.loadTotal();
}

export function admissionTotalPages(totalPostCount) {
  return pagination.totalPages(totalPostCount);
}

async function admissionDbLookup(slug) {
  await connectDB();
  const doc = await Admission.findOne({ slug, active: true }).lean();
  if (doc) {
    return doc;
  }
  const docs = await Admission.find({ active: true }).lean();
  const match = docs.find(
    (d) =>
      d.slug === slug ||
      canonicalAdmissionSlug(d.slug) === (slug || "").replace(/-\d{4}$/, "") ||
      canonicalAdmissionSlug(d.slug) === slug
  );
  return match || null;
}

export async function loadAdmission(slug) {
  try {
    const doc = await withTimeout(admissionDbLookup(slug), DB_TIMEOUT_MS);
    if (doc) {
      return enrichAdmission({ ...doc });
    }
  } catch {
    // Database unavailable — fall back to the bundled static article below.
  }
  const fallback = getAdmissionPost(slug);
  if (fallback) {
    return fallback;
  }
  return null;
}