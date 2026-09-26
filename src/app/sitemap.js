import { CMS_LISTING_META } from "./(site)/cms/meta";

const BASE = process.env.SITE_URL || "https://jobcareer.in";

export const dynamic = "force-dynamic";

const STATIC_USABLE = [
  "/", "/apply", "/contact", "/terms", "/privacy", "/disclaimer",
  "/jobs", "/government-jobs", "/private-jobs", "/admit-cards",
  "/results", "/admissions", "/answer-keys", "/syllabus",
];

export default async function sitemap() {
  const staticEntries = STATIC_USABLE.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "/" ? 1 : 0.8,
  }));

  let postEntries = [];
  try {
    const posts = await import("./lib/cms").then(({ listPublishedPosts }) =>
      listPublishedPosts({ page: 1, limit: 100 })
    );
    postEntries = (posts.posts || []).map((post) => ({
      url: `${BASE}/post/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || new Date(),
      changeFrequency: "weekly" ,
      priority: 0.64,
    }));
  } catch (error) {
    console.error("sitemap db error:", error.message);
  }

  return [...staticEntries, ...postEntries];
}