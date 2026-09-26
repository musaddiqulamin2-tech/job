import { PostListPage } from "../cms/PostListPage";
import { getListing } from "../cms/cmsServer";
import { CMS_LISTING_META, CMS_LISTING_HEADINGS } from "../cms/meta";

export const metadata = CMS_LISTING_META["government-job"];
export const dynamic = "force-dynamic";

export default async function GovernmentJobsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp?.page) || 1;
  const data = await getListing("government-job", page);
  return (
    <PostListPage
      category="government-job"
      title={CMS_LISTING_HEADINGS["government-job"].title}
      description={CMS_LISTING_HEADINGS["government-job"].description}
      posts={data.posts}
      page={data.page}
      totalPages={data.totalPages}
      total={data.total}
    />
  );
}