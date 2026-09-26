import { PostListPage } from "../cms/PostListPage";
import { getListing } from "../cms/cmsServer";
import { CMS_LISTING_META, CMS_LISTING_HEADINGS } from "../cms/meta";

export const metadata = CMS_LISTING_META["admit-card"];
export const dynamic = "force-dynamic";

export default async function AdmitCardsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp?.page) || 1;
  const data = await getListing("admit-card", page);
  return (
    <PostListPage
      category="admit-card"
      title={CMS_LISTING_HEADINGS["admit-card"].title}
      description={CMS_LISTING_HEADINGS["admit-card"].description}
      posts={data.posts}
      page={data.page}
      totalPages={data.totalPages}
      total={data.total}
    />
  );
}