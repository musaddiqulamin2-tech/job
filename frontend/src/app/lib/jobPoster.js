// Generates a JobAssam-style recruitment poster for the WhatsApp Channel post.
//
// Everything on the poster comes from the saved job record. The layout uses the
// same brand red / dark palette as the website, and the image is produced
// entirely in the browser so no upload or extra storage is needed. When a real
// featured image already exists, the admin panel prefers that image and this
// generator is only used as an alternative.

import {
  clean,
  dedupeRepeated,
  formatFee,
  formatPostDate,
  jobHeading,
  jobTypeLabel,
} from "./whatsappPost";

const WIDTH = 1080;
const HEIGHT = 1350;
const PAD = 72;
const HEADER_H = 172;
const FONT_STACK = 'Poppins, "Segoe UI", Arial, Helvetica, sans-serif';

const COLORS = {
  ink: "#111111",
  muted: "#52525b",
  soft: "#71717a",
  line: "#e4e4e7",
  bg: "#f4f4f5",
  white: "#ffffff",
  brand: "#dc2626",
  brandDark: "#991919",
  brandBg: "#fde7e7",
};

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function waitForFonts() {
  if (typeof document === "undefined" || !document.fonts) return;
  const timeout = new Promise((resolve) => setTimeout(resolve, 1500));
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load(`800 78px "Poppins"`),
        document.fonts.load(`700 42px "Poppins"`),
        document.fonts.load(`600 26px "Poppins"`),
      ]),
      timeout,
    ]);
  } catch {
    // Fall back to the browser default sans-serif stack.
  }
}

/** Wraps text to fit maxWidth, adding an ellipsis if it cannot fit maxLines. */
function wrapText(ctx, text, maxWidth, maxLines) {
  const words = String(text || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (!words.length) return [];

  const lines = [];
  let line = "";
  for (let i = 0; i < words.length; i += 1) {
    const candidate = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = words[i];
      if (lines.length === maxLines) break;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);

  const consumed = lines.join(" ").length;
  if (consumed < words.join(" ").length && lines.length) {
    let last = lines[lines.length - 1];
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    lines[lines.length - 1] = `${last.trimEnd()}…`;
  }
  return lines.slice(0, maxLines);
}

function drawPill(ctx, { x, y, text, bg, color, font, padX = 26, h = 54 }) {
  ctx.font = font;
  const width = ctx.measureText(text).width + padX * 2;
  ctx.fillStyle = bg;
  roundRect(ctx, x, y, width, h, h / 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + padX, y + h / 2 + 1);
  ctx.textBaseline = "alphabetic";
  return width;
}

function drawStatCard(ctx, x, y, w, h, label, value) {
  ctx.fillStyle = COLORS.white;
  roundRect(ctx, x, y, w, h, 18);
  ctx.fill();
  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = COLORS.soft;
  ctx.font = `600 23px ${FONT_STACK}`;
  ctx.fillText(label.toUpperCase(), x + 26, y + 40);

  ctx.fillStyle = COLORS.ink;
  ctx.font = `700 36px ${FONT_STACK}`;
  const lines = wrapText(ctx, value, w - 52, 2);
  lines.forEach((line, index) => {
    ctx.fillText(line, x + 26, y + 78 + index * 34);
  });
}

function posterStats(post) {
  const stats = [];
  if (clean(post.vacancyCount)) stats.push(["Total Vacancies", clean(post.vacancyCount)]);
  if (formatPostDate(post.lastDate)) stats.push(["Last Date", formatPostDate(post.lastDate)]);
  if (clean(post.qualification || post.eligibility)) {
    stats.push(["Qualification", clean(post.qualification || post.eligibility)]);
  }
  if (clean(post.location)) stats.push(["Location", clean(post.location)]);
  if (clean(post.ageLimit)) stats.push(["Age Limit", clean(post.ageLimit)]);
  if (formatFee(post.applicationFee)) stats.push(["Application Fee", formatFee(post.applicationFee)]);
  return stats.slice(0, 4);
}

/**
 * Draws the poster and returns a PNG data URL. Client-only.
 */
export async function generateJobPoster(post) {
  if (typeof document === "undefined" || !post) return "";

  await waitForFonts();

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Header band.
  ctx.fillStyle = COLORS.ink;
  ctx.fillRect(0, 0, WIDTH, HEADER_H);
  ctx.fillStyle = COLORS.brand;
  ctx.fillRect(0, HEADER_H, WIDTH, 10);

  const logo = await loadImage("/brand/jobcareer-logo.png");
  if (logo) {
    ctx.save();
    roundRect(ctx, PAD, 38, 96, 96, 22);
    ctx.clip();
    ctx.drawImage(logo, PAD, 38, 96, 96);
    ctx.restore();
  }

  ctx.fillStyle = COLORS.white;
  ctx.font = `700 42px ${FONT_STACK}`;
  ctx.fillText("JobCareer Canvas", PAD + 120, 86);
  ctx.fillStyle = "#a1a1aa";
  ctx.font = `500 26px ${FONT_STACK}`;
  ctx.fillText("jobcareercanvas.in", PAD + 120, 124);

  ctx.font = `600 22px ${FONT_STACK}`;
  const badgeText = "LATEST JOB UPDATE";
  const badgeW = ctx.measureText(badgeText).width + 44;
  ctx.fillStyle = COLORS.brand;
  roundRect(ctx, WIDTH - PAD - badgeW, 60, badgeW, 52, 26);
  ctx.fill();
  ctx.fillStyle = COLORS.white;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(badgeText, WIDTH - PAD - badgeW / 2, 87);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // White content card.
  const cardX = PAD;
  const cardY = HEADER_H + 42;
  const cardW = WIDTH - PAD * 2;
  const cardH = HEIGHT - cardY - PAD;
  ctx.fillStyle = COLORS.white;
  roundRect(ctx, cardX, cardY, cardW, cardH, 26);
  ctx.fill();

  const innerX = cardX + 44;
  const innerW = cardW - 88;
  let y = cardY + 78;

  const heading = jobHeading(post);
  const yearMatch = heading.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? yearMatch[0] : "";
  const jobType = jobTypeLabel(post.category);

  let pillX = innerX;
  if (year) {
    pillX += drawPill(ctx, {
      x: pillX,
      y: y - 38,
      text: year,
      bg: COLORS.brandBg,
      color: COLORS.brandDark,
      font: `700 26px ${FONT_STACK}`,
    }) + 14;
  }
  if (jobType) {
    drawPill(ctx, {
      x: pillX,
      y: y - 38,
      text: jobType,
      bg: COLORS.ink,
      color: COLORS.white,
      font: `600 24px ${FONT_STACK}`,
    });
  }
  y += 62;

  // Job title.
  const title = clean(post.title) || "Job Notification";
  ctx.fillStyle = COLORS.ink;
  let titleSize = 74;
  if (title.length > 46) titleSize = 64;
  if (title.length > 72) titleSize = 56;
  ctx.font = `800 ${titleSize}px ${FONT_STACK}`;
  const titleLines = wrapText(ctx, title, innerW, 4);
  titleLines.forEach((line) => {
    ctx.fillText(line, innerX, y);
    y += titleSize + 16;
  });

  // Organization.
  const organization = dedupeRepeated(post.organization);
  if (organization) {
    y += 4;
    ctx.fillStyle = COLORS.muted;
    ctx.font = `600 36px ${FONT_STACK}`;
    wrapText(ctx, organization, innerW, 2).forEach((line) => {
      ctx.fillText(line, innerX, y);
      y += 46;
    });
  }

  // Key verified details.
  const stats = posterStats(post);
  const statsTop = Math.min(Math.max(y + 40, 620), 780);
  if (stats.length) {
    const gap = 22;
    const colW = (innerW - gap) / 2;
    const statH = 118;
    stats.forEach(([label, value], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      drawStatCard(
        ctx,
        innerX + col * (colW + gap),
        statsTop + row * (statH + gap),
        colW,
        statH,
        label,
        value
      );
    });
  } else {
    const summary = clean(post.summary);
    if (summary) {
      ctx.fillStyle = COLORS.muted;
      ctx.font = `500 32px ${FONT_STACK}`;
      let summaryY = statsTop + 40;
      wrapText(ctx, summary, innerW, 4).forEach((line) => {
        ctx.fillText(line, innerX, summaryY);
        summaryY += 42;
      });
    }
  }

  // Bottom call-to-action band.
  const ctaH = 142;
  const ctaY = HEIGHT - PAD - ctaH - 58;
  ctx.fillStyle = COLORS.brand;
  roundRect(ctx, cardX, ctaY, cardW, ctaH, 22);
  ctx.fill();

  ctx.fillStyle = COLORS.white;
  ctx.font = `700 38px ${FONT_STACK}`;
  ctx.fillText("Full Details & Apply Online", cardX + 40, ctaY + 58);
  ctx.font = `600 30px ${FONT_STACK}`;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText("jobcareercanvas.in", cardX + 40, ctaY + 104);

  ctx.fillStyle = COLORS.soft;
  ctx.font = `500 24px ${FONT_STACK}`;
  ctx.textAlign = "center";
  ctx.fillText("Follow JobCareer Canvas for the latest job updates.", WIDTH / 2, HEIGHT - 26);
  ctx.textAlign = "left";

  return canvas.toDataURL("image/png");
}
