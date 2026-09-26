import { PostListPage } from "../cms/PostListPage";
import { getListing } from "../cms/cmsServer";
import { CMS_LISTING_META, CMS_LISTING_HEADINGS } from "../cms/meta";

export const metadata = CMS_LISTING_META.jobs;
export const dynamic = "force-dynamic";

export default async function JobsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp?.page) || 1;
  const data = await getListing(null, page);
  return (
    <PostListPage
      category={null}
      allCategories
      title={CMS_LISTING_HEADINGS.jobs.title}
      description={CMS_LISTING_HEADINGS.jobs.description}
      posts={data.posts}
      page={data.page}
      totalPages={data.totalPages}
      total={data.total}
    />
  );
}