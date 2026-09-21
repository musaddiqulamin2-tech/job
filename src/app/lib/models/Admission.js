import mongoose from "mongoose";

const DateItemSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    date: { type: String, default: "" },
  },
  { _id: false }
);

const FeeRowSchema = new mongoose.Schema(
  {
    category: { type: String, default: "" },
    amount: { type: String, default: "" },
  },
  { _id: false }
);

const ContentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "paragraph",
        "heading",
        "subheading",
        "list",
        "note",
        "table",
        "image",
        "faq",
      ],
      default: "paragraph",
    },
    text: { type: String, default: "" },
    heading: { type: String, default: "" },
    ordered: { type: Boolean, default: false },
    items: { type: [String], default: [] },
    caption: { type: String, default: "" },
    columns: { type: [String], default: [] },
    rows: { type: [[String]], default: [] },
    source: { type: String, default: "" },
  },
  { _id: false }
);

const LinkItemSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  { _id: false }
);

const FaqItemSchema = new mongoose.Schema(
  {
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
  },
  { _id: false }
);

const AdmissionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    org: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "Admission",
    },
    status: {
      type: String,
      default: "Admission Update",
    },
    date: {
      type: String,
      default: "",
    },
    shortDescription: {
      type: String,
      default: "",
    },
    featuredImage: {
      type: String,
      default: "",
    },
    courseName: {
      type: String,
      default: "",
    },
    admissionYear: {
      type: String,
      default: "",
    },
    totalSeats: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    applicationStartDate: {
      type: String,
      default: "",
    },
    applicationLastDate: {
      type: String,
      default: "",
    },
    examDate: {
      type: String,
      default: "",
    },
    meritListDate: {
      type: String,
      default: "",
    },
    counsellingDate: {
      type: String,
      default: "",
    },
    importantDates: [DateItemSchema],
    eligibility: {
      type: [String],
      default: [],
    },
    ageLimit: {
      type: String,
      default: "",
    },
    applicationFee: [FeeRowSchema],
    selectionProcess: {
      type: [String],
      default: [],
    },
    requiredDocuments: {
      type: [String],
      default: [],
    },
    howToApply: {
      type: [String],
      default: [],
    },
    officialSite: {
      type: String,
      default: "",
    },
    officialNotificationUrl: {
      type: String,
      default: "",
    },
    applicationUrl: {
      type: String,
      default: "",
    },
    prospectusUrl: {
      type: String,
      default: "",
    },
    courseDuration: {
      type: String,
      default: "",
    },
    admissionMode: {
      type: String,
      default: "",
    },
    officialAuthority: {
      type: String,
      default: "",
    },
    faq: [FaqItemSchema],
    content: [ContentBlockSchema],
    tagColor: {
      type: String,
      default: "emerald",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admission =
  mongoose.models.Admission || mongoose.model("Admission", AdmissionSchema);

export default Admission;