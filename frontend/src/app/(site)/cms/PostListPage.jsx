import Link from "next/link";
import { categoryLabel } from "./cmsServer";

export function PostCard({ post, allCategories = false }) {
  const meta = categoryLabel(post.category);
  return (
    <Link className="ja-post-grid-item" href={`/post/${post.slug}`}>
      <div className="ja-post-thumb-wrap">
        {post.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ja-post-thumb-img" src={post.featuredImage} alt={post.title} loading="lazy" />
        ) : (
          <div className="ja-post-thumb-placeholder">
            <span className="ja-post-thumb-tag">{meta}</span>
          </div>
        )}
      </div>
      <div className="ja-post-grid-detail">
        <h3 className="ja-post-grid-title">{post.title}</h3>
        <div className="ja-post-grid-meta">
          {post.organization && (
            <span className="ja-post-meta-badge ja-meta-brand">{post.organization}</span>
          )}
          <span className="ja-post-meta-badge">
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          {post.lastDate && <span className="ja-post-meta-badge">Last: {post.lastDate}</span>}
        </div>
      </div>
    </Link>
  );
}

export function PostListPage({
  category,
  allCategories = false,
  title,
  description,
  posts,
  page,
  totalPages,
  total,
}) {
  return (
    <div className="ja-home">
      <div className="ja-home-inner">
        <section className="ja-guides-sec ja-cms-sec">
          <div className="ja-bar ja-bar-blue">
            <h2 className="ja-bar-title">{title}</h2>
          </div>
          {description && <p className="ja-cms-desc">{description}</p>}

          {posts.length === 0 ? (
            <div className="ja-row-empty">
              No posts published yet in this section. Please check back soon.
            </div>
          ) : (
            <div className="ja-post-grid">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} allCategories={allCategories} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="ja-pagination">
              {page > 1 && (
                <Link className="ja-pg-btn" href={page - 1 > 1 ? `?page=${page - 1}` : "?"}>
                  ← Previous
                </Link>
              )}
              <span className="ja-pg-info">
                Page {page} of {totalPages} ({total} posts)
              </span>
              {page < totalPages && (
                <Link className="ja-pg-btn" href={`?page=${page + 1}`}>
                  Next →
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}