import { getCategoryMeta } from "../../../lib/categoryData";
import CategoryBody from "./CategoryBody";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (slug === "scheme") {
    const title = "Government Schemes 2026 – Central & State Scheme Updates | JobCareer Canvas";
    const description =
      "Explore the latest government schemes for students, farmers, women and entrepreneurs. Check benefits, eligibility, required documents, important dates and apply online.";
    return {
      title,
      description,
      alternates: { canonical: "https://jobcareercanvas.in/category/scheme" },
      openGraph: {
        title,
        description,
        siteName: "JobCareer Canvas",
        url: "https://jobcareercanvas.in/category/scheme",
        images: "https://jobcareercanvas.in/brand/jobcareer-logo.png",
      },
    };
  }
  const meta = getCategoryMeta(slug);
  const seo = meta.seo || {
    title: `${meta.title} 2026 – Latest Updates | JobCareer`,
    description: meta.description,
  };
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  return <CategoryBody slug={slug} />;
}