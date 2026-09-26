import { expressify } from "../../../../../compat.js";
import connectDB from "../../../../../lib/mongodb.js";
import Result from "../../../../../lib/models/Result.js";
import Admission from "../../../../../lib/models/Admission.js";
import AdmitCard from "../../../../../lib/models/AdmitCard.js";
import { withTimeout } from "../../../../../lib/db.js";
import {
  enrichAdmission,
  canonicalAdmissionSlug,
} from "../../../../../lib/categoryData.js";
import {
  enrichAdmitCard,
  canonicalAdmitCardSlug,
} from "../../../../../lib/categoryData.js";

const TYPE_LOOKUP = {
  admission: {
    model: Admission,
    enrich: enrichAdmission,
    canonical: canonicalAdmissionSlug,
  },
  "admit-card": {
    model: AdmitCard,
    enrich: enrichAdmitCard,
    canonical: canonicalAdmitCardSlug,
  },
  result: { model: Result },
};

export async function GET(_request, { params }) {
  const { type, slug } = params;
  if (!slug) {
    return Response.json({ success: false, post: null }, { status: 400 });
  }
  const cfg = TYPE_LOOKUP[String(type).toLowerCase()];
  if (!cfg) {
    return Response.json({ success: false, post: null }, { status: 400 });
  }

  try {
    await withTimeout(connectDB());
    let doc = await cfg.model.findOne({ slug, active: true }).lean();
    if (!doc && cfg.canonical) {
      const docs = await cfg.model.find({ active: true }).lean();
      doc =
        docs.find(
          (d) =>
            cfg.canonical(d.slug) === String(slug).replace(/-\d{4}$/, "") ||
            cfg.canonical(d.slug) === slug
        ) || null;
    }
    if (!doc) {
      return Response.json({ success: true, post: null });
    }
    const post = cfg.enrich ? cfg.enrich({ ...doc }) : { ...doc, _id: String(doc._id) };
    return Response.json({ success: true, post });
  } catch (error) {
    console.error("entity detail error:", error.message);
    return Response.json({ success: false, post: null });
  }
}

import { Router } from "express";
const router = Router();
router.get("/:type/:slug", expressify(GET));
export default router;