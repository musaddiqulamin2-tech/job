import Link from "next/link";

/**
 * Reusable category pagination powered by Next.js Links so browser
 * back/forward and direct URLs work without any client state.
 *
 * Page 1 always points at `basePath` (e.g. /category/job) and pages 2+
 * at `${basePath}/page/N`.
 *
 * For a large number of pages it renders a compact window with an ellipsis,
 * e.g. `1 2 3 … 10`. Below 8 pages every page number is rendered.
 */
function getPageWindow(current, totalPages) {
  const total = Math.max(1, Number(totalPages) || 1);
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const window = [];
  const start = Math.max(3, current - 1);
  const end = Math.min(total - 2, current + 1);

  window.push(1, 2);
  if (start > 3) window.push("…");
  for (let i = start; i <= end; i += 1) window.push(i);
  if (end < total - 2) window.push("…");
  window.push(total - 1, total);

  return window;
}

export default function Pagination({ currentPage, totalPages, basePath, label = "Pagination" }) {
  const current = Number(currentPage) || 1;
  const total = Number(totalPages) || 1;
  const pageUrl = (n) => (n === 1 ? basePath : `${basePath}/page/${n}`);
  const pages = getPageWindow(current, total);

  return (
    <nav className="ac-pagination" aria-label={label} role="navigation">
      {current > 1 && (
        <Link className="ja-pag-btn ja-pag-link" href={pageUrl(current - 1)}>
          ← Previous
        </Link>
      )}

      {pages.map((n, i) =>
        n === "…" ? (
          <span className="ja-pag-ellipsis" aria-hidden="true" key={`e-${i}`}>
            …
          </span>
        ) : (
          <Link
            key={n}
            className={`ja-pag-btn ja-pag-link ${n === current ? "active" : ""}`}
            aria-current={n === current ? "page" : undefined}
            href={pageUrl(n)}
          >
            {n}
          </Link>
        )
      )}

      {current < total && (
        <Link className="ja-pag-btn ja-pag-link" href={pageUrl(current + 1)}>
          Next →
        </Link>
      )}
    </nav>
  );
}