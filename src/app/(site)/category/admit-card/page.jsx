import {
  loadAdmitCardPage,
  admitCardTotalPages,
} from "../../../lib/admitCardData";
import AdmitCardCategory from "./AdmitCardModule";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admit Card 2026 – Latest Hall Tickets & Exam Updates | JobCareer",
  description:
    "Download the latest government and competitive exam admit cards, hall tickets, exam dates and direct download links on JobCareer.",
  alternates: {
    canonical: "https://jobcareer.in/category/admit-card",
  },
};

export default async function AdmitCardCategoryPage() {
  const { posts, total } = await loadAdmitCardPage(1);

  return (
    <AdmitCardCategory
      posts={posts}
      current={1}
      total={admitCardTotalPages(total)}
    />
  );
}