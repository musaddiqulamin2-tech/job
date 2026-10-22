import { POST_CATEGORY_META } from "../../../lib/postMeta";

const CATEGORY_ROUTES = {
  "government-job": "/government-jobs",
  "private-job": "/private-jobs",
  "admit-card": "/admit-cards",
  result: "/results",
  admission: "/admissions",
  "answer-key": "/answer-keys",
  syllabus: "/syllabus",
};

function str(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function toList(value) {
  if (Array.isArray(value)) return value.map((v) => str(v)).filter(Boolean);
  return str(value)
    .split(/\r?\n/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="ja-detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Block({ title, children }) {
  if (!children) return null;
  return (
    <section className="pv-block">
      <h3 className="pv-block-title">{title}</h3>
      {children}
    </section>
  );
}

function DatesTable({ rows }) {
  const items = rows.filter((r) => r.value);
  if (items.length === 0) return null;
  return (
    <div className="pv-table-wrap">
      <table className="pv-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function JobPreview({ post, showSeo = true }) {
  if (!post) return null;

  const seo = post.seo || {};
  const category = post.category || "government-job";
  const categoryMeta = POST_CATEGORY_META[category];
  const categoryLabel = categoryMeta ? categoryMeta.label : "Job";
  const categoryRoute = CATEGORY_ROUTES[category] || "/jobs";

  const tags = toList(post.tags);
  const selectionProcess = toList(post.selectionProcess);
  const howToApply = toList(post.howToApply);
  const responsibilities = toList(post.responsibilities);
  const importantLinks = Array.isArray(post.importantLinks) ? post.importantLinks.filter((l) => l && (l.label || l.url)) : [];

  const summary = str(post.summary);
  const contentHtml = str(post.contentHtml);
  const eligibility = str(post.eligibility);
  const qualification = str(post.qualification);
  const ageLimit = str(post.ageLimit);
  const ageRelaxation = str(post.ageRelaxation);
  const applicationUrl = str(post.applicationUrl);
  const notificationUrl = str(post.officialNotificationUrl);
  const organization = str(post.organization);
  const location = str(post.location);
  const vacancyCount = str(post.vacancyCount);
  const applicationFee = str(post.applicationFee);
  const paymentMode = str(post.paymentMode);
  const experience = str(post.experience);
  const jobType = str(post.jobType);
  const salary = str(post.salary);
  const status = str(post.status);

  const factRows = [
    <Row key="org" label="Organization" value={organization} />,
    <Row key="vac" label="Total Vacancies" value={vacancyCount} />,
    <Row key="loc" label="Location" value={location} />,
    <Row key="type" label="Job Type" value={jobType} />,
    <Row key="exp" label="Experience" value={experience} />,
    <Row key="qual" label="Qualification" value={qualification} />,
    <Row key="age" label="Age Limit" value={ageLimit} />,
    <Row key="agerelax" label="Age Relaxation" value={ageRelaxation} />,
    <Row key="fee" label="Application Fee" value={applicationFee} />,
    <Row key="pay" label="Payment Mode" value={paymentMode} />,
    <Row key="salary" label="Salary" value={salary} />,
    <Row key="start" label="Application Start Date" value={str(post.startDate)} />,
    <Row key="last" label="Last Date to Apply" value={str(post.lastDate)} />,
    <Row key="exam" label="Exam Date" value={str(post.examDate)} />,
    <Row key="admit" label="Admit Card Date" value={str(post.admitCardDate)} />,
    <Row key="result" label="Result Date" value={str(post.resultDate)} />,
    <Row key="expires" label="Expires At" value={str(post.expiresAt)} />,
  ].filter(Boolean);

  return (
    <div className="pv-preview">
      <article className="ja-detail-card">
        <header className="ja-detail-header">
          <h1 className="ja-detail-title">{str(post.title) || "Untitled job post"}</h1>
          <div className="pv-meta-row">
            <span className="ja-post-meta-badge pv-badge">{categoryLabel}</span>
            {organization && <span className="ja-post-meta-badge pv-badge">{organization}</span>}
            {location && <span className="ja-post-meta-badge pv-badge">{location}</span>}
            {status && <span className="ja-post-meta-badge pv-badge pv-badge-draft">Status: {status}</span>}
            {post.slug && <span className="ja-post-meta-badge pv-badge">/{post.slug}</span>}
          </div>
        </header>

        {post.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ja-detail-hero" src={post.featuredImage} alt={str(post.title) || "Featured image"} />
        ) : (
          <p className="pv-empty">No featured image selected yet.</p>
        )}

        {summary && <p className="ja-detail-summary">{summary}</p>}

        {factRows.length > 0 && (
          <aside className="ja-detail-facts">
            <h2>Key Details</h2>
            <div className="ja-detail-grid">{factRows}</div>
          </aside>
        )}

        <Block title="Detailed Eligibility">
          {eligibility ? (
            <p className="pv-text">{eligibility}</p>
          ) : (
            <p className="pv-empty">No eligibility details added yet.</p>
          )}
        </Block>

        <Block title="Age Relaxation">
          {ageRelaxation ? (
            <p className="pv-text">{ageRelaxation}</p>
          ) : (
            <p className="pv-empty">No age relaxation details added yet.</p>
          )}
        </Block>

        <Block title="Important Dates">
          <DatesTable
            rows={[
              { label: "Application Start Date", value: str(post.startDate) },
              { label: "Last Date to Apply", value: str(post.lastDate) },
              { label: "Admit Card Release", value: str(post.admitCardDate) },
              { label: "Exam Date", value: str(post.examDate) },
              { label: "Result Date", value: str(post.resultDate) },
            ]}
          />
        </Block>

        <Block title="Application Links">
          <div className="pv-link-row">
            {applicationUrl ? (
              <a className="ja-detail-link-btn" href={applicationUrl} target="_blank" rel="noopener noreferrer">
                Apply Online
              </a>
            ) : (
              <span className="pv-empty">Apply Online URL not added yet.</span>
            )}
            {notificationUrl && (
              <a className="ja-detail-link-btn pv-link-secondary" href={notificationUrl} target="_blank" rel="noopener noreferrer">
                Official Notification
              </a>
            )}
          </div>
        </Block>

        {selectionProcess.length > 0 && (
          <Block title="Selection Process">
            <ul className="pv-list">
              {selectionProcess.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </Block>
        )}

        {responsibilities.length > 0 && (
          <Block title="Job Responsibilities">
            <ul className="pv-list">
              {responsibilities.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </Block>
        )}

        {howToApply.length > 0 && (
          <Block title="How to Apply">
            <ol className="pv-list">
              {howToApply.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </Block>
        )}

        {contentHtml && (
          <div className="t-prose ja-detail-body" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        )}

        {importantLinks.length > 0 && (
          <section className="ja-detail-links">
            <h2>Important Links</h2>
            <div className="ja-detail-link-grid">
              {importantLinks.map((l, i) => (
                <a key={i} className="ja-detail-link-btn pv-link-secondary" href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.label || l.url}
                </a>
              ))}
            </div>
          </section>
        )}

        {tags.length > 0 && (
          <div className="ja-detail-tags">
            {tags.map((t, i) => (
              <span key={i} className="ja-tag">
                #{t}
              </span>
            ))}
          </div>
        )}
      </article>

      {showSeo && (
        <section className="pv-seo">
          <h3 className="pv-block-title">SEO Metadata</h3>
          <div className="pv-seo-grid">
            <div className="pv-seo-item">
              <span>SEO Title</span>
              <strong>{str(seo.title) || str(post.title) || "—"}</strong>
            </div>
            <div className="pv-seo-item">
              <span>Meta Description</span>
              <strong>{str(seo.description) || summary || "—"}</strong>
            </div>
            <div className="pv-seo-item">
              <span>Canonical URL</span>
              <strong>{str(seo.canonical) || "—"}</strong>
            </div>
            <div className="pv-seo-item">
              <span>Robots</span>
              <strong>{str(seo.robots) || "index, follow"}</strong>
            </div>
            <div className="pv-seo-item">
              <span>Category / Route</span>
              <strong>{categoryLabel} ({categoryRoute})</strong>
            </div>
            <div className="pv-seo-item">
              <span>OG Image</span>
              <strong>{str(seo.image) || str(post.featuredImage) || "—"}</strong>
            </div>
          </div>
          {seo.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="pv-seo-image" src={seo.image} alt="OG image preview" />
          ) : null}
        </section>
      )}
    </div>
  );
}
