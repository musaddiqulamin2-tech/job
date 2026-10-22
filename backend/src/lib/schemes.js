import Scheme from "./models/Scheme.js";
import { slugify } from "./cms.js";

export const SCHEME_STATUSES = ["draft", "scheduled", "published", "unpublished"];

export const SCHEME_TYPES = [
  "Central Scheme",
  "State Scheme",
  "Scholarship",
  "Financial Assistance",
  "Government Scheme",
  "Other",
];

export const SCHEME_CATEGORIES = {
  student: "Student",
  education: "Education",
  scholarship: "Scholarship",
  farmer: "Farmer",
  financial: "Financial Assistance",
  government: "Government",
  entrepreneurship: "Entrepreneurship",
};

export const SCHEME_CATEGORY_KEYS = Object.keys(SCHEME_CATEGORIES);

function safeUrl(value) {
  const v = String(value || "").trim();
  if (!v) return "";
  return /^https?:\/\/[^\s]+$/i.test(v) ? v.slice(0, 500) : "";
}

function splitLines(value, max = 30) {
  if (Array.isArray(value)) {
    return value.map((x) => String(x || "").trim()).filter(Boolean).slice(0, max);
  }
  return String(value || "")
    .split(/\r?\n/)
    .map((x) => x.trim().replace(/^[-*•]\s*/, ""))
    .filter(Boolean)
    .slice(0, max);
}

function splitTags(value) {
  if (Array.isArray(value)) return value.map(String).map((t) => t.trim()).filter(Boolean).slice(0, 20);
  return String(value || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function toDateOrNull(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function cleanFaqs(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((f) => ({
      question: String(f?.question || "").trim().slice(0, 200),
      answer: String(f?.answer || "").trim().slice(0, 1200),
    }))
    .filter((f) => f.question && f.answer)
    .slice(0, 10);
}

export function validateSchemeInput(data, existingSlug = "") {
  const errors = {};
  const title = String(data?.title || "").trim();

  if (!title) errors.title = "Scheme name is required.";
  else if (title.length > 200) errors.title = "Scheme name must be under 200 characters.";

  const rawSlug = String(data?.slug || "").trim() || slugify(title);
  if (!rawSlug) errors.slug = "Could not generate a slug.";
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rawSlug)) {
    errors.slug = "Slug may only contain lowercase letters, numbers and hyphens.";
  } else if (rawSlug.length > 120) errors.slug = "Slug must be under 120 characters.";

  if (data?.status && !SCHEME_STATUSES.includes(data.status)) {
    errors.status = "Invalid status.";
  }
  if (data?.status === "scheduled" && !data?.scheduledAt) {
    errors.scheduledAt = "Scheduled date is required for scheduled schemes.";
  }

  if (!SCHEME_CATEGORY_KEYS.includes(String(data?.category || ""))) {
    errors.category = "Please select a valid category.";
  }

  if (data?.schemeType && !SCHEME_TYPES.includes(data.schemeType)) {
    errors.schemeType = "Please select a valid scheme type.";
  }

  const summary = String(data?.summary || "").trim();
  if (summary.length > 500) errors.summary = "Short description must be under 500 characters.";

  const description = String(data?.description || "").trim();
  if (description.length > 12000) errors.description = "Full description is too long.";

  const urlFields = ["officialWebsite", "applyLink", "notificationLink", "featuredImage"];
  for (const key of urlFields) {
    const raw = String(data?.[key] || "").trim();
    if (raw && !/^https?:\/\/[^\s]+$/i.test(raw)) {
      errors[key] = "Enter a valid http(s) URL.";
    }
  }

  return { errors, slug: rawSlug };
}

export function cleanSchemePayload(data) {
  const status = SCHEME_STATUSES.includes(data?.status) ? data.status : "draft";
  return {
    title: String(data?.title || "").trim().slice(0, 200),
    slug: String(data?.slug || "").trim(),
    summary: String(data?.summary || "").trim().slice(0, 500),
    description: String(data?.description || "").trim().slice(0, 12000),
    featuredImage: safeUrl(data?.featuredImage),
    department: String(data?.department || "").trim().slice(0, 200),
    schemeType: SCHEME_TYPES.includes(data?.schemeType) ? data.schemeType : "Government Scheme",
    state: String(data?.state || "").trim().slice(0, 100),
    category: SCHEME_CATEGORY_KEYS.includes(data?.category) ? data.category : "government",
    benefits: splitLines(data?.benefits, 20),
    eligibility: splitLines(data?.eligibility, 20),
    requiredDocuments: splitLines(data?.requiredDocuments, 20),
    howToApply: splitLines(data?.howToApply, 20),
    startDate: String(data?.startDate || "").trim().slice(0, 60),
    lastDate: String(data?.lastDate || "").trim().slice(0, 60),
    officialWebsite: safeUrl(data?.officialWebsite),
    applyLink: safeUrl(data?.applyLink),
    notificationLink: safeUrl(data?.notificationLink),
    faqs: cleanFaqs(data?.faqs),
    tags: splitTags(data?.tags),
    status,
    featured: Boolean(data?.featured),
    expiresAt: toDateOrNull(data?.expiresAt),
    seo: {
      title: String(data?.seo?.title || "").trim().slice(0, 200),
      description: String(data?.seo?.description || "").trim().slice(0, 300),
      canonical: safeUrl(data?.seo?.canonical),
      robots: ["index, follow", "noindex, nofollow", "noindex, follow"].includes(data?.seo?.robots)
        ? data.seo.robots
        : "index, follow",
      image: safeUrl(data?.seo?.image),
    },
  };
}

export function applySchemeStatus(payload, status, existing = null) {
  const now = new Date();
  const finalStatus = SCHEME_STATUSES.includes(status) ? status : "draft";

  if (finalStatus === "published") {
    payload.status = "published";
    payload.publishedAt = existing?.publishedAt || now;
    payload.scheduledAt = null;
  } else if (finalStatus === "scheduled") {
    payload.status = "scheduled";
    payload.publishedAt = null;
    payload.scheduledAt = toDateOrNull(payload.scheduledAtInput);
  } else {
    payload.status = finalStatus;
    payload.publishedAt = null;
    if (finalStatus === "draft") payload.scheduledAt = null;
  }

  delete payload.scheduledAtInput;
  return payload;
}

export function publishedSchemeFilter(now = new Date()) {
  return {
    $and: [
      {
        $or: [
          { status: "published", publishedAt: { $lte: now } },
          { status: "scheduled", scheduledAt: { $lte: now } },
        ],
      },
      { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
    ],
  };
}

export async function schemeSlugExists(slug, excludeId = null) {
  const query = { slug };
  if (excludeId) query._id = { $ne: excludeId };
  return Boolean(await Scheme.exists(query));
}

export async function listPublishedSchemes({ category, page = 1, limit = 12, search = "", featured = false } = {}) {
  const query = publishedSchemeFilter();
  if (category) query.category = category;
  if (featured) query.featured = true;
  if (search) {
    query.$and.push({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ],
    });
  }

  const safeLimit = Math.max(1, Math.min(100, Number(limit) || 12));
  const safePage = Math.max(1, Number(page) || 1);
  const total = await Scheme.countDocuments(query);
  const schemes = await Scheme.find(query)
    .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
    .skip((safePage - 1) * safeLimit)
    .limit(safeLimit)
    .lean();

  return {
    schemes,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.ceil(total / safeLimit),
  };
}

export async function getPublishedScheme(slug) {
  if (!slug) return null;
  const now = new Date();
  return Scheme.findOne({ slug: String(slug), ...publishedSchemeFilter(now) }).lean();
}

export function schemeStatusLabel(scheme, now = new Date()) {
  if (scheme.status === "scheduled") {
    if (!scheme.scheduledAt || new Date(scheme.scheduledAt) > now) return "Scheduled";
  }
  if (scheme.expiresAt && new Date(scheme.expiresAt) <= now) return "Closed";
  if (scheme.lastDate) return `Last Date: ${scheme.lastDate}`;
  return "Active";
}

export function publicScheme(scheme, now = new Date()) {
  if (!scheme) return null;
  const publishedAt = scheme.publishedAt || scheme.createdAt;
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";
  return {
    ...scheme,
    _id: String(scheme._id),
    org: scheme.department || "Government",
    group: scheme.category,
    date,
    statusLabel: schemeStatusLabel(scheme, now),
  };
}
