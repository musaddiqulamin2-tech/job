// Builds the recruitment post that an admin shares from the official JobCareer
// Canvas WhatsApp Channel.
//
// The generated text contains only the job information that exists in the
// database plus the job's own page on this website. It never includes external
// application links, third-party job sites, notification PDFs or a channel
// invitation link.
//
// This module only PREPARES the text. Nothing is published to WhatsApp
// automatically — the admin copies the message or hands it to WhatsApp, and
// posts it to the Channel manually.

// Kept for the admin UI convenience link only. It is never inserted into the
// generated post itself.
export const WHATSAPP_CHANNEL_URL =
  "https://whatsapp.com/channel/0029VbE0rPK84Om7jfUDyi47";

// The WhatsApp post must link to a public job page on this domain only.
export const SITE_BASE_URL = "https://jobcareercanvas.in";

export const SITE_NAME = "JobCareer Canvas";

// Placeholders an admin might type instead of leaving a field blank. They are
// treated as empty so the post never ships a dead "N/A" line.
const BLANK_VALUES = new Set([
  "", "-", "--", "---", "n/a", "na", "nil", "none", "null", "undefined",
  "tba", "tbd", "to be announced", "coming soon", "not available",
  "not specified", "not mentioned",
]);

const MAX_SUMMARY_CHARS = 320;
const MAX_DETAIL_CHARS = 200;

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

/**
 * Removes URLs, "www." addresses and bare domains. The only link in the final
 * post is the job page added separately, so admin-written fields can never leak
 * a third-party application, notification or channel link.
 */
function stripLinks(value) {
  return String(value ?? "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\bwww\.\S+/gi, "")
    .replace(/\b[a-z0-9-]+\.(?:com|in|org|net|gov|co|io|info|edu|nic|me|app|site|online)(?:\/\S*)?/gi, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/**
 * Public URL for a job post. Admin-created jobs live at /post/[slug] (see
 * frontend/src/app/(site)/post/[slug]/page.jsx). When a post has no slug yet,
 * no link is returned — a placeholder or homepage link is never shown.
 */
export function jobPublicUrl(post) {
  const slug = clean(post?.slug).replace(/^\/+/, "");
  return slug ? `${SITE_BASE_URL}/post/${slug}` : "";
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

/** Year is taken from real post dates, never invented. */
function deriveYear(post) {
  const candidates = [
    post.lastDate,
    post.startDate,
    post.examDate,
    post.resultDate,
    post.publishedAt,
    post.scheduledAt,
    post.createdAt,
  ];
  for (const value of candidates) {
    if (!clean(value)) continue;
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return String(date.getFullYear());
  }
  return "";
}

/** "Job Title – Year". The year is only added when the title has none. */
export function jobHeading(post) {
  const title = stripLinks(clean(post?.title)) || "Job Notification";
  if (/\b(19|20)\d{2}\b/.test(title)) return title;
  const year = deriveYear(post);
  return year ? `${title} – ${year}` : title;
}

/**
 * Short, professional description built from the saved fields: the admin's own
 * summary when present, otherwise a sentence assembled from real job data.
 */
export function jobDescription(post) {
  const summary = stripLinks(clean(post?.summary));
  if (summary) return shorten(summary, MAX_SUMMARY_CHARS);

  const organization = stripLinks(clean(post?.organization));
  const location = stripLinks(clean(post?.location));
  const vacancies = clean(post?.vacancyCount);
  const qualification = stripLinks(clean(post?.qualification || post?.eligibility));
  const lastDate = clean(post?.lastDate);

  const sentences = [];
  if (organization && vacancies) {
    sentences.push(`${organization} has announced ${vacancies} vacancies${location ? ` in ${location}` : ""}.`);
  } else if (vacancies) {
    sentences.push(`${vacancies} vacancies are available${location ? ` in ${location}` : ""}.`);
  } else if (organization) {
    sentences.push(`${organization} has released a new job notification${location ? ` for ${location}` : ""}.`);
  }
  if (qualification) {
    sentences.push(`Candidates with ${shorten(qualification, 120)} qualification are eligible to apply.`);
  }
  if (lastDate) {
    sentences.push(`The last date to apply is ${lastDate}.`);
  }
  return sentences.join(" ");
}

function detailLine(emoji, label, value) {
  const text = stripLinks(clean(value));
  return text ? `${emoji} *${label}:* ${shorten(text, MAX_DETAIL_CHARS)}` : "";
}

/**
 * Generates the channel post from the real post record. Every line is
 * conditional, so fields the admin left blank are omitted instead of printing
 * undefined, null or N/A, and the only link in the message is the job's own
 * page on jobcareercanvas.in.
 */
export function generateJobWhatsAppMessage(post) {
  if (!post || typeof post !== "object") return "";

  const heading = jobHeading(post);
  const url = jobPublicUrl(post);

  const details = [
    detailLine("🏢", "Organization", post.organization),
    detailLine("👥", "Total Vacancies", post.vacancyCount),
    detailLine("📍", "Location", post.location),
    detailLine("🎓", "Qualification", post.qualification || post.eligibility),
    detailLine("💼", "Job Type", jobTypeLabel(post.category)),
    detailLine("🎂", "Age Limit", post.ageLimit),
    detailLine("💳", "Application Fee", post.applicationFee),
    detailLine("⏰", "Last Date", post.lastDate),
  ].filter(Boolean);

  const blocks = [`🚨 *${heading}*`];

  const description = jobDescription(post);
  if (description) blocks.push(description);

  if (details.length) {
    blocks.push(`*${heading} – Important Details*\n\n${details.join("\n")}`);
  }

  if (url) {
    blocks.push(`🔗 ${url}`);
  }

  blocks.push(`Follow ${SITE_NAME} for the latest job updates.`);

  return blocks.join("\n\n");
}

/**
 * Opens WhatsApp with the post pre-filled. wa.me resolves to the WhatsApp app on
 * mobile and to WhatsApp Web on desktop, so no API token is involved.
 */
export function whatsAppShareUrl(message) {
  return `https://wa.me/?text=${encodeURIComponent(message || "")}`;
}
