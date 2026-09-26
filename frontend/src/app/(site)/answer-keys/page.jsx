import { PostListPage } from "../cms/PostListPage";
import { getListing } from "../cms/cmsServer";
import { CMS_LISTING_META, CMS_LISTING_HEADINGS } from "../cms/meta";

export const metadata = CMS_LISTING_META["answer-key"];
export const dynamic = "force-dynamic";

export default async function AnswerKeysPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp?.page) || 1;
  const data = await getListing("answer-key", page);
  return (
    <PostListPage
      category="answer-key"
      title={CMS_LISTING_HEADINGS["answer-key"].title}
      description={CMS_LISTING_HEADINGS["answer-key"].description}
      posts={data.posts}
      page={data.page}
      totalPages={data.totalPages}
      total={data.total}
    />
  );
}