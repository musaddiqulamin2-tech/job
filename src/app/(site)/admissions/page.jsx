import { PostListPage } from "../cms/PostListPage";
import { getListing } from "../cms/cmsServer";
import { CMS_LISTING_META, CMS_LISTING_HEADINGS } from "../cms/meta";

export const metadata = CMS_LISTING_META.admission;
export const dynamic = "force-dynamic";

export default async function AdmissionsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp?.page) || 1;
  const data = await getListing("admission", page);
  return (
    <PostListPage
      category="admission"
      title={CMS_LISTING_HEADINGS.admission.title}
      description={CMS_LISTING_HEADINGS.admission.description}
      posts={data.posts}
      page={data.page}
      totalPages={data.totalPages}
      total={data.total}
    />
  );
}