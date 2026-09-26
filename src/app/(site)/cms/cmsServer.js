import connectDB from "../../lib/mongodb";
import { withTimeout } from "../../lib/db";
import { listPublishedPosts, getPublishedPost } from "../../lib/cms";
import { POST_CATEGORY_META } from "../../lib/postMeta";

export const PAGE_SIZE = 12;

export async function getListing(category, page = 1) {
  const safePage = Math.max(1, Number(page) || 1);
  try {
    await withTimeout(connectDB());
    return await listPublishedPosts({ category: category || undefined, page: safePage, limit: PAGE_SIZE });
  } catch (error) {
    console.error("CMS listing db error:", error.message);
    return { posts: [], total: 0, page: safePage, limit: PAGE_SIZE, totalPages: 0 };
  }
}

export async function getPostBySlug(slug) {
  try {
    await withTimeout(connectDB());
    return await getPublishedPost(slug);
  } catch (error) {
    console.error("CMS detail db error:", error.message);
    return null;
  }
}

export async function getRelatedPosts(category, slug, limit = 4) {
  try {
    await withTimeout(connectDB());
    const { posts } = await listPublishedPosts({ category, page: 1, limit: limit + 4 });
    return posts.filter((p) => p.slug !== slug).slice(0, limit);
  } catch (error) {
    return [];
  }
}

export function categoryLabel(slug) {
  return POST_CATEGORY_META[slug]?.plural || POST_CATEGORY_META[slug]?.label || "Jobs";
}