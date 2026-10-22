import { expressify } from "../../../../compat.js";
import connectDB from "../../../../lib/mongodb.js";
import Scheme from "../../../../lib/models/Scheme.js";
import { getPublishedScheme, publicScheme } from "../../../../lib/schemes.js";
import { withTimeout } from "../../../../lib/db.js";

export async function GET(_request, { params }) {
  const { slug } = params;
  if (!slug) {
    return Response.json({ success: false, scheme: null }, { status: 400 });
  }

  try {
    await withTimeout(connectDB());
    const scheme = await getPublishedScheme(String(slug));
    if (!scheme) {
      return Response.json({ success: false, scheme: null }, { status: 404 });
    }

    Scheme.updateOne({ _id: scheme._id }, { $inc: { views: 1 } }).catch(() => {});

    return Response.json({
      success: true,
      scheme: publicScheme(scheme),
    });
  } catch (error) {
    console.error("scheme detail error:", error.message);
    return Response.json({ success: false, scheme: null }, { status: 500 });
  }
}

import { Router } from "express";
const router = Router();
router.get("/:slug", expressify(GET));
export default router;
