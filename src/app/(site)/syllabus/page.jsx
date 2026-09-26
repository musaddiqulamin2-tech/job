import { PostListPage } from "../cms/PostListPage";
import { getListing } from "../cms/cmsServer";
import { CMS_LISTING_META, CMS_LISTING_HEADINGS } from "../cms/meta";

export const metadata = CMS_LISTING_META.syllabus;
export const dynamic = "force-dynamic";

export default async function SyllabusPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp?.page) || 1;
  const data = await getListing("syllabus", page);
  return (
    <PostListPage
      category="syllabus"
      title={CMS_LISTING_HEADINGS.syllabus.title}
      description={CMS_LISTING_HEADINGS.syllabus.description}
      posts={data.posts}
      page={data.page}
      totalPages={data.totalPages}
      total={data.total}
    />
  );
}