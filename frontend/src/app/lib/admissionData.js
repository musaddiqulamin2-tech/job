import { apiFetch } from "./api";
import {
  admissionPosts,
  getAdmissionPage,
  getAdmissionPost,
  enrichAdmission,
} from "./categoryData";

export const ADMISSION_LIMIT = 12;

export async function loadAdmissionPage(page, limit = ADMISSION_LIMIT) {
  const current = Math.max(1, Number(page) || 1);
  try {
    const res = await apiFetch(
      `/api/site/category-jobs?type=admission&page=${current}&limit=${limit}`
    );
    if (!res.ok) throw new Error("admissions-unavailable");
    const data = await res.json();
    const posts = Array.isArray(data.posts)
      ? data.posts.map(enrichAdmission)
      : getAdmissionPage(current, limit);
    return {
      posts,
      total: Number(data.total) || (Array.isArray(data.posts) ? data.posts.length : 0),
    };
  } catch {
    return { posts: getAdmissionPage(current, limit), total: admissionPosts.length };
  }
}

export async function loadAdmissionTotal() {
  try {
    const res = await apiFetch(`/api/site/category-jobs?type=admission&page=1&limit=1`);
    if (!res.ok) throw new Error("admissions-unavailable");
    const data = await res.json();
    return Number(data.total) || admissionPosts.length;
  } catch {
    return admissionPosts.length;
  }
}

export function admissionTotalPages(totalPostCount) {
  return Math.max(1, Math.ceil(totalPostCount / ADMISSION_LIMIT));
}

export async function loadAdmission(slug) {
  try {
    const res = await apiFetch(
      `/api/site/entity/admission/${encodeURIComponent(slug)}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.post) return data.post;
    }
  } catch {
    // fall through to static fallback
  }
  return getAdmissionPost(slug) || null;
}