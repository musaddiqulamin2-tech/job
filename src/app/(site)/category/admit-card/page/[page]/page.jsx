import { notFound, redirect } from "next/navigation";
import {
  loadAdmitCardPage,
  loadAdmitCardTotal,
  admitCardTotalPages,
} from "../../../../../lib/admitCardData";
import AdmitCardCategory from "../../AdmitCardModule";

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
      title: "Admit Card 2026 – Latest Hall Tickets & Exam Updates | JobCareer",
    };
  }

  const total = await loadAdmitCardTotal();
  const totalPages = admitCardTotalPages(total);
  if (n > totalPages) {
    return {
      title: "Admit Card 2026 – Latest Hall Tickets & Exam Updates | JobCareer",
    };
  }

  return {
    title: `Admit Card Page ${n} – Latest Admit Card & Hall Ticket Updates | JobCareer`,
    description:
      "Check the latest admit cards, hall tickets, exam dates, download links and recruitment examination updates on JobCareer.",
    alternates: {
      canonical: `https://jobcareer.in/category/admit-card/page/${n}`,
    },
  };
}

export default async function AdmitCardCategoryPagePage({ params }) {
  const { page } = await params;
  const n = resolvePageNum(page);

  if (n === 1) {
    redirect("/category/admit-card");
  }
  if (!Number.isInteger(n) || n < 2) {
    notFound();
  }

  const { posts, total } = await loadAdmitCardPage(n);
  const totalPages = admitCardTotalPages(total);

  if (n > totalPages) {
    notFound();
  }

  return (
    <AdmitCardCategory
      posts={posts}
      current={n}
      total={totalPages}
    />
  );
}