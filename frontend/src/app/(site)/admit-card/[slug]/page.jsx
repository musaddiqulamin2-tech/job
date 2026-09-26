import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdmitCardPosts, getAdmitCardPost, getSampleJobs, getSampleResults, getAdmissionPosts } from "../../../lib/categoryData";
import { loadAdmitCard } from "../../../lib/admitCardData";
import ShareButtons from "../../admission/[slug]/ShareButtons";

export const dynamic = "force-dynamic";

const DATE_ICON = "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z";
const FILE_ICON = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 15h6M9 11h2";

function formatDDMMYYYY(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}/${d.getFullYear()}`;
    }
  } catch {
    return dateStr;
  }
  return dateStr;
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  } catch {
    return dateStr;
  }
  return dateStr;
}

function Breadcrumb({ title }) {
  return (
    <nav className="ad-breadcrumb" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      <span className="ad-breadcrumb-sep">/</span>
      <Link href="/category/admit-card">Admit Card</Link>
      <span className="ad-breadcrumb-sep">/</span>
      <span className="ad-breadcrumb-current" aria-current="page">
        {title}
      </span>
    </nav>
  );
}

function RelatedCards({ currentPost }) {
  const all = getAdmitCardPosts();
  const related = all
    .filter((p) => p.slug !== currentPost.slug)
    .sort((a, b) => {
      const sameCat = (x) => (x.category === currentPost.category ? 0 : 1);
      return sameCat(a) - sameCat(b);
    })
    .slice(0, 4);

  return (
    <section className="ad-section ad-related-wrap">
      <h2 className="ad-section-h">Related Admit Cards</h2>
      {related.length > 0 ? (
        <div className="ad-related-grid">
          {related.map((p) => (
            <Link key={p._id} href={`/admit-card/${p.slug}`} className="ad-related-card">
              <span className="ad-related-cat">{p.category}</span>
              <span className="ad-related-title">{p.title}</span>
              <span className="ad-related-org">{p.org}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="ad-muted">More admit card updates will be published soon.</p>
      )}
    </section>
  );
}

function SidebarWidget({ title, items, hrefBase }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="ad-widget">
      <h3 className="ad-widget-title">{title}</h3>
      <ul className="ad-widget-list">
        {items.map((item) => (
          <li key={item._id || item.slug}>
            <Link href={`${hrefBase}/${item.slug}`}>
              <span className="ad-widget-item-title">{item.title}</span>
              <span className="ad-widget-item-org">
                {item.org || item.company || item.status || item.category}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="ad-sidebar">
      <SidebarWidget
        title="Latest Admit Cards"
        items={getAdmitCardPosts().slice(0, 6)}
        hrefBase="/admit-card"
      />
      <SidebarWidget
        title="Latest Jobs"
        items={getSampleJobs().slice(0, 6)}
        hrefBase="/job"
      />
      <SidebarWidget
        title="Latest Admissions"
        items={getAdmissionPosts().slice(0, 6)}
        hrefBase="/admission"
      />
      <SidebarWidget
        title="Latest Results"
        items={getSampleResults().slice(0, 6)}
        hrefBase="/result"
      />
    </aside>
  );
}

function ImportantDates({ post }) {
  const rows = [];
  const addRow = (label, value) => {
    const formatted = formatDDMMYYYY(value);
    if (formatted) rows.push({ label, value: formatted });
  };
  addRow("Application Start", post.applicationStartDate);
  addRow("Last Date to Apply", post.applicationLastDate);
  addRow("Admit Card Release", post.admitCardReleaseDate);
  addRow("Exam Date", post.examDate);
  addRow("Result Date", post.resultDate);
  if (post.importantDates && post.importantDates.length) {
    post.importantDates.forEach((row) => {
      if (row.label && row.date) rows.push({ label: row.label, value: formatDDMMYYYY(row.date) || row.date });
    });
  }

  const fallbackRow = {
    label: "Schedule",
    value: `As per the official notification of ${post.org}.`,
  };

  return (
    <section className="ad-section">
      <h2 className="ad-section-h">Important Dates</h2>
      <div className="ad-wrap-scroll">
        <table className="ad-table">
          <tbody>
            {rows.length > 0
              ? rows.map((row) => (
                  <tr key={row.label}>
                    <th>{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                ))
              : (
                  <tr>
                    <th>{fallbackRow.label}</th>
                    <td>{fallbackRow.value}</td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CardDetails({ post }) {
  const rows = [
    { label: "Organization", value: post.org },
    { label: "Exam / Post", value: post.examName || post.badge },
    { label: "Intake", value: post.intake },
    { label: "Category", value: post.category },
    { label: "Exam Type", value: post.examType },
    { label: "Exam Mode", value: post.examMode },
    { label: "Admit Card Release Mode", value: post.admitCardReleaseMode },
    { label: "Status", value: post.status },
    { label: "Official Website", value: post.officialSite },
  ].filter((r) => r.value);

  return (
    <section className="ad-section">
      <h2 className="ad-section-h">Admit Card Details</h2>
      <div className="ad-wrap-scroll">
        <table className="ad-table">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th>{row.label}</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EligibilitySection({ post }) {
  if (!post.eligibility || !post.eligibility.length) return null;
  return (
    <section className="ad-section">
      <h2 className="ad-section-h">Who Can Download the Admit Card</h2>
      <ul className="ad-doc-list">
        {post.eligibility.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function ExamCentreInfo({ post }) {
  if (!post.examCentreInfo || !post.examCentreInfo.length) return null;
  return (
    <section className="ad-section">
      <h2 className="ad-section-h">Exam Centre Information</h2>
      <ul className="ad-doc-list">
        {post.examCentreInfo.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function DocumentsRequired({ post }) {
  if (!post.documents || !post.documents.length) return null;
  return (
    <section className="ad-section">
      <h2 className="ad-section-h">Documents Required on Exam Day</h2>
      <ul className="ad-doc-list">
        {post.documents.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function HowToDownload({ post }) {
  if (!post.howToDownload || !post.howToDownload.length) return null;
  return (
    <section className="ad-section">
      <h2 className="ad-section-h">How to Download Admit Card</h2>
      <ol className="ad-step-list">
        {post.howToDownload.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </section>
  );
}

function ImportantLinks({ post }) {
  const links = (
    Array.isArray(post.importantLinks) && post.importantLinks.length
      ? post.importantLinks
      : [
          post.admitCardUrl && { label: "Download Admit Card", url: post.admitCardUrl },
          post.officialNotificationUrl && {
            label: "Official Notification",
            url: post.officialNotificationUrl,
          },
          post.officialSite && {
            label: "Official Website",
            url: post.officialSite,
          },
        ].filter(Boolean)
  );

  if (!links.length) {
    return (
      <section className="ad-section">
        <h2 className="ad-section-h">Important Links</h2>
        <p className="ad-muted">
          Official links for this admit card will be published here as soon as they
          are available on the website of {post.org}.
        </p>
      </section>
    );
  }

  return (
    <section className="ad-section">
      <h2 className="ad-section-h">Important Links</h2>
      <div className="ad-wrap-scroll">
        <table className="ad-table ad-links-table">
          <thead>
            <tr>
              <th style={{ width: "55%" }}>Link</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.label}>
                <td>{link.label}</td>
                <td>
                  {link.url ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ad-open-link"
                    >
                      Click Here ↗
                    </a>
                  ) : (
                    <span className="ad-open-link ad-open-link-soon">
                      Click Here
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ad-links-note">
        Always download the admit card only from the official website of the
        conducting authority. JobCareer only aggregates information.
      </p>
    </section>
  );
}

function Instructions({ post }) {
  if (!post.importantInstructions || !post.importantInstructions.length) return null;
  return (
    <section className="ad-section">
      <h2 className="ad-section-h">Important Instructions</h2>
      <ul className="ad-doc-list">
        {post.importantInstructions.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function FaqSection({ faq }) {
  if (!faq || !faq.length) return null;
  return (
    <section className="ad-section">
      <h2 className="ad-section-h">Frequently Asked Questions</h2>
      <div className="ad-faq">
        {faq.map((item, idx) => (
          <details className="ad-faq-item" key={idx} open={idx === 0}>
            <summary>{item.question}</summary>
            <div className="ad-faq-answer">{item.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

const BOLD_RE = /\*\*([^*]+)\*\*/g;
const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

function InlineRichText({ text }) {
  const tokens = [];
  let rest = text || "";
  const combined = new RegExp(
    `(\\*\\*[^*]+\\*\\*|\\[[^\\]]+\\]\\(https?:\\/\\/[^)\\s]+\\))`,
    "g"
  );
  let m;
  let last = 0;
  while ((m = combined.exec(rest))) {
    if (m.index > last) tokens.push(rest.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      tokens.push(<strong key={tokens.length}>{token.slice(2, -2)}</strong>);
    } else {
      const lm = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/.exec(token);
      if (lm) {
        tokens.push(
          <a key={tokens.length} href={lm[2]} target="_blank" rel="noopener noreferrer" className="ad-inline-link">
            {lm[1]}
          </a>
        );
      } else {
        tokens.push(token);
      }
    }
    last = m.index + token.length;
  }
  if (last < rest.length) tokens.push(rest.slice(last));
  return <>{tokens}</>;
}

function FeaturedImage({ post }) {
  if (post.featuredImage) {
    return (
      <figure className="ad-feature-wrap">
        <img
          className="ad-featured"
          src={post.featuredImage}
          alt={post.title}
        />
      </figure>
    );
  }
  return (
    <div className="ad-featured ad-featured-fallback" role="img" aria-label={post.title}>
      <div className="ad-ff-badge">{post.category}</div>
      <div className="ad-ff-title">{post.title}</div>
      <div className="ad-ff-org">{post.org}</div>
    </div>
  );
}

function QuickFacts({ post }) {
  const facts = [
    { label: "Exam", value: post.examName || post.badge },
    { label: "Intake", value: post.intake },
    { label: "Organization", value: post.org },
    { label: "Admit Card Status", value: post.status },
    { label: "Admit Card Release", value: formatDDMMYYYY(post.admitCardReleaseDate) },
    { label: "Exam Date", value: formatDDMMYYYY(post.examDate) },
    { label: "Exam Mode", value: post.examMode },
    { label: "Result Date", value: formatDDMMYYYY(post.resultDate) },
  ].filter((f) => f.value);

  if (!facts.length) return null;

  return (
    <section className="ad-facts" aria-label="Key facts">
      <div className="ad-facts-grid">
        {facts.map((f) => (
          <div className="ad-fact" key={f.label}>
            <span className="ad-fact-label">{f.label}</span>
            <span className="ad-fact-value">{f.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function parseInlineContent(text) {
  return <InlineRichText text={text} />;
}

function ContentBlocks({ blocks }) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <div className="ad-article-body">
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          return (
            <h2 className="ad-section-h ad-content-h" key={idx}>
              {block.text || block.heading}
            </h2>
          );
        }
        if (block.type === "subheading") {
          return (
            <h3 className="ad-sub-heading" key={idx}>
              {block.text || block.heading}
            </h3>
          );
        }
        if (block.type === "list") {
          return block.ordered ? (
            <ol className="ad-step-list" key={idx}>
              {block.items.map((item, i) => (
                <li key={i}>{parseInlineContent(item)}</li>
              ))}
            </ol>
          ) : (
            <ul className="ad-doc-list" key={idx}>
              {block.items.map((item, i) => (
                <li key={i}>{parseInlineContent(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "note") {
          return (
            <div className="ad-note" key={idx}>
              <strong>Note:</strong> {parseInlineContent(block.text)}
            </div>
          );
        }
        if (block.type === "table") {
          return (
            <div className="ad-wrap-scroll" key={idx}>
              <table className="ad-table">
                {block.columns && block.columns.length ? (
                  <thead>
                    <tr>
                      {block.columns.map((col, c) => (
                        <th key={c}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                ) : null}
                <tbody>
                  {(block.rows || []).map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => (
                        <td key={c}>{parseInlineContent(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {block.caption && (
                <p className="ad-table-caption">{block.caption}</p>
              )}
            </div>
          );
        }
        if (block.type === "image") {
          return (
            <figure className="ad-content-figure" key={idx}>
              <img
                className="ad-content-media"
                src={block.source}
                alt={block.caption || block.text || ""}
                loading="lazy"
              />
              {block.caption && (
                <figcaption className="ad-table-caption">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }
        if (block.type === "faq") {
          return <FaqSection key={idx} faq={block.items.map((i) => ({ question: i, answer: block.text }))} />;
        }
        return <p className="ad-paragraph" key={idx}>{parseInlineContent(block.text)}</p>;
      })}
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getAdmitCardPost(slug);
  if (!post) {
    return {
      title: "Admit Card Details | JobCareer",
    };
  }
  const description =
    (post.shortDescription || post.title).length > 160
      ? `${(post.shortDescription || post.title).slice(0, 157)}...`
      : post.shortDescription || post.title;
  const ogImage = post.featuredImage
    ? [post.featuredImage]
    : undefined;
  return {
    title: `${post.title} | JobCareer`,
    description,
    alternates: {
      canonical: `https://jobcareer.in/admit-card/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | JobCareer`,
      description,
      url: `https://jobcareer.in/admit-card/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | JobCareer`,
      description,
      images: ogImage,
    },
  };
}

export default async function AdmitCardDetailPage({ params }) {
  const { slug } = await params;
  const post = await loadAdmitCard(slug);
  if (!post) {
    notFound();
  }

  const published = formatDisplayDate(post.publishedAt || post.date);
  const updated = post.updatedAt ? formatDisplayDate(post.updatedAt) : null;

  const iso = (value) => {
    if (!value) return undefined;
    try {
      const d = new Date(value);
      return isNaN(d.getTime()) ? value : d.toISOString();
    } catch {
      return value;
    }
  };
  const canonicalUrl = `https://jobcareer.in/admit-card/${post.slug}`;
  const datePublished = iso(post.publishedAt) || iso(post.createdAt);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.shortDescription || post.title,
    image: post.featuredImage ? [post.featuredImage] : undefined,
    datePublished: datePublished,
    dateModified: iso(post.updatedAt) || datePublished,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    author: { "@type": "Organization", name: "JobCareer", url: "https://jobcareer.in" },
    publisher: {
      "@type": "Organization",
      name: "JobCareer",
      url: "https://jobcareer.in",
    },
    keywords: [post.category, post.org, post.status].filter(Boolean).join(", "),
    inLanguage: "en-IN",
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://jobcareer.in/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Admit Card",
        item: "https://jobcareer.in/category/admit-card",
      },
      { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
    ],
  };
  const jsonLd = [articleJsonLd, breadcrumbJsonLd]
    .filter((o) => JSON.stringify(o).indexOf('"undefined"') === -1);

  return (
    <main className="jh-detail-page ad-detail-page">
      <div className="jh-container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Breadcrumb title={post.title} />

        <header className="ad-hero">
          <div className="ad-hero-orb ad-hero-orb-1" aria-hidden="true" />
          <div className="ad-hero-orb ad-hero-orb-2" aria-hidden="true" />
          <div className="ad-hero-top">
            <span className={`ad-badge ad-badge-${post.tagColor || "sky"}`}>
              {post.category}
            </span>
            <span className="ad-status">
              {post.status}
            </span>
          </div>

          <h1 className="ad-title">{post.title}</h1>

          <div className="ad-hero-meta">
            {published && (
              <span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={DATE_ICON} /></svg>
                Published: {published}
              </span>
            )}
            {updated && (
              <span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={DATE_ICON} /></svg>
                Updated: {updated}
              </span>
            )}
            <span className="ad-hero-cat">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={FILE_ICON} /></svg>
              Category: Admit Card
            </span>
            {post.readingTime && (
              <span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
                {post.readingTime} min read
              </span>
            )}
          </div>

          <ShareButtons title={post.title} />
        </header>

        <div className="ad-detail-grid">
          <article className="ad-article">
            <QuickFacts post={post} />

            <FeaturedImage post={post} />

            <section className="ad-section">
              <p className="ad-intro">
                {post.shortDescription || post.title}
              </p>
            </section>

            <ImportantDates post={post} />
            <CardDetails post={post} />

            <ContentBlocks blocks={post.content} />

            <EligibilitySection post={post} />
            <ExamCentreInfo post={post} />
            <DocumentsRequired post={post} />
            <HowToDownload post={post} />

            <ImportantLinks post={post} />

            <Instructions post={post} />

            <FaqSection faq={post.faq} />

            <RelatedCards currentPost={post} />
          </article>

          <Sidebar />
        </div>
      </div>
    </main>
  );
}