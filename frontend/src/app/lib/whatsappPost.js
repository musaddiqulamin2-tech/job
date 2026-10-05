// Builds the recruitment post that an admin shares to the official JobCareer
// WhatsApp Channel.
//
// This module only PREPARES a post. It never contacts WhatsApp, holds no Meta
// credentials and stores nothing. Publishing straight into a Channel needs an
// approved Meta WhatsApp Business integration plus a linked Channel, which this
// site does not use, so the admin copies or forwards the generated text
// themselves. Nothing here should ever claim a post reached the Channel.

export const WHATSAPP_CHANNEL_URL =
  "https://whatsapp.com/channel/0029VbE0rPK84Om7jfUDyi47";

export const SITE_BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://jobcareercanvas.in"
).replace(/\/+$/, "");

// Placeholders an admin might type instead of leaving a field blank. They are
// treated as empty so the channel post never ships a dead "N/A" line.
const BLANK_VALUES = new Set([
  "", "-", "--", "---", "n/a", "na", "nil", "none", "null", "undefined",
  "tba", "tbd", "to be announced", "coming soon", "not available",
  "not specified", "not mentioned",
]);

const SECTION_RULE = "━━━━━━━━━━━━━━━━━━";

// Recruitment channels stay readable when long paragraphs are capped and the
// reader is pointed at the full-details link instead.
const MAX_DETAIL_CHARS = 240;
const MAX_STEP_CHARS = 180;
const MAX_STEPS = 8;

function blankish(value) {
  const text = String(value).trim().toLowerCase();
  return BLANK_VALUES.has(text) || /^[-_.\s]*$/.test(text);
}

/** Normalises a scalar field to a display string, or "" when it has no value. */
export function clean(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? String(value) : "";
  }
  if (typeof value === "boolean") return "";
  const text = String(value).replace(/\s+/g, " ").trim();
  return text && !blankish(text) ? text : "";
}

/** Normalises a multi-line field into a list of non-empty entries. */
export function cleanList(value) {
  const source = Array.isArray(value) ? value : String(value ?? "").split(/\r?\n/);
  return source
    .map((entry) => String(entry ?? "").replace(/\s+/g, " ").trim())
    .filter((entry) => entry && !blankish(entry));
}

// Admin-created posts are published under /post/[slug]. Legacy submissions use
// /job/[id], so only a slug is ever used to build a public link.
export function jobPublicUrl(post) {
  const slug = clean(post?.slug).replace(/^\/+/, "");
  return slug ? `${SITE_BASE_URL}/post/${slug}` : SITE_BASE_URL;
}

/** Job type is derived from the post category, never hardcoded per post. */
export function jobTypeLabel(category) {
  switch (category) {
    case "government-job": return "Government Job";
    case "private-job": return "Private Job";
    case "admit-card": return "Admit Card";
    case "result": return "Result";
    case "admission": return "Admission";
    case "answer-key": return "Answer Key";
    case "syllabus": return "Syllabus";
    default: return "";
  }
}

/** Shortens an over-long field on a word boundary so the post stays readable. */
function shorten(text, max) {
  if (!text || text.length <= max) return text;
  const clipped = text.slice(0, max);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}

function detailLine(emoji, label, value) {
  const text = clean(value);
  return text ? `${emoji} *${label}:* ${shorten(text, MAX_DETAIL_CHARS)}` : "";
}

function publishYear(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : String(date.getFullYear());
}

function buildHashtags(post) {
  const tags = ["#JobCareer"];
  const where = `${clean(post.title)} ${clean(post.organization)} ${clean(post.location)}`;
  if (/assam/i.test(where)) tags.push("#AssamJobs");
  if (post.category === "government-job") tags.push("#GovernmentJobs");
  else if (post.category === "private-job") tags.push("#PrivateJobs");
  const fromTitle = clean(post.title).match(/\b(20\d{2})\b/);
  const year = fromTitle ? fromTitle[1] : publishYear(post.publishedAt);
  if (year) tags.push(`#Recruitment${year}`);
  return tags.join(" ");
}

/**
 * Generates the channel post text from the real post record. Every line is
 * conditional, so fields the admin left blank are omitted instead of printing
 * undefined, null or N/A.
 */
export function generateJobWhatsAppMessage(post) {
  if (!post || typeof post !== "object") return "";

  const url = jobPublicUrl(post);
  const jobType = jobTypeLabel(post.category);
  const selection = cleanList(post.selectionProcess).slice(0, MAX_STEPS);
  const blocks = [];

  blocks.push(clean(post.title) ? `🚨 *${clean(post.title)}*` : "🚨 *Job Notification*");

  const details = [
    detailLine("🏢", "Organization", post.organization),
    detailLine("📌", "Post Name", post.postName),
    detailLine("📍", "Location", post.location),
    detailLine("🎓", "Qualification", post.qualification || post.eligibility),
    detailLine("💼", "Job Type", jobType),
    detailLine("💰", "Salary", post.salary),
    detailLine("👤", "Total Vacancies", post.vacancyCount),
    detailLine("💳", "Application Fee", post.applicationFee),
    detailLine("🎂", "Age Limit", post.ageLimit),
    detailLine("📅", "Application Start", post.startDate),
    detailLine("⏰", "Last Date", post.lastDate),
  ].filter(Boolean);
  if (details.length) blocks.push(details.join("\n"));

  if (selection.length) {
    blocks.push(["📝 *Selection Process:*", ...selection.map((step) => `• ${shorten(step, MAX_STEP_CHARS)}`)].join("\n"));
  }
  if (clean(post.applicationUrl)) blocks.push(`🔗 *Apply Online:* ${clean(post.applicationUrl)}`);

  blocks.push(`📄 *Full Notification & Details:*\n${url}`);
  blocks.push(SECTION_RULE);
  blocks.push(`👉 *Check Complete Details & Apply:*\n${url}`);
  blocks.push(`📲 *Follow JobCareer on WhatsApp Channel:*\n${WHATSAPP_CHANNEL_URL}`);
  blocks.push(SECTION_RULE);
  blocks.push(buildHashtags(post));

  return blocks.filter(Boolean).join("\n\n");
}

/**
 * Opens WhatsApp with the post pre-filled. wa.me resolves to the WhatsApp app on
 * mobile and to WhatsApp Web on desktop, so no API token is involved.
 */
export function whatsAppShareUrl(message) {
  return `https://wa.me/?text=${encodeURIComponent(message || "")}`;
}