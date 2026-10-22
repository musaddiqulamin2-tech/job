import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema(
  {
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
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

const SchemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    summary: { type: String, default: "" },
    description: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    department: { type: String, default: "" },
    schemeType: { type: String, default: "Government Scheme" },
    state: { type: String, default: "" },
    category: { type: String, default: "government", index: true },
    benefits: { type: [String], default: [] },
    eligibility: { type: [String], default: [] },
    requiredDocuments: { type: [String], default: [] },
    howToApply: { type: [String], default: [] },
    startDate: { type: String, default: "" },
    lastDate: { type: String, default: "" },
    officialWebsite: { type: String, default: "" },
    applyLink: { type: String, default: "" },
    notificationLink: { type: String, default: "" },
    faqs: { type: [FaqSchema], default: [] },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "unpublished"],
      default: "draft",
      index: true,
    },
    featured: { type: Boolean, default: false },
    scheduledAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    views: { type: Number, default: 0 },
    seo: { type: SeoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

SchemeSchema.index({ status: 1, publishedAt: -1 });
SchemeSchema.index({ status: 1, category: 1, publishedAt: -1 });
SchemeSchema.index({ title: "text", department: "text", tags: "text" });

const Scheme = mongoose.models.Scheme || mongoose.model("Scheme", SchemeSchema);

export default Scheme;
