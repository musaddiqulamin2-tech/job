// Generates a Government Scheme poster for the WhatsApp Channel post.
//
// Everything printed comes from the saved scheme record. The layout follows the
// website's red / dark palette and is produced entirely in the browser, so no
// extra storage is needed. When a real scheme image already exists the admin
// panel offers that image first and this generator is the alternative.
//
// No government emblem, ministry logo or unrelated photo is drawn here.

import { clean, dedupeRepeated } from "./whatsappPost";
import {
  schemeBenefitSummary,
  schemeEligibilitySummary,
  schemeHeading,
  schemeShareDate,
} from "./schemeShare";

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
        document.fonts.load(`800 74px "Poppins"`),
        document.fonts.load(`700 40px "Poppins"`),
        document.fonts.load(`600 26px "Poppins"`),
      ]),
      timeout,
    ]);
  } catch {
    // Fall back to the browser default sans-serif stack.
  }
}

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

function clip(text, max) {
  const value = String(text || "").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
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
  ctx.font = `600 22px ${FONT_STACK}`;
  ctx.fillText(label.toUpperCase(), x + 26, y + 40);

  ctx.fillStyle = COLORS.ink;
  ctx.font = `700 32px ${FONT_STACK}`;
  wrapText(ctx, value, w - 52, 2).forEach((line, index) => {
    ctx.fillText(line, x + 26, y + 78 + index * 30);
  });
}

function posterStats(scheme) {
  const stats = [];
  const lastDate = schemeShareDate(scheme.lastDate);
  const eligibility = schemeEligibilitySummary(scheme);
  if (lastDate) stats.push(["Last Date", lastDate]);
  if (eligibility) stats.push(["Eligible Applicants", clip(eligibility, 78)]);
  if (clean(scheme.state)) stats.push(["State / Region", clean(scheme.state)]);
  if (clean(scheme.schemeType)) stats.push(["Scheme Type", clean(scheme.schemeType)]);
  return stats.slice(0, 4);
}

/**
 * Draws the poster and returns a PNG data URL. Client-only.
 */
export async function generateSchemePoster(scheme) {
  if (typeof document === "undefined" || !scheme) return "";

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
  const badgeText = "GOVT SCHEME";
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

  const heading = schemeHeading(scheme);
  const yearMatch = heading.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? yearMatch[0] : "";
  const type = clip(clean(scheme.schemeType), 26);

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
  if (type) {
    drawPill(ctx, {
      x: pillX,
      y: y - 38,
      text: type,
      bg: COLORS.ink,
      color: COLORS.white,
      font: `600 24px ${FONT_STACK}`,
    });
  }
  y += 62;

  // Scheme title.
  const title = clean(scheme.title) || "Government Scheme";
  ctx.fillStyle = COLORS.ink;
  let titleSize = 72;
  if (title.length > 44) titleSize = 62;
  if (title.length > 68) titleSize = 54;
  ctx.font = `800 ${titleSize}px ${FONT_STACK}`;
  wrapText(ctx, title, innerW, 4).forEach((line) => {
    ctx.fillText(line, innerX, y);
    y += titleSize + 16;
  });

  // Department.
  const department = dedupeRepeated(scheme.department);
  if (department) {
    y += 4;
    ctx.fillStyle = COLORS.muted;
    ctx.font = `600 34px ${FONT_STACK}`;
    wrapText(ctx, department, innerW, 2).forEach((line) => {
      ctx.fillText(line, innerX, y);
      y += 44;
    });
  }

  const stats = posterStats(scheme);
  const statsTop = Math.min(Math.max(y + 42, 640), 800);

  // Highlight band: a verified benefit first, otherwise the saved summary.
  const highlight = schemeBenefitSummary(scheme) || clip(clean(scheme.summary), 190);
  if (highlight) {
    ctx.font = `500 32px ${FONT_STACK}`;
    const lines = wrapText(ctx, highlight, innerW - 64, 3);
    const boxH = 58 + lines.length * 40;
    const boxY = y + 30;
    if (lines.length && boxY + boxH < statsTop - 20) {
      ctx.fillStyle = COLORS.brandBg;
      roundRect(ctx, innerX, boxY, innerW, boxH, 18);
      ctx.fill();
      ctx.fillStyle = COLORS.brandDark;
      ctx.font = `700 22px ${FONT_STACK}`;
      ctx.fillText("KEY BENEFIT", innerX + 32, boxY + 38);
      ctx.fillStyle = COLORS.ink;
      ctx.font = `500 32px ${FONT_STACK}`;
      lines.forEach((line, index) => {
        ctx.fillText(line, innerX + 32, boxY + 82 + index * 40);
      });
    }
  }

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
  }

  // Call to action.
  const ctaH = 142;
  const ctaY = HEIGHT - PAD - ctaH - 58;
  ctx.fillStyle = COLORS.brand;
  roundRect(ctx, cardX, ctaY, cardW, ctaH, 22);
  ctx.fill();

  ctx.fillStyle = COLORS.white;
  ctx.font = `700 38px ${FONT_STACK}`;
  ctx.fillText("Read Full Details", cardX + 40, ctaY + 58);
  ctx.font = `600 30px ${FONT_STACK}`;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  const slug = clean(scheme.slug);
  ctx.fillText(clip(`jobcareercanvas.in/scheme/${slug}`, 52), cardX + 40, ctaY + 104);

  ctx.fillStyle = COLORS.soft;
  ctx.font = `500 24px ${FONT_STACK}`;
  ctx.textAlign = "center";
  ctx.fillText("Follow JobCareer Canvas for the latest Government Schemes.", WIDTH / 2, HEIGHT - 26);
  ctx.textAlign = "left";

  return canvas.toDataURL("image/png");
}
