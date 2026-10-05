"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import { createEmptyDoc, jsonToHtml } from "../../../lib/postRender";
import { POST_CATEGORY_META } from "../../../lib/postMeta";
import WhatsAppShare from "./WhatsAppShare";
import { Toast, Spinner } from "./AdminUI";
import { apiJson, readFileAsDataUrl, slugify, toLocalInputValue } from "./api";
import { ActionBar } from "./EditorToolbar";

const CATEGORIES = Object.keys(POST_CATEGORY_META);

const EMPTY_FORM = {
  title: "", slug: "", category: "government-job", summary: "", featuredImage: "",
  organization: "", location: "", qualification: "", ageLimit: "", ageRelaxation: "",
  vacancyCount: "", applicationFee: "", paymentMode: "", eligibility: "",
  selectionProcess: "", howToApply: "",
  startDate: "", lastDate: "", examDate: "", admitCardDate: "", resultDate: "",
  officialNotificationUrl: "", applicationUrl: "",
  importantLinks: [], tags: "", featured: false, expiresAt: "", scheduledAt: "",
};

function formFrom(initial) {
  if (!initial) return { ...EMPTY_FORM };
  return {
    ...EMPTY_FORM,
    ...initial,
    vacancyCount: initial.vacancyCount ? String(initial.vacancyCount) : "",
    expiresAt: initial.expiresAt ? toLocalInputValue(initial.expiresAt) : "",
    scheduledAt: initial.scheduledAt ? toLocalInputValue(initial.scheduledAt) : "",
    selectionProcess: Array.isArray(initial.selectionProcess) ? initial.selectionProcess.join("\n") : "",
    howToApply: Array.isArray(initial.howToApply) ? initial.howToApply.join("\n") : "",
    tags: Array.isArray(initial.tags) ? initial.tags.join(", ") : "",
    importantLinks: Array.isArray(initial.importantLinks) ? initial.importantLinks.map((l) => ({ ...l })) : [],
  };
}

function seoFrom(initial) {
  return {
    title: initial?.seo?.title || "",
    description: initial?.seo?.description || "",
    canonical: initial?.seo?.canonical || "",
    robots: initial?.seo?.robots || "index, follow",
    image: initial?.seo?.image || "",
  };
}

function templateDoc() {
  const para = (t) => ({ type: "paragraph", content: t ? [{ type: "text", text: t }] : [] });
  const cell = (t, h = false) => ({ type: h ? "tableHeaderCell" : "tableCell", content: [para(t)] });
  const row = (c) => ({ type: "tableRow", content: c });
  const table = (rows) => ({ type: "table", content: rows });
  const heading = (t, level = 2) => ({ type: "heading", attrs: { level }, content: [{ type: "text", text: t }] });
  const bullet = (t) => ({ type: "listItem", content: [para(t)] });

  return {
    type: "doc",
    content: [
      heading("Key Highlights"),
      para("– Brief overview of the recruitment / notification."),
      para("– Total number of vacancies and participating organization."),
      heading("Important Dates"),
      table([
        row([cell("Event", true), cell("Date", true)]),
        row([cell("Application Start Date"), cell("Click Here")]),
        row([cell("Last Date to Apply"), cell("Click Here")]),
        row([cell("Admit Card Release"), cell("Click Here")]),
        row([cell("Exam Date"), cell("Click Here")]),
        row([cell("Result Date"), cell("Click Here")]),
      ]),
      heading("Vacancy Details"),
      table([
        row([cell("Post Name", true), cell("Vacancies", true)]),
        row([cell("Post Name Here"), cell("00")]),
      ]),
      heading("Educational Qualification"),
      para("Candidates must possess the following qualifications:"),
      bullet("Qualification 1"),
      bullet("Qualification 2"),
      heading("Age Limit"),
      para("Minimum – Maximum years. Age relaxation as per government norms."),
      heading("Application Fee"),
      para("– General / OBC: Click Here"),
      para("– SC / ST / PwD: Click Here"),
      heading("Selection Process"),
      bullet("Selection will be based on written exam / interview."),
      heading("How to Apply"),
      para("Follow the steps below to apply online:"),
      bullet("Visit the official website: www.example.com"),
      bullet("Read the notification carefully before applying."),
      bullet("Fill the online application form with correct details."),
      bullet("Upload required documents and pay the fee (if applicable)."),
      bullet("Submit the form and keep a printout for future reference."),
      heading("Important Links"),
      table([
        row([cell("Notification PDF", true), cell("Link", true)]),
        row([cell("Apply Online"), cell("Click Here")]),
        row([cell("Official Website"), cell("Click Here")]),
        row([cell("Helpline Number"), cell("00000 00000")]),
      ]),
    ],
  };
}

function Field({ id, label, value, onChange, error, placeholder = "", textarea = false, hint, rows = 2 }) {
  const cls = error ? "admin-input admin-input-error" : "";
  return (
    <div className="admin-form-group t-field">
      <label htmlFor={id}>{label}</label>
      {textarea ? (
        <textarea id={id} rows={rows} className={cls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input id={id} type="text" className={cls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
      {error && <span className="admin-field-error">{error}</span>}
      {hint && <small className="admin-field-hint">{hint}</small>}
    </div>
  );
}

export default function PostEditor({ postId = null, initial = null }) {
  const router = useRouter();
  const fileInput = useRef(null);
  const slugTouched = useRef(Boolean(initial?.slug));
  const [tab, setTab] = useState("content");
  const [savingAction, setSavingAction] = useState("");
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(() => formFrom(initial));
  const [seo, setSeo] = useState(() => seoFrom(initial));
  // The WhatsApp share post is built from the record that is actually saved, so
  // the generated text always matches what the public site is serving.
  const [savedPost, setSavedPost] = useState(initial || null);

  useEffect(() => {
    if (initial) setSavedPost(initial);
  }, [initial]);

  const initialContent = useMemo(
    () =>
      initial?.content?.json && initial.content.json.type === "doc"
        ? initial.content.json
        : createEmptyDoc(),
    [initial]
  );

  const editorExtensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } },
        underline: true,
      }),
      Image.configure({ allowBase64: false }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({
        placeholder: "Write your post content here... Use the toolbar for headings, lists, tables and images.",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
    ],
    []
  );

  const editorProps = useMemo(
    () => ({ attributes: { class: "t-prose t-editor-box" } }),
    []
  );

  const editor = useEditor({
    extensions: editorExtensions,
    content: initialContent,
    editorProps,
    immediatelyRender: false,
  });

  function toastMsg(type, message) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4000);
  }

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: null } : e));
  }

  function onTitleChange(value) {
    setForm((f) => {
      const next = { ...f, title: value };
      if (!slugTouched.current) next.slug = slugify(value);
      return next;
    });
  }

  function onSlugChange(value) {
    slugTouched.current = true;
    update("slug", slugify(value));
  }

  function updateLink(idx, patch) {
    setForm((f) => {
      const links = f.importantLinks.slice();
      links[idx] = { ...links[idx], ...patch };
      return { ...f, importantLinks: links };
    });
  }

  async function uploadImage(file, purpose) {
    if (!file) return "";
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      toastMsg("error", "Please choose a JPG, PNG, WEBP or GIF image.");
      return "";
    }
    if (file.size > 8 * 1024 * 1024) {
      toastMsg("error", "Image must be under 8 MB.");
      return "";
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const { res, data } = await apiJson("/api/admin/media", {
        method: "POST",
        body: { dataUrl, filename: file.name, resourceType: "image" },
      });
      if (!res.ok) throw new Error(data?.message || "Upload failed.");
      const url = data.item.secureUrl || data.item.url;
      if (purpose === "editor") {
        editor?.chain().focus().setImage({ src: url, alt: file.name }).run();
      } else if (purpose === "featured") {
        update("featuredImage", url);
      } else if (purpose === "seo") {
        setSeo((s) => ({ ...s, image: url }));
      }
      return url;
    } catch (e) {
      toastMsg("error", e.message);
      return "";
    }
  }

  function triggerUpload(purpose) {
    fileInput.current.dataset.purpose = purpose;
    fileInput.current.click();
  }

  function insertTemplate() {
    editor?.chain().focus().setContent(templateDoc()).run();
    toastMsg("success", "Template inserted. Replace sample text with real details.");
  }

  function insertTable() {
    editor?.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run();
  }

  function setLinkUrl() {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter link URL (https://...)", prev);
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const clean = url.trim();
    const valid = /^https?:\/\/\S+$/i.test(clean)
      ? clean
      : clean.startsWith("www.")
        ? "https://" + clean
        : "";
    if (!valid) {
      toastMsg("error", "Enter a valid http(s) URL.");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: valid }).run();
  }

  async function save(status) {
    if (!editor) return;
    const toArr = (v) => String(v || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      category: form.category,
      status,
      summary: form.summary,
      featuredImage: form.featuredImage,
      organization: form.organization,
      location: form.location,
      qualification: form.qualification,
      ageLimit: form.ageLimit,
      ageRelaxation: form.ageRelaxation,
      vacancyCount: Number(form.vacancyCount) || 0,
      applicationFee: form.applicationFee,
      paymentMode: form.paymentMode,
      eligibility: form.eligibility,
      selectionProcess: toArr(form.selectionProcess),
      howToApply: toArr(form.howToApply),
      startDate: form.startDate,
      lastDate: form.lastDate,
      examDate: form.examDate,
      admitCardDate: form.admitCardDate,
      resultDate: form.resultDate,
      officialNotificationUrl: form.officialNotificationUrl,
      applicationUrl: form.applicationUrl,
      importantLinks: form.importantLinks.filter((l) => l.label && l.url),
      tags: String(form.tags || "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 20),
      featured: Boolean(form.featured),
      expiresAt: form.expiresAt || "",
      scheduledAt: status === "scheduled" ? form.scheduledAt || "" : "",
      content: { json: editor.getJSON() },
      seo,
    };

    setSavingAction(status);
    try {
      const { res, data } = await apiJson(postId ? `/api/admin/posts/${postId}` : "/api/admin/posts", {
        method: postId ? "PUT" : "POST",
        body: payload,
      });
      setSavingAction("");
      if (!res.ok) {
        setErrors(data?.errors || {});
        setToast({ type: "error", message: data?.message || "Failed to save post." });
        window.setTimeout(() => setToast(null), 4000);
        return;
      }
      const savedId = postId || data.post?._id;
      if (data.post) setSavedPost(data.post);
      setToast({ type: "success", message: res.status === 201 ? "Post created." : "Post saved." });
      window.setTimeout(() => setToast(null), 3000);
      if (!postId && savedId) router.replace(`/admin/posts/${savedId}`);
    } catch (e) {
      setSavingAction("");
      toastMsg("error", e.message);
    }
  }

  const previewHtml = editor && tab === "preview" ? jsonToHtml(editor.getJSON()) : "";

  function field(k, label, extra = {}) {
    return <Field key={k} id={`f-${k}`} label={label} value={form[k]} error={errors[k]} onChange={(value) => update(k, value)} {...extra} />;
  }

  return (
    <div className="admin-page">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="admin-page-header t-header">
        <div>
          <h1>{postId ? "Edit Post" : "Add New Post"}</h1>
          <p>Write rich content, set job details and manage publishing.</p>
        </div>
        <div className="t-header-actions">
          <a href={`/post/${form.slug || "preview"}`} target="_blank" rel="noreferrer" className="admin-btn">
            View on Site
          </a>
          <WhatsAppShare
            post={savedPost}
            blockWhenDraft
            className="admin-btn"
            label="Share on WhatsApp Channel"
          />
        </div>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="t-hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          const purpose = fileInput.current?.dataset.purpose || "editor";
          if (file) uploadImage(file, purpose);
          e.target.value = "";
        }}
      />

      {Object.keys(errors).length > 0 && (
        <div className="admin-alert admin-alert-error">Please fix the highlighted fields and try again.</div>
      )}

      <div className="t-tabs">
        {["content", "job", "seo", "preview"].map((t) => (
          <button key={t} type="button" className={`t-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-card t-card">
        <div hidden={tab !== "content"}>
          <div className="t-section">
            <div className="admin-form-group t-field">
              <label htmlFor="f-title">Title *</label>
              <input
                id="f-title"
                type="text"
                className={errors.title ? "admin-input admin-input-error" : ""}
                value={form.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="e.g. Assam Police Recruitment 2026 – 1200 Constable Vacancies"
              />
              {errors.title && <span className="admin-field-error">{errors.title}</span>}
            </div>

            <div className="admin-form-row t-row2">
              <div className="admin-form-group t-field">
                <label htmlFor="f-slug">Slug</label>
                <input
                  id="f-slug"
                  type="text"
                  className={errors.slug ? "admin-input admin-input-error" : ""}
                  value={form.slug}
                  onChange={(e) => onSlugChange(e.target.value)}
                  placeholder="auto-generated-from-title"
                />
                {errors.slug && <span className="admin-field-error">{errors.slug}</span>}
              </div>
              <div className="admin-form-group t-field">
                <label htmlFor="f-category">Category *</label>
                <select
                  id="f-category"
                  className={errors.category ? "admin-input admin-input-error" : ""}
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{POST_CATEGORY_META[c].plural}</option>
                  ))}
                </select>
                {errors.category && <span className="admin-field-error">{errors.category}</span>}
              </div>
            </div>

            <div className="admin-form-group t-field">
              <label htmlFor="f-summary">Summary / Short Description</label>
              <textarea
                id="f-summary"
                rows={2}
                value={form.summary}
                onChange={(e) => update("summary", e.target.value)}
                placeholder="1–2 line summary shown in listing cards and search."
              />
            </div>

            <div className="t-featured-row">
              <div className="t-featured-preview">
                {form.featuredImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.featuredImage} alt="Featured" />
                ) : (
                  <span>Featured Image</span>
                )}
              </div>
              <div className="t-featured-actions">
                <button type="button" className="admin-btn" onClick={() => triggerUpload("featured")}>
                  Upload Featured Image
                </button>
                {form.featuredImage && (
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => update("featuredImage", "")}>
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="t-editor">
              {editor ? (
                <>
                  <ActionBar
                    editor={editor}
                    onInsertTemplate={insertTemplate}
                    onUploadImage={() => triggerUpload("editor")}
                    onSetLink={setLinkUrl}
                    onInsertTable={insertTable}
                  />
                  <EditorContent editor={editor} />
                </>
              ) : (
                <div className="t-editor-loading">Loading editor...</div>
              )}
            </div>
          </div>
        </div>

        <div hidden={tab !== "job"}>
          <div className="t-section">
            <h3 className="t-section-title">Job / Notification Details</h3>
            <div className="admin-form-row t-row2">
              {field("organization", "Organization / Department")}
              {field("vacancyCount", "Total Vacancies")}
            </div>
            <div className="admin-form-row t-row2">
              {field("location", "Location")}
              {field("qualification", "Qualification", { textarea: true })}
            </div>
            <div className="admin-form-row t-row2">
              {field("ageLimit", "Age Limit")}
              {field("ageRelaxation", "Age Relaxation")}
            </div>
            <div className="admin-form-row t-row2">
              {field("applicationFee", "Application Fee")}
              {field("paymentMode", "Payment Mode")}
            </div>
            {field("eligibility", "Detailed Eligibility", { textarea: true, hint: "Additional eligibility notes beyond qualification." })}
            {field("selectionProcess", "Selection Process", { textarea: true, hint: "One step per line." })}
            {field("howToApply", "How to Apply (steps)", { textarea: true, hint: "One step per line." })}
            <div className="admin-form-row t-row2">
              {field("startDate", "Application Start Date")}
              {field("lastDate", "Last Date")}
            </div>
            <div className="admin-form-row t-row2">
              {field("examDate", "Exam Date")}
              {field("admitCardDate", "Admit Card Date")}
            </div>
            <div className="admin-form-row t-row2">
              {field("resultDate", "Result Date")}
              {field("officialNotificationUrl", "Notification URL (https://)")}
            </div>
            <div className="admin-form-row t-row2">
              {field("applicationUrl", "Apply Online URL (https://)")}
              {field("tags", "Tags", { hint: "Comma separated" })}
            </div>

            <div className="admin-form-row t-row2">
              <div className="admin-form-group t-field">
                <label htmlFor="f-expiresAt">Expires At</label>
                <input id="f-expiresAt" type="datetime-local" value={form.expiresAt} onChange={(e) => update("expiresAt", e.target.value)} />
              </div>
              <div className="admin-form-group t-field">
                <label htmlFor="f-scheduledAt">Scheduled Publish Time</label>
                <input id="f-scheduledAt" type="datetime-local" value={form.scheduledAt} onChange={(e) => update("scheduledAt", e.target.value)} />
              </div>
            </div>

            <div className="t-check-row">
              <label className="admin-switch">
                <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
                <span className="admin-switch-slider" />
              </label>
              <div>
                <strong>Featured post</strong>
                <p>Featured posts are pinned first on category listing pages.</p>
              </div>
            </div>

            <h3 className="t-section-title">Important Links</h3>
            {form.importantLinks.length === 0 && (
              <p className="admin-field-hint">No links yet. Add notification PDF, apply link, official website, etc.</p>
            )}
            {form.importantLinks.map((link, i) => (
              <div className="admin-form-row t-row2 t-link-row" key={i}>
                <div className="admin-form-group t-field">
                  <label>Label</label>
                  <input type="text" value={link.label} onChange={(e) => updateLink(i, { label: e.target.value })} placeholder="Apply Online" />
                </div>
                <div className="admin-form-group t-field">
                  <label>URL</label>
                  <input type="text" value={link.url} onChange={(e) => updateLink(i, { url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="admin-form-group t-field t-type">
                  <label>Type</label>
                  <select value={link.type} onChange={(e) => updateLink(i, { type: e.target.value })}>
                    {["apply", "notification", "website", "admit-card", "result", "syllabus", "custom"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <button type="button" className="admin-btn admin-btn-ghost t-remove" onClick={() =>
                  setForm((f) => ({ ...f, importantLinks: f.importantLinks.filter((_, idx) => idx !== i) }))
                }>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="admin-btn" onClick={() =>
              setForm((f) => ({ ...f, importantLinks: [...f.importantLinks, { label: "", url: "", type: "custom" }] }))
            }>
              + Add Important Link
            </button>
          </div>
        </div>

        <div hidden={tab !== "seo"}>
          <div className="t-section">
            <h3 className="t-section-title">SEO Settings</h3>
            <div className="admin-form-group t-field">
              <label htmlFor="seo-title">SEO Title</label>
              <input id="seo-title" type="text" value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} placeholder="Under 60 characters recommended" />
            </div>
            <div className="admin-form-group t-field">
              <label htmlFor="seo-desc">Meta Description</label>
              <textarea id="seo-desc" rows={3} value={seo.description} onChange={(e) => setSeo({ ...seo, description: e.target.value })} placeholder="Under 160 characters recommended" />
            </div>
            <div className="admin-form-row t-row2">
              <div className="admin-form-group t-field">
                <label htmlFor="seo-canonical">Canonical URL</label>
                <input id="seo-canonical" type="text" value={seo.canonical} onChange={(e) => setSeo({ ...seo, canonical: e.target.value })} placeholder="https://..." />
              </div>
              <div className="admin-form-group t-field">
                <label htmlFor="seo-robots">Robots</label>
                <select id="seo-robots" value={seo.robots} onChange={(e) => setSeo({ ...seo, robots: e.target.value })}>
                  <option value="index, follow">index, follow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                  <option value="noindex, follow">noindex, follow</option>
                </select>
              </div>
            </div>
            <div className="admin-form-group t-field">
              <label>OG Image</label>
              <div className="t-seo-img">
                {seo.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={seo.image} alt="OG" />
                )}
                <button type="button" className="admin-btn" onClick={() => triggerUpload("seo")}>
                  {seo.image ? "Replace Image" : "Upload OG Image"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div hidden={tab !== "preview"}>
          <div className="t-section">
            <h3 className="t-section-title">Live Preview</h3>
            <p className="admin-field-hint">This is how the post will render on the public website (same sanitized HTML).</p>
            <div className="t-preview" dangerouslySetInnerHTML={{ __html: previewHtml || "<p>No content yet.</p>" }} />
          </div>
        </div>
      </div>

      <div className="t-savebar">
        <select value={form.category} onChange={(e) => update("category", e.target.value)} className="admin-input t-save-cat" aria-label="Category">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{POST_CATEGORY_META[c].plural}</option>
          ))}
        </select>
        <div className="t-save-actions">
          <button type="button" className="admin-btn" disabled={!!savingAction} onClick={() => save("draft")}>
            {savingAction === "draft" ? "Saving..." : "Save Draft"}
          </button>
          <button type="button" className="admin-btn" disabled={!!savingAction} onClick={() => save("scheduled")}>
            {savingAction === "scheduled" ? "Scheduling..." : "Schedule"}
          </button>
          <button type="button" className="admin-btn admin-btn-primary" disabled={!!savingAction} onClick={() => save("published")}>
            {savingAction === "published" ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}