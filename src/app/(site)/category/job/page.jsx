import { loadJobPage, jobTotalPages } from "../../../lib/jobData";
import JobsCategory from "./JobModule";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Jobs 2026 – Latest Government & Private Jobs | JobCareer",
  description:
    "Find the latest government and private jobs, Assam jobs, banking jobs, railway jobs, recruitment notifications, eligibility, vacancies and application details on JobCareer.",
  alternates: {
    canonical: "https://jobcareer.in/category/job",
  },
};

export default async function JobsCategoryPage() {
  const { posts, total } = await loadJobPage(1);

  return (
    <JobsCategory
      posts={posts}
      current={1}
      total={jobTotalPages(total)}
    />
  );
}