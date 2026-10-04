"use client";
import { apiFetch } from "../lib/api";

import Link from "next/link";
import { useEffect, useState } from "react";

const MOCK_TESTS = [
  {
    name: "General Knowledge Test",
    desc: "Test your knowledge",
    icon: "brain",
  },
  {
    name: "Quantitative Aptitude",
    desc: "Practice numbers and speed",
    icon: "calculator",
  },
  {
    name: "Logical Reasoning",
    desc: "Sharpen your problem solving",
    icon: "puzzle",
  },
  {
    name: "English Language",
    desc: "Improve grammar and vocabulary",
    icon: "language",
  },
  {
    name: "Current Affairs",
    desc: "Stay updated on latest events",
    icon: "globe",
  },
];

const FREE_TOOLS = [
  {
    name: "Resume Builder",
    desc: "Build your resume",
    icon: "file",
  },
  {
    name: "Image Resizer",
    desc: "Resize your images online",
    icon: "image",
  },
  {
    name: "PDF Converter",
    desc: "Convert your PDF files",
    icon: "pdf",
  },
  {
    name: "Age Calculator",
    desc: "Calculate your exact age",
    icon: "calculator",
  },
  {
    name: "Online Typing",
    desc: "Test your typing speed",
    icon: "keyboard",
  },
];

const SOCIAL_CHANNELS = [
  { label: "WhatsApp Channel", Icon: WhatsAppIcon, cls: "ja-soc-wa" },
  { label: "YouTube", Icon: YoutubeIcon, cls: "ja-soc-yt" },
  { label: "Telegram", Icon: TelegramIcon, cls: "ja-soc-tg" },
  { label: "Instagram", Icon: InstagramIcon, cls: "ja-soc-ig" },
  { label: "Facebook", Icon: FacebookIcon, cls: "ja-soc-fb" },
];

const CATEGORIES = [
  { name: "Technology", icon: "monitor" },
  { name: "Engineering", icon: "cog" },
  { name: "Design", icon: "pen" },
  { name: "Management", icon: "briefcase" },
  { name: "Data Science", icon: "chart" },
  { name: "Marketing", icon: "megaphone" },
  { name: "Bank Jobs", icon: "landmark" },
  { name: "Government Jobs", icon: "building" },
  { name: "IT Jobs", icon: "server" },
  { name: "Teaching Jobs", icon: "book" },
  { name: "Defence Jobs", icon: "shield" },
];

const GUIDES = [
  {
    title: "Resume Building Guide",
    meta: "JobCareer",
    price: "₹49.00/-",
    desc: "Build a professional resume and stand out to employers.",
  },
  {
    title: "Interview Preparation Guide",
    meta: "JobCareer",
    price: "₹99.00/-",
    desc: "Prepare confidently for your next interview round.",
  },
  {
    title: "Salary Negotiation Guide",
    meta: "JobCareer",
    price: "₹79.00/-",
    desc: "Learn how to negotiate and get the salary you deserve.",
  },
];

/* Line icons used by the card grids. Stroke based so they stay crisp at any size. */
const LINE_ICONS = {
  arrow: ["M5 12h14", "M13 6l6 6-6 6"],
  briefcase: [
    "M3 7h18v13H3z",
    "M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7",
    "M3 12.5h18",
  ],
  building: [
    "M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16",
    "M14 9.5h4a2 2 0 0 1 2 2V21",
    "M2 21h20",
    "M7.5 7.5h3M7.5 11.5h3M7.5 15.5h3",
  ],
  pin: [
    "M12 21.5s7-6 7-11.5a7 7 0 1 0-14 0c0 5.5 7 11.5 7 11.5z",
    "M12 12.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z",
  ],
  clock: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 7.5V12l3 1.8"],
  tag: ["M20.5 13.5 13 21 3 11V4h7l10.5 9.5z", "M7.5 7.5h.01"],
  rupee: [
    "M6.5 4h11",
    "M6.5 8.5h11",
    "M6.5 13h4.5a4.5 4.5 0 0 0 0-9",
    "M11 13l7 7",
  ],
  monitor: ["M3 4.5h18v11H3z", "M8.5 20h7", "M12 15.5V20"],
  server: ["M3 4.5h18v5.5H3z", "M3 14h18v5.5H3z", "M6.8 7.3h.01", "M6.8 16.8h.01"],
  cog: [
    "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z",
    "M18.9 14.4a1.5 1.5 0 0 0 .3 1.7l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1.5 1.5 0 0 0-1.7-.3 1.5 1.5 0 0 0-.9 1.4v.2a1.9 1.9 0 1 1-3.8 0v-.1a1.5 1.5 0 0 0-1-1.4 1.5 1.5 0 0 0-1.7.3l-.1.1a1.9 1.9 0 1 1-2.7-2.7l.1-.1a1.5 1.5 0 0 0 .3-1.7 1.5 1.5 0 0 0-1.4-.9h-.2a1.9 1.9 0 1 1 0-3.8h.1a1.5 1.5 0 0 0 1.4-1 1.5 1.5 0 0 0-.3-1.7l-.1-.1a1.9 1.9 0 1 1 2.7-2.7l.1.1a1.5 1.5 0 0 0 1.7.3h.1a1.5 1.5 0 0 0 .9-1.4v-.2a1.9 1.9 0 1 1 3.8 0v.1a1.5 1.5 0 0 0 .9 1.4 1.5 1.5 0 0 0 1.7-.3l.1-.1a1.9 1.9 0 1 1 2.7 2.7l-.1.1a1.5 1.5 0 0 0-.3 1.7v.1a1.5 1.5 0 0 0 1.4.9h.2a1.9 1.9 0 1 1 0 3.8h-.1a1.5 1.5 0 0 0-1.4.9z",
  ],
  pen: [
    "M12.5 19.5H20",
    "M16 3.5l4.5 4.5L9 19.5l-4.5 1 1-4.5z",
    "M14 5.5l4.5 4.5",
  ],
  chart: ["M3 3.5v17h18", "M7 16l3.8-4.3 3 2.4L20 7.5"],
  megaphone: [
    "M4 10.5v3a1 1 0 0 0 1 1h2l4.5 4V5.5l-4.5 4H5a1 1 0 0 0-1 1z",
    "M14.5 8.5a4.5 4.5 0 0 1 0 7",
    "M17.5 5.5a8.5 8.5 0 0 1 0 13",
  ],
  landmark: [
    "M12 3l9 4.5H3z",
    "M5.5 10.5v7M10 10.5v7M14 10.5v7M18.5 10.5v7",
    "M3 20.5h18",
  ],
  shield: ["M12 21.5s8-3.9 8-9.5v-7L12 2 4 5v7c0 5.6 8 9.5 8 9.5z"],
  book: [
    "M4 19.5A2.5 2.5 0 0 1 6.5 17H20",
    "M6.5 2.5H20v19H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2.5z",
  ],
  brain: [
    "M9.5 3.5A2.8 2.8 0 0 0 6.7 6.3 2.9 2.9 0 0 0 5 11.9a3 3 0 0 0 1 2.2 3 3 0 0 0 3.5 4.4V3.5z",
    "M14.5 3.5a2.8 2.8 0 0 1 2.8 2.8 2.9 2.9 0 0 1 1.7 5.6 3 3 0 0 1-1 2.2 3 3 0 0 1-3.5 4.4V3.5z",
    "M12 3.5v17",
  ],
  calculator: [
    "M6 3.5h12v17H6z",
    "M9 7.5h6",
    "M9.5 11.5h.01M12 11.5h.01M14.5 11.5h.01",
    "M9.5 15h.01M12 15h.01M14.5 15h.01",
    "M9.5 18h5",
  ],
  puzzle: [
    "M9.5 3.5h5v2.2a2 2 0 1 1 0 4h-.7v2.6h2.7a2 2 0 1 1 0 4h-2.7v4.2h-3v-4.2H8.1a2 2 0 1 1 0-4h2.7V9.7h-.7a2 2 0 1 1 0-4h.4z",
  ],
  language: ["M4 5.5h7", "M7.5 5.5v13", "M4 18.5h7", "M13.5 5.5h6.5", "M16.8 5.5v13"],
  globe: [
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
    "M3.4 9.5h17.2M3.4 14.5h17.2",
    "M12 3c-2.2 2.4-3.3 5.4-3.3 9s1.1 6.6 3.3 9c2.2-2.4 3.3-5.4 3.3-9S14.2 5.4 12 3z",
  ],
  file: [
    "M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z",
    "M14 3.5V8h4.5",
    "M9 13h6M9 16.5h4",
  ],
  pdf: [
    "M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z",
    "M14 3.5V8h4.5",
    "M8.5 17.5v-4h1.6a1.2 1.2 0 0 1 0 2.4H8.5M13 17.5v-4h1.2a1.3 1.3 0 0 1 0 2.6H13",
  ],
  image: [
    "M3.5 5h17v14h-17z",
    "M3.5 15.5l4.5-4.5 3.5 3.5 3-3 6 5.5",
    "M8.6 9.6h.01",
  ],
  keyboard: [
    "M3 6h18v12H3z",
    "M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01",
    "M7 14.2h10",
  ],
  sparkle: [
    "M12 3.5l2.1 5.6 5.6 2.1-5.6 2.1L12 19l-2.1-5.7-5.6-2.1 5.6-2.1z",
  ],
};

function LineIcon({ name, className = "" }) {
  const paths = LINE_ICONS[name] || LINE_ICONS.briefcase;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 8h11" />
      <path d="M9.5 4l4 4-4 4" />
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
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.8 9.9 67.6 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.6-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7 2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
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
      <path d="M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.4615c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z" />
    </svg>
  );
}

/* Small meta chip, rendered only when the API actually supplied a value. */
function Meta({ icon, children }) {
  if (!children) return null;
  return (
    <span className="jhs-meta">
      <LineIcon name={icon} />
      {children}
    </span>
  );
}

function SectionHead({ title, subtitle, action }) {
  return (
    <div className="jhs-head">
      <div className="jhs-head-txt">
        <h2 className="jhs-title">{title}</h2>
        {subtitle ? <p className="jhs-sub">{subtitle}</p> : null}
      </div>
      {action ? <div className="jhs-head-act">{action}</div> : null}
    </div>
  );
}

function TextAction({ href, children }) {
  return (
    <a className="jhs-action" href={href}>
      <span>{children}</span>
      <ArrowIcon />
    </a>
  );
}

const firstText = (...values) =>
  values.find((v) => typeof v === "string" && v.trim()) || "";

const jobCompany = (job) => firstText(job.company, job.org, job.organization);
const jobType = (job) => firstText(job.type, job.jobType, job.employmentType);
const jobSalary = (job) => firstText(job.salary, job.salaryRange, job.salaryText);
const jobLocation = (job) => firstText(job.location, job.city, job.district);

function jobDate(job) {
  const raw = job.publishedAt || job.createdAt || job.posted;
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await apiFetch("/api/jobs");
        const data = await res.json();
        if (data.success) {
          const submitted = data.jobs || [];
          const cms = data.cmsPosts || [];
          setJobs(
            [...submitted, ...cms].sort(
              (a, b) =>
                new Date(b.publishedAt || b.createdAt || 0).getTime() -
                new Date(a.publishedAt || a.createdAt || 0).getTime()
            )
          );
        }
      } catch (error) {
        console.error("Failed to load jobs", error);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const latestRows = jobs.slice(0, 10);
  const updatesRows = jobs.slice(10, 20);
  const jobHref = (job) => (job._source === "cms" ? `/post/${job.slug}` : `/job/${job._id}`);

  return (
    <main className="ja-home">
      <div className="ja-home-inner">
        <div className="ja-join-row">
          <a className="ja-join ja-join-wa" href="https://chat.whatsapp.com/CjdwvyIXjXV2Lg2CG1iUM0" target="_blank" rel="noopener noreferrer">
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

        <div className="jhs-stack">
          {/* 1. Latest Updates */}
          <section className="jhs-sec" id="ja-news">
            <SectionHead
              title="Latest Updates"
              subtitle="Latest opportunities and career updates"
              action={<TextAction href="#ja-news">View More Jobs</TextAction>}
            />
            {loading ? (
              <div className="jhs-state">
                <span className="jh-spinner" /> Loading…
              </div>
            ) : latestRows.length > 0 ? (
              <div className="jhs-list">
                {latestRows.map((job) => (
                  <Link className="jhs-row" href={jobHref(job)} key={job._id}>
                    <span className="jhs-row-ic">
                      <LineIcon name="briefcase" />
                    </span>
                    <span className="jhs-row-main">
                      <span className="jhs-row-cat">{firstText(job.category, "Job Alert")}</span>
                      <span className="jhs-row-title">{job.title}</span>
                      <span className="jhs-row-meta">
                        <Meta icon="tag">{jobType(job)}</Meta>
                        <Meta icon="pin">{jobLocation(job)}</Meta>
                        <Meta icon="clock">{jobDate(job)}</Meta>
                      </span>
                    </span>
                    <span className="jhs-row-go">
                      <ArrowIcon />
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="jhs-state">
                No jobs found in your area yet. Check back soon.
              </div>
            )}
          </section>

          {/* 2. Job Updates */}
          <section className="jhs-sec jhs-sec-tint">
            <SectionHead
              title="Job Updates"
              subtitle="Find the latest opportunities and start your next career move."
              action={
                <a className="jhs-btn" href="/submit-job">
                  <span>Post Your Job</span>
                  <ArrowIcon />
                </a>
              }
            />
            {loading ? (
              <div className="jhs-state">
                <span className="jh-spinner" /> Loading…
              </div>
            ) : updatesRows.length > 0 ? (
              <div className="jhs-cards jhs-cards-3">
                {updatesRows.map((job) => (
                  <Link className="jhs-card" href={jobHref(job)} key={job._id}>
                    <span className="jhs-card-ic">
                      <LineIcon name="briefcase" />
                    </span>
                    <h3 className="jhs-card-title">{job.title}</h3>
                    {jobCompany(job) ? (
                      <span className="jhs-card-org">
                        <LineIcon name="building" />
                        {jobCompany(job)}
                      </span>
                    ) : null}
                    <span className="jhs-card-meta">
                      <Meta icon="pin">{jobLocation(job)}</Meta>
                      <Meta icon="clock">{jobType(job)}</Meta>
                      <Meta icon="rupee">{jobSalary(job)}</Meta>
                    </span>
                    {job.category ? (
                      <span className="jhs-chip">{job.category}</span>
                    ) : null}
                    <span className="jhs-card-cta">
                      <span>View Job</span>
                      <ArrowIcon />
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="jhs-empty">
                <span className="jhs-empty-ic">
                  <LineIcon name="pin" />
                </span>
                <h3 className="jhs-empty-title">No Jobs Found Yet</h3>
                <p className="jhs-empty-text">
                  No jobs found in your area yet. Check back soon for new
                  opportunities.
                </p>
                <a className="jhs-btn" href="/category/job">
                  <span>Explore All Jobs</span>
                  <ArrowIcon />
                </a>
              </div>
            )}
          </section>

          {/* 3. Top Categories */}
          <section className="jhs-sec">
            <SectionHead
              title="Top Categories"
              subtitle="Explore jobs by your preferred career category."
              action={
                <a className="jhs-btn" href="/submit-job">
                  <span>Post Your Job</span>
                  <ArrowIcon />
                </a>
              }
            />
            <div className="jhs-cats">
              {CATEGORIES.map((cat) => (
                <a className="jhs-cat" href="#ja-news" key={cat.name}>
                  <span className="jhs-cat-ic">
                    <LineIcon name={cat.icon} />
                  </span>
                  <span className="jhs-cat-name">{cat.name}</span>
                  <span className="jhs-cat-go">
                    Explore <ArrowIcon />
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* 4. Online Mock Tests */}
          <section className="jhs-sec jhs-sec-tint">
            <SectionHead
              title="Online Mock Tests"
              subtitle="Practice smarter and prepare with confidence."
              action={<TextAction href="#">View More</TextAction>}
            />
            <div className="jhs-cards jhs-cards-3">
              {MOCK_TESTS.map((test) => (
                <a className="jhs-card jhs-card-tile" href="#" key={test.name}>
                  <span className="jhs-card-ic">
                    <LineIcon name={test.icon} />
                  </span>
                  <h3 className="jhs-card-title">{test.name}</h3>
                  <p className="jhs-card-desc">{test.desc}</p>
                  <span className="jhs-card-cta">
                    <span>Practice Now</span>
                    <ArrowIcon />
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* 5. Free Online Tools */}
          <section className="jhs-sec">
            <SectionHead
              title="Free Online Tools"
              subtitle="Useful tools for your job search and career preparation."
              action={<TextAction href="#">View More</TextAction>}
            />
            <div className="jhs-cards jhs-cards-3">
              {FREE_TOOLS.map((tool) => (
                <a className="jhs-card jhs-card-tile" href="#" key={tool.name}>
                  <span className="jhs-card-ic">
                    <LineIcon name={tool.icon} />
                  </span>
                  <h3 className="jhs-card-title">{tool.name}</h3>
                  <p className="jhs-card-desc">{tool.desc}</p>
                  <span className="jhs-card-cta">
                    <span>Open Tool</span>
                    <ArrowIcon />
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* 6. Social Media Channels */}
          <section className="jhs-sec jhs-sec-tint">
            <SectionHead
              title="Connect With Us"
              subtitle="Stay updated with the latest jobs and career news."
              action={<TextAction href="/contact">Contact Us</TextAction>}
            />
            <div className="jhs-soc">
              {SOCIAL_CHANNELS.map((s) => (
                <a className={`jhs-soc-card ja-soc-row ${s.cls}`} href="#" key={s.label}>
                  <span className="jhs-soc-ic">
                    <s.Icon />
                  </span>
                  <span className="jhs-soc-name">{s.label}</span>
                </a>
              ))}
            </div>
          </section>

          {/* 7. Our Job Guides */}
          <section className="jhs-sec">
            <SectionHead
              title="Our Job Guides"
              subtitle="Practical career guides to help you get ahead."
              action={<TextAction href="#">View All</TextAction>}
            />
            <div className="jhs-cards jhs-cards-3">
              {GUIDES.map((g) => (
                <a className="jhs-card" href="#" key={g.title}>
                  <span className="jhs-card-cover">
                    <LineIcon name="book" />
                  </span>
                  <h3 className="jhs-card-title">{g.title}</h3>
                  <p className="jhs-card-desc">{g.desc}</p>
                  <div className="jhs-guide-foot">
                    <span className="jhs-price">{g.price}</span>
                    <span className="jhs-card-cta jhs-card-cta-btn">
                      <span>View Guide</span>
                      <ArrowIcon />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* 8. About JobCareer */}
          <section className="jhs-sec jhs-sec-tint">
            <div className="jhs-about">
              <div className="jhs-about-left">
                <h2 className="jhs-title">About JobCareer</h2>
                <p className="jhs-about-lead">
                  Your trusted destination for jobs, career resources and
                  preparation.
                </p>
                <a className="jhs-btn" href="/contact">
                  <span>Read More</span>
                  <ArrowIcon />
                </a>
              </div>
              <div className="jhs-about-right">
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
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}