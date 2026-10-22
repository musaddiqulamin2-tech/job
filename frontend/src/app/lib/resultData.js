import { apiFetch } from "./api";

export const RESULT_LIMIT = 12;

export async function loadResultPage(page, limit = RESULT_LIMIT) {
  const current = Math.max(1, Number(page) || 1);
  try {
    const res = await apiFetch(
      `/api/site/category-jobs?type=result&page=${current}&limit=${limit}`
    );
    if (!res.ok) throw new Error("results-unavailable");
    const data = await res.json();
    const posts = Array.isArray(data.posts) ? data.posts : [];
    return {
      posts,
      total: Number(data.total) || posts.length,
    };
  } catch {
    return { posts: [], total: 0 };
  }
}

export async function loadResultTotal() {
  try {
    const res = await apiFetch(`/api/site/category-jobs?type=result&page=1&limit=1`);
    if (!res.ok) throw new Error("results-unavailable");
    const data = await res.json();
    return Number(data.total) || 0;
  } catch {
    return 0;
  }
}

export function resultTotalPages(totalPostCount) {
  return Math.max(1, Math.ceil(totalPostCount / RESULT_LIMIT));
}