import { notFound, redirect } from "next/navigation";
import {
  loadAdmissionPage,
  loadAdmissionTotal,
  admissionTotalPages,
} from "../../../../../lib/admissionData";
import AdmissionCategory from "../../AdmissionModule";

export const dynamic = "force-dynamic";

function resolvePageNum(value) {
  const n = Number(value);
  return Number.isInteger(n) ? n : NaN;
}

export async function generateMetadata({ params }) {
  const { page } = await params;
  const n = resolvePageNum(page);

  if (!Number.isInteger(n) || n < 2) {
    return {
      title: "Admission 2026 – Latest College & University Admission Updates | JobCareer",
    };
  }

  const total = await loadAdmissionTotal();
  const totalPages = admissionTotalPages(total);
  if (n > totalPages) {
    return {
      title: "Admission 2026 – Latest College & University Admission Updates | JobCareer",
    };
  }

  return {
    title: `Admission 2026 Page ${n} – Latest College & University Admission Updates | JobCareer`,
    description:
      "Stay updated on college, university, school and entrance exam admissions, application dates, eligibility and admission updates on JobCareer.",
    alternates: {
      canonical: `https://jobcareer.in/category/admission/page/${n}`,
    },
  };
}

export default async function AdmissionCategoryPagePage({ params }) {
  const { page } = await params;
  const n = resolvePageNum(page);

  if (n === 1) {
    redirect("/category/admission");
  }
  if (!Number.isInteger(n) || n < 2) {
    notFound();
  }

  const { posts, total } = await loadAdmissionPage(n);
  const totalPages = admissionTotalPages(total);

  if (n > totalPages) {
    notFound();
  }

  return (
    <AdmissionCategory
      posts={posts}
      current={n}
      total={totalPages}
    />
  );
}