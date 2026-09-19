import { notFound, redirect } from "next/navigation";
import { loadResultPage, loadResultTotal, resultTotalPages } from "../../../../../lib/resultData";
import ResultsCategory from "../../ResultModule";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { page } = await params;
  const current = Number(page);

  if (current === 1) {
    redirect("/category/results");
  }
  if (!Number.isInteger(current) || current < 2) {
    return {
      title: "Results 2026 – Latest Exam Results, Merit Lists & Scorecards | JobCareer",
    };
  }

  const total = await loadResultTotal();
  const totalPages = resultTotalPages(total);
  if (current > totalPages) {
    return {
      title: "Results 2026 – Latest Exam Results, Merit Lists & Scorecards | JobCareer",
    };
  }

  return {
    title: `Results Page ${current} – Latest Exam & Recruitment Results | JobCareer`,
    description:
      "Check the latest examination results, recruitment results, merit lists, scorecards and result updates on JobCareer.",
    alternates: {
      canonical: `https://jobcareer.in/category/results/page/${current}`,
    },
  };
}

export default async function ResultsPage({ params }) {
  const { page } = await params;
  const current = Number(page);

  if (current === 1) {
    redirect("/category/results");
  }
  if (!Number.isInteger(current) || current < 2) {
    notFound();
  }

  const total = await loadResultTotal();
  const totalPages = resultTotalPages(total);
  if (current > totalPages) {
    notFound();
  }

  const { posts } = await loadResultPage(current);
  if (posts.length === 0) {
    notFound();
  }

  return (
    <ResultsCategory
      posts={posts}
      current={current}
      total={totalPages}
    />
  );
}