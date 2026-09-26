import { apiFetch } from "./api";
import { getSampleJobs, getJobPage } from "./categoryData";

export const JOB_LIMIT = 12;

export async function loadJobPage(page, limit = JOB_LIMIT) {
  const current = Math.max(1, Number(page) || 1);
  try {
    const res = await apiFetch(
      `/api/site/category-jobs?type=job&page=${current}&limit=${limit}`
    );
    if (!res.ok) throw new Error("jobs-unavailable");
    const data = await res.json();
    if (data.success !== false && Number(data.total) === 0) {
      return {
        posts: getJobPage(current, limit),
        total: getSampleJobs().length,
      };
    }
    return {
      posts: Array.isArray(data.posts) ? data.posts : getJobPage(current, limit),
      total: Number(data.total) || (Array.isArray(data.posts) ? data.posts.length : 0),
    };
  } catch {
    return { posts: getJobPage(current, limit), total: getSampleJobs().length };
  }
}

export async function loadJobTotal() {
  try {
    const res = await apiFetch(`/api/site/category-jobs?type=job&page=1&limit=1`);
    if (!res.ok) throw new Error("jobs-unavailable");
    const data = await res.json();
    const total = Number(data.total) || 0;
    return total === 0 ? getSampleJobs().length : total;
  } catch {
    return getSampleJobs().length;
  }
}

export function jobTotalPages(totalPostCount) {
  return Math.max(1, Math.ceil(totalPostCount / JOB_LIMIT));
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