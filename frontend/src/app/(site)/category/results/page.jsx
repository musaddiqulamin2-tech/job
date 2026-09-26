import { loadResultPage, resultTotalPages } from "../../../lib/resultData";
import ResultsCategory from "./ResultModule";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Results 2026 – Latest Exam Results, Merit Lists & Scorecards | JobCareer",
  description:
    "Check the latest exam results, merit lists, and scorecards for government jobs, board exams, and entrance tests. Stay informed about result announcements and next steps in the selection process.",
  alternates: {
    canonical: "https://jobcareer.in/category/results",
  },
};

export default async function ResultsCategoryPage() {
  const { posts, total } = await loadResultPage(1);

  return (
    <ResultsCategory
      posts={posts}
      current={1}
      total={resultTotalPages(total)}
    />
  );
}