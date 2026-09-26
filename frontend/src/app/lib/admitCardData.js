import { apiFetch } from "./api";
import {
  getAdmitCardPosts,
  getAdmitCardPage,
  getAdmitCardPost,
  enrichAdmitCard,
} from "./categoryData";

export const ADMIT_CARD_LIMIT = 12;

export async function loadAdmitCardPage(page, limit = ADMIT_CARD_LIMIT) {
  const current = Math.max(1, Number(page) || 1);
  try {
    const res = await apiFetch(
      `/api/site/category-jobs?type=admit-card&page=${current}&limit=${limit}`
    );
    if (!res.ok) throw new Error("admit-cards-unavailable");
    const data = await res.json();
    const posts = Array.isArray(data.posts)
      ? data.posts.map(enrichAdmitCard)
      : getAdmitCardPage(current, limit);
    return {
      posts,
      total: Number(data.total) || (Array.isArray(data.posts) ? data.posts.length : 0),
    };
  } catch {
    return { posts: getAdmitCardPage(current, limit), total: getAdmitCardPosts().length };
  }
}

export async function loadAdmitCardTotal() {
  try {
    const res = await apiFetch(`/api/site/category-jobs?type=admit-card&page=1&limit=1`);
    if (!res.ok) throw new Error("admit-cards-unavailable");
    const data = await res.json();
    return Number(data.total) || getAdmitCardPosts().length;
  } catch {
    return getAdmitCardPosts().length;
  }
}

export function admitCardTotalPages(totalPostCount) {
  return Math.max(1, Math.ceil(totalPostCount / ADMIT_CARD_LIMIT));
}

export async function loadAdmitCard(slug) {
  try {
    const res = await apiFetch(
      `/api/site/entity/admit-card/${encodeURIComponent(slug)}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.post) return data.post;
    }
  } catch {
    // fall through to static fallback
  }
  return getAdmitCardPost(slug) || null;
}