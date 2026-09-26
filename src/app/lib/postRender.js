const NODE_TYPES = new Set([
  "doc",
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "codeBlock",
  "hardBreak",
  "text",
  "image",
  "table",
  "tableRow",
  "tableHeaderCell",
  "tableCell",
  "horizontalRule",
]);

const MARK_TYPES = new Set(["bold", "italic", "underline", "strike", "code", "link", "linkMark"]);
const TEXT_ALIGNS = new Set(["left", "center", "right", "justify"]);
const HEADING_LEVELS = new Set([1, 2, 3, 4]);

function sanitizeMarks(marks) {
  if (!Array.isArray(marks)) return [];
  return marks.filter((m) => m && typeof m.type === "string" && MARK_TYPES.has(m.type));
}

function sanitizeTextNode(node) {
  if (!node || node.type !== "text") return null;
  return {
    type: "text",
    text: String(node.text ?? ""),
    marks: sanitizeMarks(node.marks),
  };
}

function sanitizeNode(node) {
  if (!node || typeof node.type !== "string" || !NODE_TYPES.has(node.type)) return null;
  const out = { type: node.type };

  if (node.type === "text") return sanitizeTextNode(node);

  if (node.type === "heading") {
    const level = node.attrs && HEADING_LEVELS.has(node.attrs.level)
      ? node.attrs.level
      : 3;
    out.attrs = { level };
    out.content = sanitizeChildren(node.content).filter((c) => c && c.type !== "hardBreak");
    return out;
  }

  if (node.type === "image") {
    const attrs = node.attrs || {};
    const src = typeof attrs.src === "string" && /^https?:\/\//i.test(attrs.src) ? attrs.src : "";
    if (!src) return null;
    out.attrs = {
      src,
      alt: typeof attrs.alt === "string" ? attrs.alt.slice(0, 300) : "",
      title: typeof attrs.title === "string" ? attrs.title.slice(0, 300) : "",
    };
    return out;
  }

  if (node.type === "table" || node.type === "tableRow") {
    out.content = sanitizeChildren(node.content);
    return out;
  }

  if (node.type === "tableCell" || node.type === "tableHeaderCell") {
    out.attrs = {
      colSpan: node.attrs && node.attrs.colspan ? Number(node.attrs.colspan) || 1 : 1,
      rowSpan: node.attrs && node.attrs.rowspan ? Number(node.attrs.rowspan) || 1 : 1,
    };
    out.content = sanitizeChildren(node.content);
    return out;
  }

  if (node.type === "doc" || node.type === "paragraph") {
    const align = node.attrs && TEXT_ALIGNS.has(node.attrs.textAlign) ? node.attrs.textAlign : null;
    out.attrs = align ? { textAlign: align } : {};
    out.content = sanitizeChildren(node.content);
    return out;
  }

  out.content = sanitizeChildren(node.content);
  return out;
}

function sanitizeChildren(children) {
  if (!Array.isArray(children)) return [];
  return children.map(sanitizeNode).filter(Boolean);
}

export function validateContentJson(json) {
  if (!json || typeof json !== "object") return null;
  const cleaned = sanitizeNode(json);
  if (!cleaned || cleaned.type !== "doc") return null;
  return cleaned;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderMarksHtml(text, marks) {
  let html = escapeHtml(text);
  for (const mark of marks) {
    if (mark.type === "bold") html = `<strong>${html}</strong>`;
    else if (mark.type === "italic") html = `<em>${html}</em>`;
    else if (mark.type === "underline") html = `<u>${html}</u>`;
    else if (mark.type === "strike") html = `<s>${html}</s>`;
    else if (mark.type === "code") html = `<code>${html}</code>`;
    else if (mark.type === "link") {
      const url = mark.attrs && /^https?:\/\//i.test(mark.attrs.href) ? mark.attrs.href : "#";
      html = `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${html}</a>`;
    }
  }
  return html;
}

function alignAttr(attrs) {
  return attrs && attrs.textAlign ? ` style="text-align:${attrs.textAlign}"` : "";
}

function nodeToHtml(node) {
  switch (node.type) {
    case "text":
      return renderMarksHtml(node.text, node.marks || []);
    case "paragraph":
      return `<p${alignAttr(node.attrs)}>${(node.content || []).map(nodeToHtml).join("")}</p>`;
    case "heading": {
      const level = node.attrs.level;
      return `<h${level}${alignAttr(node.attrs)}>${(node.content || []).map(nodeToHtml).join("")}</h${level}>`;
    }
    case "bulletList":
      return `<ul>${(node.content || []).map(nodeToHtml).join("")}</ul>`;
    case "orderedList":
      return `<ol>${(node.content || []).map(nodeToHtml).join("")}</ol>`;
    case "listItem":
      return `<li>${(node.content || []).map(nodeToHtml).join("")}</li>`;
    case "blockquote":
      return `<blockquote>${(node.content || []).map(nodeToHtml).join("")}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${(node.content || []).map(nodeToHtml).join("")}</code></pre>`;
    case "hardBreak":
      return "<br/>";
    case "horizontalRule":
      return "<hr/>";
    case "image":
      return `<img src="${escapeHtml(node.attrs.src)}" alt="${escapeHtml(node.attrs.alt || "")}"${node.attrs.title ? ` title="${escapeHtml(node.attrs.title)}"` : ""} loading="lazy"/>`;
    case "table":
      return `<table><tbody>${(node.content || []).map(nodeToHtml).join("")}</tbody></table>`;
    case "tableRow":
      return `<tr>${(node.content || []).map(nodeToHtml).join("")}</tr>`;
    case "tableHeaderCell":
    case "tableCell": {
      const tag = node.type === "tableHeaderCell" ? "th" : "td";
      const extra = node.attrs && (node.attrs.colSpan > 1 || node.attrs.rowSpan > 1)
        ? ` colspan="${node.attrs.colSpan}" rowspan="${node.attrs.rowSpan}"`
        : "";
      return `<${tag}${extra}>${(node.content || []).map(nodeToHtml).join("")}</${tag}>`;
    }
    default:
      return "";
  }
}

export function jsonToHtml(json) {
  const cleaned = validateContentJson(json);
  if (!cleaned) return "";
  return (cleaned.content || []).map(nodeToHtml).join("");
}

export function jsonToText(json) {
  const cleaned = validateContentJson(json);
  if (!cleaned) return "";
  const parts = [];
  const walk = (nodes) => {
    for (const node of nodes || []) {
      if (node.type === "text") parts.push(node.text);
      else if (node.type === "image") parts.push(node.attrs.alt || "");
      else if (node.content) walk(node.content);
    }
  };
  walk(cleaned.content);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function createEmptyDoc() {
  return { type: "doc", content: [{ type: "paragraph" }] };
}