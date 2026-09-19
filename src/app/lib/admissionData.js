import { createCategoryPagination } from "./categoryPagination";
import Admission from "./models/Admission";
import {
  admissionPosts,
  getAdmissionPage,
} from "./categoryData";

const pagination = createCategoryPagination({
  model: Admission,
  fallbackPosts: admissionPosts,
  getFallbackPage: getAdmissionPage,
  limit: 12,
});

export const ADMISSION_LIMIT = pagination.limit;

export async function loadAdmissionPage(page, limit = ADMISSION_LIMIT) {
  return pagination.loadPage(page, limit);
}

export async function loadAdmissionTotal() {
  return pagination.loadTotal();
}

export function admissionTotalPages(totalPostCount) {
  return pagination.totalPages(totalPostCount);
}