import { createCategoryPagination } from "./categoryPagination";
import Job from "./models/Job";
import { getSampleJobs, getJobPage } from "./categoryData";

const pagination = createCategoryPagination({
  model: Job,
  fallbackPosts: getSampleJobs(),
  getFallbackPage: getJobPage,
  limit: 12,
});

export const JOB_LIMIT = pagination.limit;

export async function loadJobPage(page, limit = JOB_LIMIT) {
  const data = await pagination.loadPage(page, limit);
  // Preserve the original behaviour: an empty database falls back to the
  // bundled sample jobs instead of rendering an empty list.
  if (data.total === 0) {
    return { posts: getJobPage(page, limit), total: getSampleJobs().length };
  }
  return data;
}

export async function loadJobTotal() {
  const total = await pagination.loadTotal();
  return total === 0 ? getSampleJobs().length : total;
}

export function jobTotalPages(totalPostCount) {
  return pagination.totalPages(totalPostCount);
}