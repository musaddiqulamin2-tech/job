import mongoose from "mongoose";
import { POST_STATUSES, POST_CATEGORY_SLUGS } from "../postMeta.js";

export { POST_STATUSES, POST_CATEGORY_SLUGS };

const ImportantLinkSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    url: { type: String, default: "" },
    type: {
      type: String,
      enum: ["apply", "notification", "website", "admit-card", "result", "syllabus", "custom"],
      default: "custom",
    },
  },
  { _id: false }
);

const SeoSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    canonical: { type: String, default: "" },
    robots: { type: String, default: "index, follow" },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: POST_CATEGORY_SLUGS,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: POST_STATUSES,
      default: "draft",
      index: true,
    },
    summary: { type: String, default: "" },
    content: {
      json: { type: mongoose.Schema.Types.Mixed, default: null },
      html: { type: String, default: "" },
    },
    featuredImage: { type: String, default: "" },
    organization: { type: String, default: "" },
    location: { type: String, default: "" },
    qualification: { type: String, default: "" },
    ageLimit: { type: String, default: "" },
    ageRelaxation: { type: String, default: "" },
    vacancyCount: { type: Number, default: 0 },
    applicationFee: { type: String, default: "" },
    paymentMode: { type: String, default: "" },
    eligibility: { type: String, default: "" },
    selectionProcess: { type: [String], default: [] },
    howToApply: { type: [String], default: [] },
    startDate: { type: String, default: "" },
    lastDate: { type: String, default: "" },
    examDate: { type: String, default: "" },
    admitCardDate: { type: String, default: "" },
    resultDate: { type: String, default: "" },
    officialNotificationUrl: { type: String, default: "" },
    applicationUrl: { type: String, default: "" },
    importantLinks: { type: [ImportantLinkSchema], default: [] },
    author: { type: String, default: "Admin" },
    tags: { type: [String], default: [] },
    seo: { type: SeoSchema, default: () => ({}) },
    featured: { type: Boolean, default: false },
    scheduledAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

PostSchema.index({ status: 1, category: 1, publishedAt: -1 });
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ category: 1, createdAt: -1 });
PostSchema.index({ title: "text", organization: "text", tags: "text" });

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default Post;