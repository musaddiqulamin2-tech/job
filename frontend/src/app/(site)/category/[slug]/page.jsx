import { getCategoryMeta } from "../../../lib/categoryData";
import CategoryBody from "./CategoryBody";

export async function generateMetadata({ params }) {
  const { slug } = await params;
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