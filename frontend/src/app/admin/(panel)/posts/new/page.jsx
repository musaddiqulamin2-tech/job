import PostEditor from "../../components/PostEditor";

export const metadata = { title: "Add New Post — Admin" };

export default function NewPostPage() {
  return <PostEditor postId={null} initial={null} />;
}