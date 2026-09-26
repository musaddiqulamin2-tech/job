import Link from "next/link";
import { anmAdmissionData, anmArticleSections } from "../../lib/anmAdmissionData";
import { getAdmissionPosts, getSampleJobs, getSampleResults } from "../../lib/categoryData";
import AdmissionSidebar from "../../Components/admission/AdmissionSidebar";
import AdmissionCard from "../../Components/admission/AdmissionCard";
import TableOfContents from "../../Components/admission/TableOfContents";
import FAQ from "../../Components/admission/FAQ";
import ArticleTable from "../../Components/admission/ArticleTable";
import ImportantLinks from "../../Components/admission/ImportantLinks";
import ImportantDates from "../../Components/admission/ImportantDates";
import ReadingProgress from "../../Components/admission/ReadingProgress";
import ShareButtons from "../admission/[slug]/ShareButtons";

export const dynamic = "force-dynamic";

const PAGE_URL = "https://jobcareer.in/assam-anm-admission/";

export const metadata = {
  title: anmAdmissionData.metaTitle,
  description: anmAdmissionData.metaDescription,
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  openGraph: {
    title: anmAdmissionData.metaTitle,
    description: anmAdmissionData.metaDescription,
    url: PAGE_URL,
    type: "article",
    siteName: "JobCareer",
    article: {
      tag: ["ANM Admission", "SSUHS", "Nursing Admission", "Assam"],
    },
  },
  twitter: {
    card: "summary_large_image",
    title: anmAdmissionData.metaTitle,
    description: anmAdmissionData.metaDescription,
  },
};

function Section({ id, title, children }) {
  return (
    <section id={id} className="ad-section ad-article-section">
      <h2 className="ad-section-h">{title}</h2>
      {children}
    </section>
  );
}

function QuickInfoSection() {
  const { quickInfo } = anmAdmissionData;
  const facts = [
    { label: "Exam", value: quickInfo[0].value },
    { label: "Total Seats", value: quickInfo[5].value },
    { label: "Application Start", value: quickInfo[7].value },
    { label: "Last Date", value: quickInfo[8].value },
    { label: "Admit Card", value: quickInfo[9].value },
    { label: "Exam Date", value: quickInfo[10].value },
  ];
  return (
    <div id="anm-overview" className="ad-section ad-article-section">
      <h2 className="ad-section-h">Assam ANM Admission 2026 – Overview</h2>
      <p className="ad-intro">{anmAdmissionData.intro}</p>

      <div className="ad-facts" aria-label="Key facts">
        <div className="ad-facts-grid">
          {facts.map((f) => (
            <div className="ad-fact" key={f.label}>
              <span className="ad-fact-label">{f.label}</span>
              <span className="ad-fact-value">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      <ArticleTable
        title="SSUHS ANM Entrance Examination 2026 – Quick Information"
        rows={quickInfo.map((q) => [q.label, q.value])}
      />

      <ImportantLinks
        links={[
          { label: "Application Form", cta: "Apply Now", url: anmAdmissionData.links.application.url },
          { label: "Official Notification", cta: "Download Notification", url: anmAdmissionData.links.notification.url },
          { label: "Official Website", cta: "Visit Website", url: anmAdmissionData.links.officialWebsite.url },
        ]}
      />
    </div>
  );
}

function AdmissionDetails() {
  return (
    <Section id="admission-details" title="Admission Details">
      <ArticleTable
        rows={anmAdmissionData.admissionDetails.map((d) => [d.label, d.value])}
      />
    </Section>
  );
}

function Eligibility() {
  const { eligibility, eligibilityNote } = anmAdmissionData;
  return (
    <Section id="eligibility" title="Eligibility Criteria">
      <div className="ad-elig-grid">
        {eligibility.map((e) => (
          <div className="ad-elig-block" key={e.title}>
            <h3 className="ad-elig-title">{e.title}</h3>
            <ul className="ad-doc-list">
              {e.points.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Note text={eligibilityNote} />
    </Section>
  );
}

function TrainingSchools() {
  const { trainingSchools } = anmAdmissionData;
  return (
    <Section id="training-schools" title="Training Schools & Seat Distribution">
      <div className="ad-seat-card">
        <div className="ad-seat-grid">
          <div className="ad-seat-num">{trainingSchools.totalSchools}</div>
          <div className="ad-seat-label">Government ANM Training Schools</div>
        </div>
        <div className="ad-seat-grid">
          <div className="ad-seat-num">{trainingSchools.totalSeats}</div>
          <div className="ad-seat-label">Total Seats (2026-27)</div>
        </div>
      </div>
      <Note text={trainingSchools.note} />
    </Section>
  );
}

function ExamPattern() {
  const { examPattern } = anmAdmissionData;
  return (
    <Section id="exam-pattern" title="Exam Pattern">
      <ArticleTable
        title={examPattern.tableTitle}
        headers={["Subject", "Questions", "Marks"]}
        rows={examPattern.rows.map((r) => [r.subject, r.questions, r.marks])}
      />
      <div className="ad-pattern-cards">
        {examPattern.cards.map((c) => (
          <div className="ad-pattern-card" key={c.label}>
            <span className="ad-pattern-label">{c.label}</span>
            <span className="ad-pattern-value">{c.value}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Syllabus() {
  const { syllabus } = anmAdmissionData;
  return (
    <Section id="syllabus" title="Syllabus">
      <div className="ad-syllabus-grid">
        {syllabus.sections.map((s) => (
          <div className="ad-syllabus-block" key={s.title}>
            <h3 className="ad-sub-heading">{s.title}</h3>
            <ul className="ad-doc-list">
              {s.points.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Note text={syllabus.note} />
    </Section>
  );
}

function SelectionProcess() {
  return (
    <Section id="selection-process" title="Selection Process Timeline">
      <ol className="ad-timeline">
        {anmAdmissionData.selectionProcess.map((step, idx) => (
          <li className="ad-timeline-item" key={step.title}>
            <span className="ad-timeline-num">{idx + 1}</span>
            <div className="ad-timeline-body">
              <h3 className="ad-timeline-title">{step.title}</h3>
              <p className="ad-timeline-desc">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function HowToApply() {
  return (
    <Section id="how-to-apply" title="How to Apply">
      <ol className="ad-step-list">
        {anmAdmissionData.howToApply.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
      <Note
        text={anmAdmissionData.howToApplyWarning}
        variant="warning"
      />
    </Section>
  );
}

function ImportantDocuments() {
  return (
    <Section id="important-documents" title="Important Documents">
      <ul className="ad-doc-list">
        {anmAdmissionData.requiredDocuments.map((d, idx) => (
          <li key={idx}>{d}</li>
        ))}
      </ul>
    </Section>
  );
}

function ImportantDatesSection() {
  return (
    <Section id="important-dates" title="Important Dates">
      <ImportantDates dates={anmAdmissionData.importantDates} />
    </Section>
  );
}

function ImportantLinksSection() {
  const { links } = anmAdmissionData;
  return (
    <Section id="important-links" title="Important Links">
      <ImportantLinks links={Object.values(links)} />
      <p className="ad-links-note">
        The direct application, notification and admit card links will be
        updated here on the official portal as they are published by SSUHS /
        DHSFW Assam.
      </p>
    </Section>
  );
}

function FaqSection() {
  return (
    <Section id="faq" title="Frequently Asked Questions (FAQ)">
      <FAQ items={anmAdmissionData.faq} firstOpen />
    </Section>
  );
}

function RelatedAdmissions() {
  const posts = getAdmissionPosts();
  const related = posts
    .filter((p) => p.slugKey !== "assam-anm-admission-2026")
    .slice(0, 4);

  return (
    <section className="ad-section ad-related-wrap">
      <h2 className="ad-section-h">Related Admissions</h2>
      {related.length > 0 ? (
        <div className="ad-land-grid">
          {related.map((post) => (
            <AdmissionCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="ad-muted">
          More related admission updates will be published soon.
        </p>
      )}
    </section>
  );
}

function Note({ text, variant = "info" }) {
  return (
    <div className={`ad-note ${variant === "warning" ? "ad-note-warning" : ""}`}>
      {text}
    </div>
  );
}

function scriptJsonLd() {
  const d = anmAdmissionData;
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: d.title,
    description: d.metaDescription,
    datePublished: "2026-09-08",
    dateModified: "2026-09-17",
    mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
    author: { "@type": "Organization", name: "JobCareer", url: "https://jobcareer.in" },
    publisher: { "@type": "Organization", name: "JobCareer", url: "https://jobcareer.in" },
    keywords: ["Assam ANM Admission 2026", "SSUHS ANM Entrance", "Nursing Admission", "DHSFW Assam"],
    inLanguage: "en-IN",
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://jobcareer.in/" },
      { "@type": "ListItem", position: 2, name: "Admission", item: "https://jobcareer.in/admission/" },
      { "@type": "ListItem", position: 3, name: "Assam ANM Admission 2026", item: PAGE_URL },
    ],
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return JSON.stringify([article, breadcrumb, faqPage]);
}

export default function AssamAnmAdmissionPage() {
  const d = anmAdmissionData;
  const sidebarAdmissions = getAdmissionPosts();
  const sidebarJobs = getSampleJobs();
  const sidebarResults = getSampleResults();

  return (
    <main className="jh-detail-page ad-detail-page">
      <ReadingProgress />
      <div className="jh-container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: scriptJsonLd() }}
        />

        <nav className="ad-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="ad-breadcrumb-sep">/</span>
          <Link href="/admission">Admission</Link>
          <span className="ad-breadcrumb-sep">/</span>
          <span className="ad-breadcrumb-current" aria-current="page">
            Assam ANM Admission 2026
          </span>
        </nav>

        <header className="ad-hero">
          <div className="ad-hero-orb ad-hero-orb-1" aria-hidden="true" />
          <div className="ad-hero-orb ad-hero-orb-2" aria-hidden="true" />
          <div className="ad-hero-top">
            <span className="ad-badge ad-badge-indigo">{d.category}</span>
            <span className="ad-status">{d.status}</span>
          </div>
          <h1 className="ad-title">{d.title}</h1>
          <div className="ad-hero-meta">
            <span>📅 Published: {d.published}</span>
            <span>🔄 Updated: {d.updated}</span>
            <span>⏱️ {d.readingTime} min read</span>
          </div>
          <ShareButtons title={d.title} />
        </header>

        <div className="ad-detail-grid">
          <div className="ad-article">
            <div className="ad-section ad-toc-wrap">
              <TableOfContents items={anmArticleSections} />
            </div>

            <QuickInfoSection />
            <AdmissionDetails />
            <Eligibility />
            <TrainingSchools />
            <ExamPattern />
            <Syllabus />
            <SelectionProcess />
            <HowToApply />
            <ImportantDocuments />
            <ImportantDatesSection />
            <ImportantLinksSection />
            <FaqSection />

            <div className="ad-section">
              <h2 className="ad-section-h">Share This Admission Update</h2>
              <ShareButtons title={d.title} />
            </div>

            <RelatedAdmissions />
          </div>

          <AdmissionSidebar
            admissions={sidebarAdmissions}
            jobs={sidebarJobs}
            results={sidebarResults}
          />
        </div>
      </div>
    </main>
  );
}