import { apiFetch } from "./api";
import { getSampleResults, getResultPage } from "./categoryData";

export const RESULT_LIMIT = 12;

export async function loadResultPage(page, limit = RESULT_LIMIT) {
  const current = Math.max(1, Number(page) || 1);
  try {
    const res = await apiFetch(
      `/api/site/category-jobs?type=result&page=${current}&limit=${limit}`
    );
    if (!res.ok) throw new Error("results-unavailable");
    const data = await res.json();
    if (data.success !== false && Number(data.total) === 0) {
      return {
        posts: getResultPage(current, limit),
        total: getSampleResults().length,
      };
    }
    return {
      posts: Array.isArray(data.posts) ? data.posts : getResultPage(current, limit),
      total: Number(data.total) || (Array.isArray(data.posts) ? data.posts.length : 0),
    };
  } catch {
    return { posts: getResultPage(current, limit), total: getSampleResults().length };
  }
}

export async function loadResultTotal() {
  try {
    const res = await apiFetch(`/api/site/category-jobs?type=result&page=1&limit=1`);
    if (!res.ok) throw new Error("results-unavailable");
    const data = await res.json();
    const total = Number(data.total) || 0;
    return total === 0 ? getSampleResults().length : total;
  } catch {
    return getSampleResults().length;
  }
}

export function resultTotalPages(totalPostCount) {
  return Math.max(1, Math.ceil(totalPostCount / RESULT_LIMIT));
}