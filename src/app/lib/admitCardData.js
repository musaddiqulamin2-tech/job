import { createCategoryPagination } from "./categoryPagination";
import AdmitCard from "./models/AdmitCard";
import {
  getAdmitCardPosts,
  getAdmitCardPage,
} from "./categoryData";

const pagination = createCategoryPagination({
  model: AdmitCard,
  fallbackPosts: getAdmitCardPosts(),
  getFallbackPage: getAdmitCardPage,
  limit: 12,
});

export const ADMIT_CARD_LIMIT = pagination.limit;

export async function loadAdmitCardPage(page, limit = ADMIT_CARD_LIMIT) {
  return pagination.loadPage(page, limit);
}

export async function loadAdmitCardTotal() {
  return pagination.loadTotal();
}

export function admitCardTotalPages(totalPostCount) {
  return pagination.totalPages(totalPostCount);
}