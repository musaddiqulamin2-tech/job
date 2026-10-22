"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import JobPreview from "../components/JobPreview";
import { previewKey, readPreviewPayload } from "../components/previewStore";

function PreviewView() {
  const params = useSearchParams();
  const id = params.get("k") || "";
  const back = params.get("back") || "/admin/posts";
  const [post, setPost] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    setPost(readPreviewPayload(id));
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    load();
    if (!id) return undefined;

    const onStorage = (event) => {
      if (!event.key || event.key === previewKey(id)) load();
    };
    window.addEventListener("storage", onStorage);
    const timer = window.setInterval(load, 2000);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(timer);
    };
  }, [id, load]);

  return (
    <div className="admin-page">
      <div className="admin-page-header t-header">
        <div>
          <h1>Job Preview</h1>
          <p>Unsaved preview of the post as it will look on the public website.</p>
        </div>
        <div className="t-header-actions">
          <Link href={back} className="admin-btn">
            Back to Editor
          </Link>
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => window.close()}>
            Close Preview
          </button>
        </div>
      </div>

      <div className="pv-banner">
        <span>
          <strong>Preview mode.</strong> This post is not published yet — nothing here is visible to visitors until you
          publish.
        </span>
      </div>

      {!loaded && <div className="pv-empty">Loading preview…</div>}

      {loaded && !post && (
        <div className="admin-card">
          <div className="pv-empty">
            No preview data found. Open the post editor and click <strong>Preview</strong> again.
          </div>
        </div>
      )}

      {loaded && post && (
        <div className="pv-page">
          <JobPreview post={post} />
        </div>
      )}
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="admin-page"><div className="pv-empty">Loading preview…</div></div>}>
      <PreviewView />
    </Suspense>
  );
}
