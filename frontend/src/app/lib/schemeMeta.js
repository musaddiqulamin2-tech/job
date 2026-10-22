export const SCHEME_CATEGORY_OPTIONS = [
  { key: "student", label: "Student" },
  { key: "education", label: "Education" },
  { key: "scholarship", label: "Scholarship" },
  { key: "farmer", label: "Farmer" },
  { key: "financial", label: "Financial Assistance" },
  { key: "government", label: "Government" },
  { key: "entrepreneurship", label: "Entrepreneurship" },
];

export const SCHEME_TYPE_OPTIONS = [
  "Central Scheme",
  "State Scheme",
  "Scholarship",
  "Financial Assistance",
  "Government Scheme",
  "Other",
];

export const SCHEME_STATUS_META = {
  draft: { label: "Draft", cls: "admin-badge-gray" },
  scheduled: { label: "Scheduled", cls: "admin-badge-blue" },
  published: { label: "Published", cls: "admin-badge-green" },
  unpublished: { label: "Unpublished", cls: "admin-badge-orange" },
};

export function schemeCategoryLabel(key) {
  return SCHEME_CATEGORY_OPTIONS.find((c) => c.key === key)?.label || "Government";
}

export function schemePublicUrl(slug) {
  return `/scheme/${slug}`;
}

export function formatSchemeDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
