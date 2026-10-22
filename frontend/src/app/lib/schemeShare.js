// Builds the Government Scheme post that an admin shares from the official
// JobCareer Canvas WhatsApp Channel.
//
// The generated text contains only information stored on the scheme record plus
// the scheme's own page on this website. It never includes official portal
// links, notification PDFs, third-party scheme sites or channel invite links —
// those stay on the website details page.
//
// This module only PREPARES the text. Nothing is published to WhatsApp
// automatically. The admin copies the message, attaches the poster and posts it
// to the Channel manually.

import {
  SITE_BASE_URL,
  SITE_NAME,
  clean,
  cleanList,
} from "./whatsappPost";

export const SCHEME_SHARE_STATUSES = ["draft", "ready", "share-opened", "published"];

export const SCHEME_SHARE_STATUS_META = {
  "": { label: "Not Generated", cls: "admin-badge-gray" },
  draft: { label: "Draft", cls: "admin-badge-gray" },
  ready: { label: "Ready to Share", cls: "admin-badge-blue" },
  "share-opened": { label: "Share Link Opened", cls: "admin-badge-orange" },
  published: { label: "Manually Confirmed Published", cls: "admin-badge-green" },
};

const MAX_DESCRIPTION_CHARS = 260;
const MAX_FACT_CHARS = 190;

/** Removes URLs and bare domains from admin-written fields. */
function stripLinks(value) {
  return String(value ?? "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\bwww\.\S+/gi, "")
    .replace(/\b[a-z0-9-]+\.(?:com|in|org|net|gov|co|io|info|edu|nic|me|app|site|online)(?:\/\S*)?/gi, "")
    .replace(/\b(?:read more|details|visit|apply|click here)\s*(?:at|on|from|:)?\s*(?=[.,;!?]|$)/gi, "")
    .replace(/\s+(?:and|or|at|on|from|for|to)\s*(?=[.,;!?]|$)/gi, "")
    .replace(/\b(?:read more|details|visit|apply|click here)\s*[:;,-]?\s*$/gi, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([.,;!?])/g, "$1")
    .replace(/^[\s:;,-]+|[\s:;,-]+$/g, "")
    .trim();
}

function shorten(text, max) {
  const value = String(text || "").trim();
  if (value.length <= max) return value;
  const clipped = value.slice(0, max);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}

/** Keeps whole sentences up to the limit so the description ends naturally. */
function firstSentences(text, max) {
  const value = String(text || "").trim();
  if (!value) return "";
  if (value.length <= max) return value;
  const sentences = value.split(/(?<=[.!?])\s+/).filter(Boolean);
  let result = "";
  for (const sentence of sentences) {
    const next = result ? `${result} ${sentence}` : sentence;
    if (next.length > max) break;
    result = next;
  }
  return result || shorten(value, max);
}

function tidySentence(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .trim();
}

function factList(values, limit = 2, maxChars = MAX_FACT_CHARS) {
  const items = cleanList(values).map(stripLinks).filter(Boolean);
  if (!items.length) return "";
  const chosen = items.slice(0, limit).join("; ");
  return shorten(tidySentence(chosen), maxChars);
}

function firstItem(values) {
  return cleanList(values).map(stripLinks).filter(Boolean)[0] || "";
}

/**
 * Scheme dates are often already written by the admin ("31 March 2027"). Keep
 * that text as-is and only normalise real ISO timestamps.
 */
export function schemeShareDate(value) {
  const text = clean(value);
  if (!text) return "";
  if (!/^\d{4}-\d{2}-\d{2}/.test(text)) return text;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/** Public URL for a scheme. Admin schemes live at /scheme/[slug]. */
export function schemePublicUrl(scheme) {
  const slug = clean(scheme?.slug).replace(/^\/+/, "");
  return slug ? `${SITE_BASE_URL}/scheme/${slug}` : "";
}

/** Year is taken from real dates on the record, never invented. */
export function schemeYear(scheme) {
  const candidates = [
    scheme?.lastDate,
    scheme?.startDate,
    scheme?.publishedAt,
    scheme?.scheduledAt,
    scheme?.createdAt,
  ];
  for (const value of candidates) {
    if (!clean(value)) continue;
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return String(date.getFullYear());
  }
  return "";
}

/** "Scheme Name 2026". The year is only added when the title has none. */
export function schemeHeading(scheme) {
  const title = stripLinks(clean(scheme?.title)) || "Government Scheme";
  if (/\b(19|20)\d{2}\b/.test(title)) return title;
  const year = schemeYear(scheme);
  return year ? `${title} ${year}` : title;
}

export function schemeEligibilitySummary(scheme) {
  return factList(scheme?.eligibility, 2, MAX_FACT_CHARS);
}

export function schemeBenefitSummary(scheme) {
  return factList(scheme?.benefits, 2, MAX_FACT_CHARS);
}

/**
 * Short, professional description. Uses the admin's summary when present, then
 * falls back to sentences built only from verified fields on the record.
 */
export function schemeDescription(scheme) {
  const summary = stripLinks(clean(scheme?.summary));
  if (summary) return firstSentences(tidySentence(summary), MAX_DESCRIPTION_CHARS);

  const heading = schemeHeading(scheme);
  const department = stripLinks(clean(scheme?.department));
  const type = stripLinks(clean(scheme?.schemeType)).toLowerCase();
  const benefit = firstItem(scheme?.benefits);

  const sentences = [];
  if (department) {
    sentences.push(`${heading} is offered by ${department}.`);
  } else if (type && type !== "government scheme") {
    sentences.push(`${heading} is a ${type} announced for eligible applicants.`);
  }
  if (benefit) {
    sentences.push(`Main benefit: ${shorten(tidySentence(benefit), 140)}.`);
  }
  if (!sentences.length) {
    sentences.push(
      `Check the complete eligibility, benefits, documents and application details for ${heading} on ${SITE_NAME}.`
    );
  }
  return firstSentences(sentences.join(" "), MAX_DESCRIPTION_CHARS);
}

/**
 * Builds the scheme detail bullets. Each line is omitted when the record has no
 * verified value, so the post never shows empty or invented fields.
 */
export function schemeDetailLines(scheme) {
  const lines = [];
  const department = stripLinks(clean(scheme?.department));
  const eligibility = schemeEligibilitySummary(scheme);
  const benefits = schemeBenefitSummary(scheme);
  const lastDate = schemeShareDate(scheme?.lastDate);

  if (department) lines.push(`- Department: ${department}`);
  if (eligibility) lines.push(`- Eligible Applicants: ${eligibility}`);
  if (benefits) lines.push(`- Benefits: ${benefits}`);
  if (lastDate) lines.push(`- Last Date: ${lastDate}`);

  return lines;
}

/**
 * Generates the Channel post from the real scheme record. The only URL in the
 * output is the scheme's own JobCareer Canvas details page.
 */
export function generateSchemeWhatsAppMessage(scheme) {
  if (!scheme || typeof scheme !== "object") return "";

  const heading = schemeHeading(scheme);
  const url = schemePublicUrl(scheme);
  const details = schemeDetailLines(scheme);

  const blocks = [`🚨 *${heading}*`];

  const description = schemeDescription(scheme);
  if (description) blocks.push(description);

  if (details.length) {
    blocks.push(["📌 *Scheme Details*", ...details].join("\n"));
  }

  if (url) {
    blocks.push(["🔗 *Read Full Details:*", url].join("\n"));
  }

  blocks.push(
    `Follow ${SITE_NAME} for the latest Government Schemes, Assam job updates, and important notifications.`
  );

  return blocks.join("\n\n");
}

/** Opens WhatsApp with the post pre-filled. No API token or automation involved. */
export function schemeWhatsAppShareUrl(message) {
  return `https://wa.me/?text=${encodeURIComponent(message || "")}`;
}
