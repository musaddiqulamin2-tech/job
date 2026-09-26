import { PostListPage } from "../cms/PostListPage";
import { getListing } from "../cms/cmsServer";
import { CMS_LISTING_META, CMS_LISTING_HEADINGS } from "../cms/meta";

export const metadata = CMS_LISTING_META["private-job"];
export const dynamic = "force-dynamic";

export default async function PrivateJobsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp?.page) || 1;
  const data = await getListing("private-job", page);
  return (
    <PostListPage
      category="private-job"
      title={CMS_LISTING_HEADINGS["private-job"].title}
      description={CMS_LISTING_HEADINGS["private-job"].description}
      posts={data.posts}
      page={data.page}
      totalPages={data.totalPages}
      total={data.total}
    />
  );
}