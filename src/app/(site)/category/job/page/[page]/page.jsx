import { notFound, redirect } from "next/navigation";
import { loadJobPage, loadJobTotal, jobTotalPages } from "../../../../../lib/jobData";
import JobsCategory from "../../JobModule";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { page } = await params;
  const current = Number(page);

  if (current === 1) {
    redirect("/category/job");
  }
  if (!Number.isInteger(current) || current < 2) {
    return {
      title: "Jobs 2026 – Latest Government & Private Jobs | JobCareer",
    };
  }

  const total = await loadJobTotal();
  const totalPages = jobTotalPages(total);
  if (current > totalPages) {
    return {
      title: "Jobs 2026 – Latest Government & Private Jobs | JobCareer",
    };
  }

  return {
    title: `Jobs 2026 – Latest Government & Private Jobs – Page ${current} | JobCareer`,
    description:
      "Browse government job notifications, recruitment updates, vacancies, eligibility details and application information on JobCareer.",
    alternates: {
      canonical: `https://jobcareer.in/category/job/page/${current}`,
    },
  };
}

export default async function JobsPage({ params }) {
  const { page } = await params;
  const current = Number(page);

  if (current === 1) {
    redirect("/category/job");
  }
  if (!Number.isInteger(current) || current < 2) {
    notFound();
  }

  const total = await loadJobTotal();
  const totalPages = jobTotalPages(total);
  if (current > totalPages) {
    notFound();
  }

  const { posts } = await loadJobPage(current);
  if (posts.length === 0) {
    notFound();
  }

  return (
    <JobsCategory
      posts={posts}
      current={current}
      total={totalPages}
    />
  );
}