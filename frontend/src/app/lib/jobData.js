import { apiFetch } from "./api";

export const JOB_LIMIT = 12;

const EMPTY_PAGE = { posts: [], total: 0 };

// The Jobs section is fed by the published CMS posts via /api/site/category-jobs.
// It must never substitute the hardcoded sample list: when there is nothing
// published the section has to render as empty rather than showing fake jobs.
export async function loadJobPage(page, limit = JOB_LIMIT) {
  const current = Math.max(1, Number(page) || 1);
  try {
    const res = await apiFetch(
      `/api/site/category-jobs?type=job&page=${current}&limit=${limit}`
    );
    if (!res.ok) throw new Error("jobs-unavailable");
    const data = await res.json();
    if (!data || data.success === false) return EMPTY_PAGE;
    const posts = Array.isArray(data.posts) ? data.posts : [];
    return { posts, total: Number(data.total) || posts.length };
  } catch {
    return EMPTY_PAGE;
  }
}

export async function loadJobTotal() {
  try {
    const res = await apiFetch(`/api/site/category-jobs?type=job&page=1&limit=1`);
    if (!res.ok) return 0;
    const data = await res.json();
    return Number(data.total) || 0;
  } catch {
    return 0;
  }
}

export function jobTotalPages(totalPostCount) {
  return Math.max(1, Math.ceil((Number(totalPostCount) || 0) / JOB_LIMIT));
}

export async function loadJob(id) {
  try {
    const res = await apiFetch(`/api/jobs/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.job ? data.job : null;
  } catch {
    return null;
  }
}