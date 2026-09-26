"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostEditor from "../../components/PostEditor";
import { Spinner, ErrorState } from "../../components/AdminUI";

export default function EditPostPage() {
  const params = useParams();
  const id = params.id;
  const [post, setPost] = useState(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/posts/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setPost(data.post))
      .catch(() => setError("Could not load this post."));
  }, [id]);

  if (error) {
    return (
      <div className="admin-page">
        <ErrorState
          message={error}
          onRetry={() => {
            setError("");
            setPost(undefined);
            fetch(`/api/admin/posts/${id}`)
              .then((res) => (res.ok ? res.json() : Promise.reject(res)))
              .then((data) => setPost(data.post))
              .catch(() => setError("Could not load this post."));
          }}
        />
      </div>
    );
  }

  if (post === undefined) {
    return (
      <div className="admin-page">
        <Spinner label="Loading post..." />
      </div>
    );
  }

  return <PostEditor postId={id} initial={post} />;
}