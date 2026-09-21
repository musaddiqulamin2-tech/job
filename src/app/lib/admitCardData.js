import { createCategoryPagination } from "./categoryPagination";
import connectDB from "./mongodb";
import AdmitCard from "./models/AdmitCard";
import {
  getAdmitCardPosts,
  getAdmitCardPage,
  getAdmitCardPost,
  enrichAdmitCard,
  canonicalAdmitCardSlug,
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
  model: AdmitCard,
  fallbackPosts: getAdmitCardPosts(),
  getFallbackPage: getAdmitCardPage,
  limit: 12,
});

export const ADMIT_CARD_LIMIT = pagination.limit;

export async function loadAdmitCardPage(page, limit = ADMIT_CARD_LIMIT) {
  const data = await pagination.loadPage(page, limit);
  return {
    posts: data.posts.map(enrichAdmitCard),
    total: data.total,
  };
}

export async function loadAdmitCardTotal() {
  return pagination.loadTotal();
}

export function admitCardTotalPages(totalPostCount) {
  return pagination.totalPages(totalPostCount);
}

async function admitCardDbLookup(slug) {
  await connectDB();
  const doc = await AdmitCard.findOne({ slug, active: true }).lean();
  if (doc) {
    return doc;
  }
  const docs = await AdmitCard.find({ active: true }).lean();
  const match = docs.find(
    (d) =>
      d.slug === slug ||
      canonicalAdmitCardSlug(d.slug) === (slug || "").replace(/-\d{4}$/, "") ||
      canonicalAdmitCardSlug(d.slug) === slug
  );
  return match || null;
}

export async function loadAdmitCard(slug) {
  try {
    const doc = await withTimeout(admitCardDbLookup(slug), DB_TIMEOUT_MS);
    if (doc) {
      return enrichAdmitCard({ ...doc });
    }
  } catch {
    // Database unavailable — fall back to the bundled static article below.
  }
  const fallback = getAdmitCardPost(slug);
  if (fallback) {
    return fallback;
  }
  return null;
}