import { expressify } from "../../../../compat.js";
import connectDB from "../../../../lib/mongodb.js";
import { getPublishedPost } from "../../../../lib/cms.js";
import { withTimeout } from "../../../../lib/db.js";

export async function GET(_request, { params }) {
  const { slug } = params;
  if (!slug) {
    return Response.json({ success: false, post: null }, { status: 400 });
  }
  try {
    await withTimeout(connectDB());
    const post = await getPublishedPost(String(slug));
    return Response.json({
      success: true,
      post: post ? { ...post, _id: String(post._id) } : null,
    });
  } catch (error) {
    console.error("post detail error:", error.message);
    return Response.json({ success: false, post: null });
  }
}

import { Router } from "express";
const router = Router();
router.get("/:slug", expressify(GET));
export default router;