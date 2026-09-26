import Post from "./models/Post";
import { POST_STATUSES, POST_CATEGORY_SLUGS, POST_CATEGORY_META } from "./postMeta.js";

export { POST_STATUSES, POST_CATEGORY_SLUGS, POST_CATEGORY_META };

export const CMS_PUBLIC_ROUTES = {
  "government-job": "/government-jobs",
  "private-job": "/private-jobs",
  "admit-card": "/admit-cards",
  result: "/results",
  admission: "/admissions",
  "answer-key": "/answer-keys",
  syllabus: "/syllabus",
};

export const CMS_PAGE_META = {
  "government-job": {
    title: "Government Jobs 2026 – Latest Sarkari Naukri Notifications | JobCareer",
    description: "Latest central and state government job notifications, recruitment, application dates and official links on JobCareer.",
  },
  "private-job": {
    title: "Private Jobs 2026 – Latest Private Sector Jobs | JobCareer",
    description: "Latest private sector jobs, walk-in interviews, opening and application details on JobCareer.",
  },
  "admit-card": {
    title: "Admit Cards 2026 – Latest Hall Tickets & Exam Updates | JobCareer",
    description: "Latest admit cards and hall tickets for government, banking and competitive exams on JobCareer.",
  },
  result: {
    title: "Results 2026 – Latest Exam Results & Merit Lists | JobCareer",
    description: "Latest exam results, merit lists, scorecards and cut-off marks on JobCareer.",
  },
  admission: {
    title: "Admissions 2026 – Latest College & University Admissions | JobCareer",
    description: "Latest college, university and school admission updates, eligibility and application dates on JobCareer.",
  },
  "answer-key": {
    title: "Answer Keys 2026 – Latest Exam Answer Keys | JobCareer",
    description: "Latest exam answer keys and response sheets for government and competitive exams on JobCareer.",
  },
  syllabus: {
    title: "Syllabus 2026 – Latest Exam Syllabus & Pattern | JobCareer",
    description: "Latest exam syllabus, paper patterns and subject-wise topics on JobCareer.",
  },
};

export function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function safeUrl(value) {
  const v = String(value || "").trim();
  if (!v) return "";
  return /^https?:\/\/[^\s]+$/i.test(v) ? v.slice(0, 500) : "";
}

function splitLines(value) {
  if (Array.isArray(value)) {
    return value.map((x) => String(x || "").trim()).filter(Boolean).slice(0, 50);
  }
  return String(value || "")
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 50);
}

function splitTags(value) {
  if (Array.isArray(value)) return value.map(String).map((t) => t.trim()).filter(Boolean).slice(0, 20);
  return String(value || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function validatePostInput(data, existingSlug = "") {
  const errors = {};
  const title = String(data.title || "").trim();

  if (!title) errors.title = "Title is required.";
  else if (title.length > 200) errors.title = "Title must be under 200 characters.";

  if (!POST_CATEGORY_SLUGS.includes(data.category)) {
    errors.category = "Please select a valid category.";
  }

  const rawSlug = String(data.slug || "").trim() || slugify(title);
  if (!rawSlug) errors.slug = "Could not generate a slug.";
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rawSlug)) {
    errors.slug = "Slug may only contain lowercase letters, numbers and hyphens.";
  } else if (rawSlug.length > 120) errors.slug = "Slug must be under 120 characters.";
  else if (existingSlug && rawSlug !== existingSlug) {
    errors.slug = rawSlug; // collision check is done against DB by caller
  }

  if (data.status && !POST_STATUSES.includes(data.status)) {
    errors.status = "Invalid status.";
  }
  if (data.status === "scheduled" && !data.scheduledAt) {
    errors.scheduledAt = "Scheduled date is required for scheduled posts.";
  }

  const maxAge = String(data.ageLimit || "").trim().length;
  if (maxAge > 100) errors.ageLimit = "Age limit is too long.";

  if (data.importantLinks !== undefined) {
    if (!Array.isArray(data.importantLinks) || data.importantLinks.length > 20) {
      errors.importantLinks = "Important links must be an array with at most 20 items.";
    } else {
      for (const link of data.importantLinks) {
        if (!link || typeof link.label !== "string" || !link.label.trim()) {
          errors.importantLinks = "Each link needs a label.";
          break;
        }
        if (typeof link.url !== "string" || !/^https?:\/\/[^\s]+$/i.test(link.url.trim())) {
          errors.importantLinks = "Each link needs a valid http(s) URL.";
          break;
        }
      }
    }
  }

  return { errors, slug: rawSlug };
}

export function cleanPostPayload(data) {
  const importantLinks = Array.isArray(data.importantLinks)
    ? data.importantLinks
        .map((l) => ({
          label: String(l.label || "").trim().slice(0, 120),
          url: safeUrl(l.url),
          type: ["apply", "notification", "website", "admit-card", "result", "syllabus", "custom"].includes(l.type)
            ? l.type
            : "custom",
        }))
        .filter((l) => l.label && l.url)
        .slice(0, 20)
    : [];

  const author = String(data.author || "").trim().slice(0, 80) || "Admin";

  const payload = {
    title: String(data.title || "").trim().slice(0, 200),
    slug: String(data.slug || "").trim(),
    category: data.category,
    status: POST_STATUSES.includes(data.status) ? data.status : "draft",
    summary: String(data.summary || "").trim().slice(0, 500),
    featuredImage: safeUrl(data.featuredImage),
    organization: String(data.organization || "").trim().slice(0, 200),
    location: String(data.location || "").trim().slice(0, 200),
    qualification: String(data.qualification || "").trim().slice(0, 1000),
    ageLimit: String(data.ageLimit || "").trim().slice(0, 200),
    ageRelaxation: String(data.ageRelaxation || "").trim().slice(0, 500),
    vacancyCount: Math.max(0, Math.min(999999, Number(data.vacancyCount) || 0)),
    applicationFee: String(data.applicationFee || "").trim().slice(0, 500),
    paymentMode: String(data.paymentMode || "").trim().slice(0, 200),
    eligibility: String(data.eligibility || "").trim().slice(0, 2000),
    selectionProcess: splitLines(data.selectionProcess),
    howToApply: splitLines(data.howToApply),
    startDate: String(data.startDate || "").trim().slice(0, 100),
    lastDate: String(data.lastDate || "").trim().slice(0, 100),
    examDate: String(data.examDate || "").trim().slice(0, 100),
    admitCardDate: String(data.admitCardDate || "").trim().slice(0, 100),
    resultDate: String(data.resultDate || "").trim().slice(0, 100),
    officialNotificationUrl: safeUrl(data.officialNotificationUrl),
    applicationUrl: safeUrl(data.applicationUrl),
    importantLinks,
    author,
    tags: splitTags(data.tags),
    featured: Boolean(data.featured),
    seo: {
      title: String(data.seo?.title || "").trim().slice(0, 200),
      description: String(data.seo?.description || "").trim().slice(0, 300),
      canonical: safeUrl(data.seo?.canonical),
      robots: ["index, follow", "noindex, nofollow", "noindex, follow"].includes(data.seo?.robots)
        ? data.seo.robots
        : "index, follow",
      image: safeUrl(data.seo?.image),
    },
  };

  return payload;
}

export function resolveEffectiveStatus(post, now = new Date()) {
  if (post.status === "scheduled" && post.scheduledAt && new Date(post.scheduledAt) <= now) {
    return "published";
  }
  if (post.status === "published" && post.expiresAt && new Date(post.expiresAt) <= now) {
    return "expired";
  }
  return post.status;
}

export function publishedFilter(now = new Date()) {
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

export async function listPublishedPosts({ category, page = 1, limit = 12, search = "", featured = false } = {}) {
  const query = publishedFilter();
  if (category) query.category = category;
  if (featured) query.featured = true;
  if (search) {
    query.$and.push({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ],
    });
  }

  const safeLimit = Math.max(1, Math.min(100, Number(limit) || 12));
  const safePage = Math.max(1, Number(page) || 1);
  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
    .skip((safePage - 1) * safeLimit)
    .limit(safeLimit)
    .lean();

  return {
    posts,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.ceil(total / safeLimit),
  };
}

export async function getPublishedPost(slug) {
  const query = publishedFilter();
  query.slug = slug;
  const post = await Post.findOne(query).lean();
  return post || null;
}

export async function slugExists(slug, excludeId = null) {
  const q = { slug };
  if (excludeId) q._id = { $ne: excludeId };
  return Boolean(await Post.findOne(q).select("_id").lean());
}