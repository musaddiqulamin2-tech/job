import { PostListPage } from "../cms/PostListPage";
import { getListing } from "../cms/cmsServer";
import { CMS_LISTING_META, CMS_LISTING_HEADINGS } from "../cms/meta";

export const metadata = CMS_LISTING_META.result;
export const dynamic = "force-dynamic";

export default async function ResultsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp?.page) || 1;
  const data = await getListing("result", page);
  return (
    <PostListPage
      category="result"
      title={CMS_LISTING_HEADINGS.result.title}
      description={CMS_LISTING_HEADINGS.result.description}
      posts={data.posts}
      page={data.page}
      totalPages={data.totalPages}
      total={data.total}
    />
  );
}