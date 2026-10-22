import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import { schemeCategoryLabel, formatSchemeDate } from "../../../lib/schemeMeta";

export const dynamic = "force-dynamic";

const SITE = "https://jobcareercanvas.in";

async function fetchScheme(slug) {
  try {
    const res = await apiFetch(`/api/site/schemes/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.success !== false && data.scheme ? data.scheme : null;
  } catch (error) {
    console.error("scheme detail error:", error.message);
    return null;
  }
}

async function fetchRelated(scheme) {
  if (!scheme?.category) return [];
  try {
    const res = await apiFetch(`/api/site/schemes?category=${encodeURIComponent(scheme.category)}&limit=5`);
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data.schemes) ? data.schemes : [];
    return list.filter((s) => s.slug !== scheme.slug).slice(0, 4);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const scheme = await fetchScheme(slug);
  if (!scheme) return { title: "Scheme Not Found | JobCareer Canvas" };

  const description =
    scheme.seo?.description || scheme.summary || String(scheme.description || "").slice(0, 160);
  return {
    title: scheme.seo?.title || `${scheme.title} | JobCareer Canvas`,
    description,
    robots: scheme.seo?.robots || "index, follow",
    alternates: scheme.seo?.canonical
      ? { canonical: scheme.seo.canonical }
      : { canonical: `${SITE}/scheme/${scheme.slug}` },
    openGraph: {
      title: scheme.title,
      description,
      siteName: "JobCareer Canvas",
      url: `${SITE}/scheme/${scheme.slug}`,
      images: scheme.seo?.image || scheme.featuredImage || `${SITE}/brand/jobcareer-logo.png`,
      type: "article",
    },
  };
}

function Fact({ label, value }) {
  if (!value) return null;
  return (
    <div className="ja-detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ListSection({ title, items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section className="ja-scheme-section">
      <h2>{title}</h2>
      <ul className="jh-detail-list">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function paragraphs(text) {
  return String(text || "")
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

export default async function SchemeDetailPage({ params }) {
  const { slug } = await params;
  const scheme = await fetchScheme(slug);
  if (!scheme) notFound();

  const related = await fetchRelated(scheme);
  const published = formatSchemeDate(scheme.publishedAt || scheme.createdAt);
  const links = [
    { label: "Apply Online", url: scheme.applyLink, primary: true },
    { label: "Official Website", url: scheme.officialWebsite },
    { label: "Notification / Guidelines", url: scheme.notificationLink },
  ].filter((l) => l.url);

  const hasFacts = scheme.department || scheme.schemeType || scheme.state || scheme.category;
  const hasDates = scheme.startDate || scheme.lastDate || published;

  return (
    <div className="ja-home">
      <div className="ja-home-inner">
        <div className="ja-container">
          <nav className="ja-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/category/scheme">Schemes</Link>
            <span>/</span>
            <span className="ja-breadcrumb-current">{scheme.title}</span>
          </nav>

          <article className="ja-detail-card">
            <header className="ja-detail-header">
              <h1 className="ja-detail-title">{scheme.title}</h1>
              <div className="ja-post-grid-meta">
                <span className="ja-post-meta-badge ja-meta-brand">
                  <Link href="/category/scheme">{schemeCategoryLabel(scheme.category)}</Link>
                </span>
                {scheme.schemeType && <span className="ja-post-meta-badge">{scheme.schemeType}</span>}
                {published && <span className="ja-post-meta-badge">Published: {published}</span>}
                {scheme.statusLabel && <span className="ja-post-meta-badge">{scheme.statusLabel}</span>}
              </div>
            </header>

            {scheme.featuredImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="ja-detail-hero" src={scheme.featuredImage} alt={scheme.title} />
            )}

            {links.length > 0 && (
              <div className="ja-detail-link-grid ja-scheme-top-links">
                {links.map((l) => (
                  <a
                    key={l.label}
                    className={l.primary ? "jh-btn jh-btn-primary" : "ja-detail-link-btn"}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            )}

            {scheme.summary && <p className="ja-detail-summary">{scheme.summary}</p>}

            {hasFacts && (
              <aside className="ja-detail-facts">
                <h2>Scheme Overview</h2>
                <div className="ja-detail-grid">
                  <Fact label="Department" value={scheme.department} />
                  <Fact label="Scheme Type" value={scheme.schemeType} />
                  <Fact label="State / Region" value={scheme.state} />
                  <Fact label="Category" value={schemeCategoryLabel(scheme.category)} />
                </div>
              </aside>
            )}

            {hasDates && (
              <section className="ja-scheme-section">
                <h2>Important Dates</h2>
                <div className="ja-detail-grid">
                  <Fact label="Application Start" value={scheme.startDate} />
                  <Fact label="Last Date" value={scheme.lastDate} />
                  <Fact label="Published On" value={published} />
                </div>
              </section>
            )}

            {scheme.description && (
              <section className="ja-scheme-section">
                <h2>About the Scheme</h2>
                <div className="ja-detail-body">
                  {paragraphs(scheme.description).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            )}

            <ListSection title="Benefits" items={scheme.benefits} />
            <ListSection title="Eligibility" items={scheme.eligibility} />
            <ListSection title="Required Documents" items={scheme.requiredDocuments} />

            {Array.isArray(scheme.howToApply) && scheme.howToApply.length > 0 && (
              <section className="ja-scheme-section">
                <h2>How to Apply</h2>
                <ol className="ja-steps">
                  {scheme.howToApply.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </section>
            )}

            {links.length > 0 && (
              <section className="ja-detail-links">
                <h2>Important Links</h2>
                <div className="ja-detail-link-grid">
                  {links.map((l) => (
                    <a
                      key={l.label}
                      className="ja-detail-link-btn"
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {Array.isArray(scheme.faqs) && scheme.faqs.length > 0 && (
              <section className="ja-scheme-section">
                <h2>Frequently Asked Questions</h2>
                <div className="ja-faq-list">
                  {scheme.faqs.map((faq, i) => (
                    <details className="ja-faq" key={i}>
                      <summary>{faq.question}</summary>
                      <p>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {Array.isArray(scheme.tags) && scheme.tags.length > 0 && (
              <div className="ja-detail-tags">
                {scheme.tags.map((t) => (
                  <span key={t} className="ja-tag">#{t}</span>
                ))}
              </div>
            )}
          </article>
        </div>

        {related.length > 0 && (
          <div className="ja-container">
            <h2 className="ja-section-title">Related Schemes</h2>
            <div className="ja-container ja-related-schemes">
              {related.map((s) => (
                <Link className="ja-post-row" href={`/scheme/${s.slug}`} key={s._id || s.slug}>
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
