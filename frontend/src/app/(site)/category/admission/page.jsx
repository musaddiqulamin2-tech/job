import {
  loadAdmissionPage,
  admissionTotalPages,
} from "../../../lib/admissionData";
import AdmissionCategory from "./AdmissionModule";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admission 2026 – Latest College & University Admission Updates | JobCareer",
  description:
    "Stay updated on college, university, school and entrance exam admissions, application dates, eligibility and admission updates on JobCareer.",
  alternates: {
    canonical: "https://jobcareer.in/category/admission",
  },
};

export default async function AdmissionCategoryPage() {
  const { posts, total } = await loadAdmissionPage(1);

  return (
    <AdmissionCategory
      posts={posts}
      current={1}
      total={admissionTotalPages(total)}
    />
  );
}