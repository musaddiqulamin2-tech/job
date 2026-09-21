import mongoose from "mongoose";

const DateItemSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    date: { type: String, default: "" },
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

const FaqItemSchema = new mongoose.Schema(
  {
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
  },
  { _id: false }
);

const AdmitCardSchema = new mongoose.Schema(
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
    company: {
      type: String,
      default: "",
    },
    badge: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "Admit Card",
    },
    status: {
      type: String,
      default: "Admit Card Released",
    },
    date: {
      type: String,
      default: "",
    },
    tagColor: {
      type: String,
      default: "sky",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    shortDescription: {
      type: String,
      default: "",
    },
    featuredImage: {
      type: String,
      default: "",
    },
    examName: {
      type: String,
      default: "",
    },
    intake: {
      type: String,
      default: "",
    },
    postTrade: {
      type: String,
      default: "",
    },
    examType: {
      type: String,
      default: "",
    },
    examMode: {
      type: String,
      default: "",
    },
    admitCardReleaseMode: {
      type: String,
      default: "",
    },
    officialSite: {
      type: String,
      default: "",
    },
    officialNotificationUrl: {
      type: String,
      default: "",
    },
    admitCardUrl: {
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
    admitCardReleaseDate: {
      type: String,
      default: "",
    },
    resultDate: {
      type: String,
      default: "",
    },
    importantDates: [DateItemSchema],
    eligibility: {
      type: [String],
      default: [],
    },
    examCentreInfo: {
      type: [String],
      default: [],
    },
    documents: {
      type: [String],
      default: [],
    },
    howToDownload: {
      type: [String],
      default: [],
    },
    importantInstructions: {
      type: [String],
      default: [],
    },
    importantLinks: [LinkItemSchema],
    faq: [FaqItemSchema],
    content: [ContentBlockSchema],
  },
  {
    timestamps: true,
  }
);

const AdmitCard =
  mongoose.models.AdmitCard || mongoose.model("AdmitCard", AdmitCardSchema);

export default AdmitCard;