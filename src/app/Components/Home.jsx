"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
  "Jammu and Kashmir", "Ladakh",
];

const MOCK_TESTS = [
  "General Knowledge Test",
  "Quantitative Aptitude",
  "Logical Reasoning",
  "English Language",
  "Current Affairs",
];

const FREE_TOOLS = [
  "Resume Builder",
  "Image Resizer",
  "PDF Converter",
  "Age Calculator",
  "Online Typing",
];

const SOCIAL_CHANNELS = [
  { label: "WhatsApp Channel", Icon: WhatsAppIcon, cls: "ja-soc-wa" },
  { label: "YouTube", Icon: YoutubeIcon, cls: "ja-soc-yt" },
  { label: "Telegram", Icon: TelegramIcon, cls: "ja-soc-tg" },
  { label: "Instagram", Icon: InstagramIcon, cls: "ja-soc-ig" },
  { label: "Facebook", Icon: FacebookIcon, cls: "ja-soc-fb" },
];

const FALLBACK_CATEGORIES = [
  "Bank Jobs",
  "Government Jobs",
  "IT Jobs",
  "Teaching Jobs",
  "Defence Jobs",
];

const GUIDES = [
  { title: "Resume Building Guide", meta: "JobCareer", price: "₹49.00/-" },
  { title: "Interview Preparation Guide", meta: "JobCareer", price: "₹99.00/-" },
  { title: "Salary Negotiation Guide", meta: "JobCareer", price: "₹79.00/-" },
];

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671Z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 576 512" fill="currentColor" aria-hidden="true">
      <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
      <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 320 512" fill="currentColor" aria-hidden="true">
      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0Z" />
      <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7Z" />
    </svg>
  );
}

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearLocation, setNearLocation] = useState("All");
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        if (data.success) {
          setJobs(data.jobs);
          setFilteredJobs(data.jobs);
        }
      } catch (error) {
        console.error("Failed to load jobs", error);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  useEffect(() => {
    setFilteredJobs(
      jobs.filter(
        (job) =>
          nearLocation === "All" ||
          (job.location || "").toLowerCase().includes(nearLocation.toLowerCase())
      )
    );
  }, [nearLocation, jobs]);

  const latestRows = filteredJobs.slice(0, 10);
  const updatesRows = filteredJobs.slice(10, 20);
  const categories = [
    ...new Set([
      ...jobs.map((j) => j.category).filter(Boolean),
      ...FALLBACK_CATEGORIES,
    ]),
  ];

  return (
    <main className="ja-home">
      <div className="ja-home-inner">
        <div className="ja-join-row">
          <a className="ja-join ja-join-wa" href="#" rel="nofollow">
            <span className="ja-join-txt">
              <WhatsAppIcon />
              WhatsApp Channel
            </span>
            <span className="ja-join-btn">Join Now</span>
          </a>
          <a className="ja-join ja-join-android" href="#" rel="nofollow">
            <span className="ja-join-txt">
              <AndroidIcon />
              Android App
            </span>
            <span className="ja-join-btn">Get Now</span>
          </a>
        </div>

        <div className="ja-filter-box">
          <div className="ja-filter-left">
            <p className="ja-filter-title">Find Jobs Near You</p>
            <select
              className="ja-filter-select"
              value={nearLocation}
              onChange={(e) => setNearLocation(e.target.value)}
              aria-label="Filter jobs by state"
            >
              <option value="All">All India</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
          <Link href="/offer-job" className="ja-filter-post">
            + Post a Job
          </Link>
        </div>

        <div className="ja-grid" id="ja-news">
          <div className="ja-container">
            <h2 className="ja-section-title">Latest Updates</h2>
            {loading ? (
              <div className="ja-row-empty">
                <span className="jh-spinner" /> Loading…
              </div>
            ) : latestRows.length > 0 ? (
              latestRows.map((job) => (
                <Link className="ja-post-row" href={`/job/${job._id}`} key={job._id}>
                  {job.title}
                </Link>
              ))
            ) : (
              <div className="ja-row-empty">
                No jobs found in your area yet. Check back soon.
              </div>
            )}
            <a className="ja-more-btn" href="#ja-news">
              View More <ChevronIcon />
            </a>
          </div>

          <div className="ja-container">
            <h2 className="ja-section-title">Job Updates</h2>
            {loading ? (
              <div className="ja-row-empty">
                <span className="jh-spinner" /> Loading…
              </div>
            ) : updatesRows.length > 0 ? (
              updatesRows.map((job) => (
                <Link className="ja-post-row" href={`/job/${job._id}`} key={job._id}>
                  {job.title}
                </Link>
              ))
            ) : (
              <div className="ja-row-empty">
                No jobs found in your area yet. Check back soon.
              </div>
            )}
            <a className="ja-more-btn" href="/offer-job">
              Post Your Job <ChevronIcon />
            </a>
          </div>

          <div className="ja-container">
            <h2 className="ja-section-title">Top Categories</h2>
            {categories.map((cat) => (
              <a className="ja-widget-row" href="#ja-news" key={cat}>
                <ChevronIcon />
                {cat}
              </a>
            ))}
            <a className="ja-more-btn" href="/offer-job">
              Post Your Job <ChevronIcon />
            </a>
          </div>
        </div>

        <div className="ja-grid">
          <div className="ja-container">
            <h2 className="ja-section-title">Online Mock Tests</h2>
            {MOCK_TESTS.map((t) => (
              <a className="ja-widget-row" href="#" key={t}>
                <ChevronIcon />
                {t}
              </a>
            ))}
            <a className="ja-more-btn" href="#">
              View More <ChevronIcon />
            </a>
          </div>

          <div className="ja-container">
            <h2 className="ja-section-title">Free Online Tools</h2>
            {FREE_TOOLS.map((t) => (
              <a className="ja-widget-row" href="#" key={t}>
                <ChevronIcon />
                {t}
              </a>
            ))}
            <a className="ja-more-btn" href="#">
              View More <ChevronIcon />
            </a>
          </div>

          <div className="ja-container">
            <h2 className="ja-section-title">Social Media Channels</h2>
            {SOCIAL_CHANNELS.map((s) => (
              <a className={`ja-widget-row ja-soc-row ${s.cls}`} href="#" key={s.label}>
                <s.Icon />
                {s.label}
              </a>
            ))}
            <a className="ja-more-btn" href="/contact">
              Contact Us <ChevronIcon />
            </a>
          </div>
        </div>

        <section className="ja-guides-sec">
          <div className="ja-bar ja-bar-blue">
            <h2 className="ja-bar-title">Our Job Guides</h2>
            <a className="ja-bar-btn" href="#">
              View All <ChevronIcon />
            </a>
          </div>
          <div className="ja-post-grid">
            {GUIDES.map((g) => (
              <a className="ja-post-grid-item" href="#" key={g.title}>
                <div className="ja-post-grid-thumb">
                  <BookIcon />
                </div>
                <div>
                  <h3 className="ja-post-grid-title">{g.title}</h3>
                  <div className="ja-post-grid-meta">
                    <span>
                      <CheckIcon /> {g.meta}
                    </span>
                    <span>{g.price}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="ja-about-sec">
          <div className="ja-bar ja-bar-red">
            <h2 className="ja-bar-title">About JobCareer</h2>
            <a className="ja-bar-btn" href="/contact">
              Read More <ChevronIcon />
            </a>
          </div>
          <div className="ja-about-body">
            <p>
              JobCareer.in is one of the most trusted job platforms in India,
              helping thousands of job seekers connect with verified employers
              across every state. From government recruitments to private-sector
              openings, we bring the latest vacancies straight to your screen.
            </p>
            <p>
              At JobCareer, we believe finding a job should be simple, secure,
              and transparent. Every listing on our platform is verified by our
              team, so you can apply with full confidence and never worry about
              fake posts or scams.
            </p>
            <p>
              Our platform offers instant application features, smart location
              filters, expert career guides, and free tools like resume builder
              and age calculator — everything you need to stay ahead in your
              job search, all in one place.
            </p>
            <p>
              Stay ahead in your job search — apply to the latest openings
              today and get one step closer to your dream career with
              JobCareer.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}