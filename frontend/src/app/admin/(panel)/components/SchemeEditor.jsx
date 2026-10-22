"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SCHEME_CATEGORY_OPTIONS,
  SCHEME_TYPE_OPTIONS,
  schemeCategoryLabel,
} from "../../../lib/schemeMeta";
import { Toast } from "./AdminUI";
import SchemeWhatsAppShare from "./SchemeWhatsAppShare";
import { apiJson, readFileAsDataUrl, slugify, toLocalInputValue } from "./api";

const EMPTY_FORM = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  featuredImage: "",
  department: "",
  schemeType: "Government Scheme",
  state: "",
  category: "government",
  startDate: "",
  lastDate: "",
  officialWebsite: "",
  applyLink: "",
  notificationLink: "",
  benefits: "",
  eligibility: "",
  requiredDocuments: "",
  howToApply: "",
  faqs: [],
  tags: "",
  featured: false,
  scheduledAt: "",
  expiresAt: "",
};

function linesToText(value) {
  return Array.isArray(value) ? value.join("\n") : String(value || "");
}

function formFrom(initial) {
  if (!initial) return { ...EMPTY_FORM, faqs: [] };
  return {
    ...EMPTY_FORM,
    ...initial,
    benefits: linesToText(initial.benefits),
    eligibility: linesToText(initial.eligibility),
    requiredDocuments: linesToText(initial.requiredDocuments),
    howToApply: linesToText(initial.howToApply),
    tags: Array.isArray(initial.tags) ? initial.tags.join(", ") : "",
    faqs: Array.isArray(initial.faqs) ? initial.faqs.map((f) => ({ question: f.question, answer: f.answer })) : [],
    scheduledAt: initial.scheduledAt ? toLocalInputValue(initial.scheduledAt) : "",
    expiresAt: initial.expiresAt ? toLocalInputValue(initial.expiresAt) : "",
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

function Field({ id, label, value, onChange, error, placeholder = "", textarea = false, hint, rows = 3 }) {
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

export default function SchemeEditor({ schemeId = null, initial = null }) {
  const router = useRouter();
  const fileInput = useRef(null);
  const slugTouched = useRef(Boolean(initial?.slug));
  const [tab, setTab] = useState("basic");
  const [savingAction, setSavingAction] = useState("");
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(() => formFrom(initial));
  const [seo, setSeo] = useState(() => seoFrom(initial));
  const [savedScheme, setSavedScheme] = useState(initial || null);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onTitleChange(value) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: slugTouched.current ? f.slug : slugify(value),
    }));
  }

  function onSlugChange(value) {
    slugTouched.current = Boolean(value);
    update("slug", value);
  }

  function toastMsg(type, message) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  }

  async function uploadImage(file, purpose) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      toastMsg("error", "Please choose a JPG, PNG, WEBP or GIF image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toastMsg("error", "Image must be under 8 MB.");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const { res, data } = await apiJson("/api/admin/media", {
        method: "POST",
        body: { dataUrl, filename: file.name, resourceType: "image" },
      });
      if (!res.ok) throw new Error(data?.message || "Upload failed.");
      const url = data.item.secureUrl || data.item.url;
      if (purpose === "seo") setSeo((s) => ({ ...s, image: url }));
      else update("featuredImage", url);
    } catch (e) {
      toastMsg("error", e.message);
    }
  }

  function triggerUpload(purpose) {
    fileInput.current.dataset.purpose = purpose;
    fileInput.current.click();
  }

  function addFaq() {
    setForm((f) => ({ ...f, faqs: [...f.faqs, { question: "", answer: "" }] }));
  }

  function updateFaq(index, key, value) {
    setForm((f) => ({
      ...f,
      faqs: f.faqs.map((faq, i) => (i === index ? { ...faq, [key]: value } : faq)),
    }));
  }

  function removeFaq(index) {
    setForm((f) => ({ ...f, faqs: f.faqs.filter((_, i) => i !== index) }));
  }

  async function save(status) {
    const toArr = (v) =>
      String(v || "")
        .split(/\r?\n/)
        .map((s) => s.trim().replace(/^[-*•]\s*/, ""))
        .filter(Boolean);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      summary: form.summary,
      description: form.description,
      featuredImage: form.featuredImage,
      department: form.department,
      schemeType: form.schemeType,
      state: form.state,
      category: form.category,
      startDate: form.startDate,
      lastDate: form.lastDate,
      officialWebsite: form.officialWebsite,
      applyLink: form.applyLink,
      notificationLink: form.notificationLink,
      benefits: toArr(form.benefits),
      eligibility: toArr(form.eligibility),
      requiredDocuments: toArr(form.requiredDocuments),
      howToApply: toArr(form.howToApply),
      faqs: form.faqs.filter((f) => f.question.trim() && f.answer.trim()),
      tags: String(form.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
      featured: Boolean(form.featured),
      expiresAt: form.expiresAt || "",
      scheduledAt: status === "scheduled" ? form.scheduledAt || "" : "",
      status,
      seo,
    };

    setSavingAction(status);
    setErrors({});
    try {
      const { res, data } = await apiJson(schemeId ? `/api/admin/schemes/${schemeId}` : "/api/admin/schemes", {
        method: schemeId ? "PUT" : "POST",
        body: payload,
      });
      setSavingAction("");
      if (!res.ok) {
        setErrors(data?.errors || {});
        toastMsg("error", data?.message || "Failed to save scheme.");
        return;
      }
      if (data.scheme) setSavedScheme(data.scheme);
      toastMsg("success", res.status === 201 ? "Scheme created." : "Scheme saved.");
      if (!schemeId && data.scheme?._id) router.replace(`/admin/schemes/${data.scheme._id}`);
    } catch (e) {
      setSavingAction("");
      toastMsg("error", e.message);
    }
  }

  const isPublished = savedScheme?.status === "published";

  return (
    <div className="admin-page">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="admin-page-header t-header">
        <div>
          <h1>{schemeId ? "Edit Scheme" : "Add New Scheme"}</h1>
          <p>Publish government schemes with eligibility, benefits, dates and official links.</p>
        </div>
        <div className="t-header-actions">
          {savedScheme && (
            <SchemeWhatsAppShare
              scheme={savedScheme}
              label="WhatsApp Post"
              onStatusChange={(whatsappStatus) =>
                setSavedScheme((s) => (s ? { ...s, whatsappStatus } : s))
              }
              onImageChange={(featuredImage) => {
                setSavedScheme((s) => (s ? { ...s, featuredImage } : s));
                update("featuredImage", featuredImage);
              }}
            />
          )}
          {isPublished && (
            <a href={`/scheme/${savedScheme?.slug || form.slug}`} target="_blank" rel="noreferrer" className="admin-btn">
              View on Site
            </a>
          )}
        </div>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="t-hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          const purpose = fileInput.current?.dataset.purpose || "featured";
          if (file) uploadImage(file, purpose);
          e.target.value = "";
        }}
      />

      {Object.keys(errors).length > 0 && (
        <div className="admin-alert admin-alert-error">Please fix the highlighted fields and try again.</div>
      )}

      <div className="t-tabs">
        {["basic", "content", "links", "seo"].map((t) => (
          <button key={t} type="button" className={`t-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-card t-card">
        <div hidden={tab !== "basic"}>
          <div className="t-section">
            <div className="admin-form-group t-field">
              <label htmlFor="f-title">Scheme Name *</label>
              <input
                id="f-title"
                type="text"
                className={errors.title ? "admin-input admin-input-error" : ""}
                value={form.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="e.g. Pragyan Bharati Scooty Scheme 2026"
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
                  {SCHEME_CATEGORY_OPTIONS.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
                {errors.category && <span className="admin-field-error">{errors.category}</span>}
                <small className="admin-field-hint">Used by the filters on the public schemes page.</small>
              </div>
            </div>

            <div className="admin-form-row t-row2">
              <div className="admin-form-group t-field">
                <label htmlFor="f-type">Scheme Type</label>
                <select id="f-type" value={form.schemeType} onChange={(e) => update("schemeType", e.target.value)}>
                  {SCHEME_TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <Field
                id="f-department"
                label="Department / Organization"
                value={form.department}
                error={errors.department}
                onChange={(v) => update("department", v)}
                placeholder="e.g. Directorate of Higher Education, Assam"
              />
            </div>

            <div className="admin-form-row t-row2">
              <Field id="f-state" label="State / Region" value={form.state} onChange={(v) => update("state", v)} placeholder="Assam / All India" />
              <Field id="f-tags" label="Tags" value={form.tags} onChange={(v) => update("tags", v)} hint="Comma separated" />
            </div>

            <div className="admin-form-group t-field">
              <label htmlFor="f-summary">Short Description</label>
              <textarea
                id="f-summary"
                rows={3}
                className={errors.summary ? "admin-input admin-input-error" : ""}
                value={form.summary}
                onChange={(e) => update("summary", e.target.value)}
                placeholder="1–2 lines shown on the homepage, listing cards and search results."
              />
              {errors.summary && <span className="admin-field-error">{errors.summary}</span>}
            </div>

            <div className="t-featured-row">
              <div className="t-featured-preview">
                {form.featuredImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.featuredImage} alt="Scheme" />
                ) : (
                  <span>Scheme Image</span>
                )}
              </div>
              <div className="t-featured-actions">
                <button type="button" className="admin-btn" onClick={() => triggerUpload("featured")}>
                  Upload Scheme Image
                </button>
                {form.featuredImage && (
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => update("featuredImage", "")}>
                    Remove
                  </button>
                )}
                {errors.featuredImage && <span className="admin-field-error">{errors.featuredImage}</span>}
              </div>
            </div>

            <div className="admin-form-row t-row2">
              <Field id="f-start" label="Application Start Date" value={form.startDate} onChange={(v) => update("startDate", v)} placeholder="e.g. 1 October 2026" />
              <Field id="f-last" label="Last Date" value={form.lastDate} onChange={(v) => update("lastDate", v)} placeholder="e.g. 31 December 2026" />
            </div>

            <div className="admin-form-row t-row2">
              <div className="admin-form-group t-field">
                <label htmlFor="f-expires">Auto-hide After (expiry)</label>
                <input id="f-expires" type="datetime-local" value={form.expiresAt} onChange={(e) => update("expiresAt", e.target.value)} />
                <small className="admin-field-hint">Scheme automatically disappears from the website after this time.</small>
              </div>
              <div className="admin-form-group t-field">
                <label htmlFor="f-scheduled">Scheduled Publish Time</label>
                <input id="f-scheduled" type="datetime-local" value={form.scheduledAt} onChange={(e) => update("scheduledAt", e.target.value)} />
                <small className="admin-field-hint">Used by the Schedule button for automatic publishing.</small>
              </div>
            </div>

            <div className="t-check-row">
              <label className="admin-switch">
                <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
                <span className="admin-switch-slider" />
              </label>
              <div>
                <strong>Featured scheme</strong>
                <p>Featured schemes appear first on the homepage and scheme listing.</p>
              </div>
            </div>
          </div>
        </div>

        <div hidden={tab !== "content"}>
          <div className="t-section">
            <h3 className="t-section-title">Full Description</h3>
            <textarea
              id="f-description"
              rows={8}
              className={errors.description ? "admin-input admin-input-error" : ""}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Explain the scheme, who it is for, and how it helps. Leave a blank line between paragraphs."
            />
            {errors.description && <span className="admin-field-error">{errors.description}</span>}

            <h3 className="t-section-title">Benefits</h3>
            <textarea
              id="f-benefits"
              rows={5}
              value={form.benefits}
              onChange={(e) => update("benefits", e.target.value)}
              placeholder="One benefit per line"
            />

            <h3 className="t-section-title">Eligibility</h3>
            <textarea
              id="f-eligibility"
              rows={5}
              value={form.eligibility}
              onChange={(e) => update("eligibility", e.target.value)}
              placeholder="One eligibility condition per line"
            />

            <h3 className="t-section-title">Required Documents</h3>
            <textarea
              id="f-docs"
              rows={5}
              value={form.requiredDocuments}
              onChange={(e) => update("requiredDocuments", e.target.value)}
              placeholder="One document per line"
            />

            <h3 className="t-section-title">How to Apply</h3>
            <textarea
              id="f-how"
              rows={5}
              value={form.howToApply}
              onChange={(e) => update("howToApply", e.target.value)}
              placeholder="One step per line"
            />

            <h3 className="t-section-title">FAQs</h3>
            {form.faqs.length === 0 && (
              <p className="admin-field-hint">No FAQs yet. Add common questions like eligibility, documents or last date.</p>
            )}
            {form.faqs.map((faq, i) => (
              <div className="admin-card t-faq-row" key={i}>
                <div className="admin-form-group t-field">
                  <label>Question</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(i, "question", e.target.value)}
                    placeholder="Who can apply for this scheme?"
                  />
                </div>
                <div className="admin-form-group t-field">
                  <label>Answer</label>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => updateFaq(i, "answer", e.target.value)}
                    placeholder="Short, factual answer."
                  />
                </div>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => removeFaq(i)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="admin-btn" onClick={addFaq}>
              + Add FAQ
            </button>
          </div>
        </div>

        <div hidden={tab !== "links"}>
          <div className="t-section">
            <h3 className="t-section-title">Official Links</h3>
            <Field
              id="f-website"
              label="Official Website"
              value={form.officialWebsite}
              error={errors.officialWebsite}
              onChange={(v) => update("officialWebsite", v)}
              placeholder="https://..."
            />
            <Field
              id="f-apply"
              label="Apply Online Link"
              value={form.applyLink}
              error={errors.applyLink}
              onChange={(v) => update("applyLink", v)}
              placeholder="https://..."
            />
            <Field
              id="f-notification"
              label="Notification / Guidelines Link"
              value={form.notificationLink}
              error={errors.notificationLink}
              onChange={(v) => update("notificationLink", v)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div hidden={tab !== "seo"}>
          <div className="t-section">
            <h3 className="t-section-title">SEO Settings</h3>
            <div className="admin-form-group t-field">
              <label htmlFor="seo-title">SEO Title</label>
              <input
                id="seo-title"
                type="text"
                value={seo.title}
                onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                placeholder="Under 60 characters recommended"
              />
            </div>
            <div className="admin-form-group t-field">
              <label htmlFor="seo-desc">Meta Description</label>
              <textarea
                id="seo-desc"
                rows={3}
                value={seo.description}
                onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                placeholder="Under 160 characters recommended"
              />
            </div>
            <div className="admin-form-row t-row2">
              <div className="admin-form-group t-field">
                <label htmlFor="seo-canonical">Canonical URL</label>
                <input
                  id="seo-canonical"
                  type="text"
                  value={seo.canonical}
                  onChange={(e) => setSeo({ ...seo, canonical: e.target.value })}
                  placeholder="https://jobcareercanvas.in/scheme/..."
                />
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
      </div>

      <div className="t-savebar">
        <span className="t-save-cat">{schemeCategoryLabel(form.category)}</span>
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
