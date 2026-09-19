import { createCategoryPagination } from "./categoryPagination";
import Result from "./models/Result";
import { getSampleResults, getResultPage } from "./categoryData";

const pagination = createCategoryPagination({
  model: Result,
  fallbackPosts: getSampleResults(),
  getFallbackPage: getResultPage,
  limit: 12,
});

export const RESULT_LIMIT = pagination.limit;

export async function loadResultPage(page, limit = RESULT_LIMIT) {
  const data = await pagination.loadPage(page, limit);
  // Preserve the original behaviour: an empty database falls back to the
  // bundled sample results instead of rendering an empty list.
  if (data.total === 0) {
    return { posts: getResultPage(page, limit), total: getSampleResults().length };
  }
  return data;
}

export async function loadResultTotal() {
  const total = await pagination.loadTotal();
  return total === 0 ? getSampleResults().length : total;
}

export function resultTotalPages(totalPostCount) {
  return pagination.totalPages(totalPostCount);
}