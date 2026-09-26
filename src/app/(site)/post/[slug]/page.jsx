import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, categoryLabel } from "../../cms/cmsServer";
import { CMS_LISTING_META } from "../../cms/meta";
import { PostCard } from "../../cms/PostListPage";

function fmtLong(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Section({ label, value }) {
  if (!value) return null;
  return (
    <div className="ja-detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found | JobCareer" };
  return {
    title: post.seo?.title || `${post.title} | JobCareer`,
    description: post.seo?.description || post.summary || (post.content.html || "").slice(0, 150),
    robots: post.seo?.robots || "index, follow",
    alternates: post.seo?.canonical ? { canonical: post.seo.canonical } : undefined,
    openGraph: {
      title: post.title,
      description: post.seo?.description || post.summary || "",
      images: post.seo?.image || post.featuredImage || undefined,
      type: "article",
    },
  };
}

export default async function PostDetailPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const listConfig = {
    "government-job": CMS_LISTING_META["government-job"],
    "private-job": CMS_LISTING_META["private-job"],
    "admit-card": CMS_LISTING_META["admit-card"],
    result: CMS_LISTING_META.result,
    admission: CMS_LISTING_META.admission,
    "answer-key": CMS_LISTING_META["answer-key"],
    syllabus: CMS_LISTING_META.syllabus,
  };

  const meta = post.seo || {};
  const categoryRoute = {
    "government-job": "/government-jobs",
    "private-job": "/private-jobs",
    "admit-card": "/admit-cards",
    result: "/results",
    admission: "/admissions",
    "answer-key": "/answer-keys",
    syllabus: "/syllabus",
  }[post.category] || "/jobs";

  const related = await getRelatedPosts(post.category, post.slug);

  return (
    <div className="ja-home">
      <div className="ja-home-inner">
        <div className="ja-container">
          <nav className="ja-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href={categoryRoute}>{categoryLabel(post.category)}</Link>
            <span>/</span>
            <span className="ja-breadcrumb-current">{post.title}</span>
          </nav>

          <article className="ja-detail-card">
            <header className="ja-detail-header">
              <h1 className="ja-detail-title">{post.title}</h1>
              <div className="ja-post-grid-meta">
                <span className="ja-post-meta-badge ja-meta-brand">
                  <Link href={categoryRoute}>{categoryLabel(post.category)}</Link>
                </span>
                <span className="ja-post-meta-badge">Published: {fmtLong(post.publishedAt || post.createdAt)}</span>
                {post.organization && <span className="ja-post-meta-badge">By {post.organization}</span>}
                {post.author && <span className="ja-post-meta-badge">By {post.author}</span>}
              </div>
            </header>

            {post.featuredImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="ja-detail-hero" src={post.featuredImage} alt={post.title} />
            )}

            {(
              post.organization ||
              post.vacancyCount ||
              post.location ||
              post.qualification ||
              post.ageLimit ||
              post.applicationFee ||
              post.lastDate ||
              post.examDate ||
              post.admitCardDate ||
              post.resultDate
            ) && (
              <aside className="ja-detail-facts">
                <h2>Key Details</h2>
                <div className="ja-detail-grid">
                  <Section label="Organization" value={post.organization} />
                  <Section label="Vacancies" value={post.vacancyCount ? `${post.vacancyCount}` : ""} />
                  <Section label="Location" value={post.location} />
                  <Section label="Qualification" value={post.qualification} />
                  <Section label="Age Limit" value={post.ageLimit} />
                  <Section label="Application Fee" value={post.applicationFee} />
                  <Section label="Last Date" value={post.lastDate} />
                  <Section label="Exam Date" value={post.examDate} />
                  <Section label="Admit Card" value={post.admitCardDate} />
                  <Section label="Result Date" value={post.resultDate} />
                </div>
              </aside>
            )}

            {post.summary && <p className="ja-detail-summary">{post.summary}</p>}

            {post.content?.html && (
              <div className="t-prose ja-detail-body" dangerouslySetInnerHTML={{ __html: post.content.html }} />
            )}

            {post.importantLinks.length > 0 && (
              <section className="ja-detail-links">
                <h2>Important Links</h2>
                <div className="ja-detail-link-grid">
                  {(post.importantLinks).map((l, i) => (
                    <a key={i} className="ja-detail-link-btn" href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {post.tags.length > 0 && (
              <div className="ja-detail-tags">
                {post.tags.map((t) => (
                  <span key={t} className="ja-tag">#{t}</span>
                ))}
              </div>
            )}
          </article>
        </div>

        {related.length > 0 && (
          <div className="ja-container">
            <h2 className="ja-section-title">{categoryLabel(post.category)} — Related Posts</h2>
            <div className="ja-post-grid">
              {related.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}