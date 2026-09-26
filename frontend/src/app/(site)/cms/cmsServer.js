import { apiFetch } from "../../lib/api";
import { POST_CATEGORY_META } from "../../lib/postMeta";

export const PAGE_SIZE = 12;

const EMPTY_RESULT = { posts: [], total: 0, page: 1, limit: PAGE_SIZE, totalPages: 0 };

export async function getListing(category, page = 1) {
  const safePage = Math.max(1, Number(page) || 1);
  try {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    params.set("page", String(safePage));
    params.set("limit", String(PAGE_SIZE));
    const res = await apiFetch(`/api/site/posts?${params.toString()}`);
    if (!res.ok) throw new Error("cms-unavailable");
    const data = await res.json();
    if (!data || data.success === false) return EMPTY_RESULT;
    return {
      posts: Array.isArray(data.posts) ? data.posts : [],
      total: Number(data.total) || 0,
      page: safePage,
      limit: PAGE_SIZE,
      totalPages: Number(data.totalPages) || 0,
    };
  } catch (error) {
    console.error("CMS listing error:", error.message);
    return EMPTY_RESULT;
  }
}

export async function getPostBySlug(slug) {
  try {
    const res = await apiFetch(`/api/site/posts/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.success !== false && data.post ? data.post : null;
  } catch (error) {
    console.error("CMS detail error:", error.message);
    return null;
  }
}

export async function getRelatedPosts(category, slug, limit = 4) {
  try {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    params.set("page", "1");
    params.set("limit", String(limit + 4));
    const res = await apiFetch(`/api/site/posts?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    const posts = Array.isArray(data.posts) ? data.posts : [];
    return posts.filter((p) => p.slug !== slug).slice(0, limit);
  } catch {
    return [];
  }
}

export function categoryLabel(slug) {
  return POST_CATEGORY_META[slug]?.plural || POST_CATEGORY_META[slug]?.label || "Jobs";
}