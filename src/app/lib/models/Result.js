import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema(
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
    category: {
      type: String,
      default: "Results",
    },
    exam: {
      type: String,
      default: "",
    },
    resultType: {
      type: String,
      default: "Recruitment Result",
    },
    group: {
      type: String,
      default: "government",
    },
    status: {
      type: String,
      default: "RESULT DECLARED",
    },
    date: {
      type: String,
      default: "",
    },
    officialSite: {
      type: String,
      default: "",
    },
    tagColor: {
      type: String,
      default: "indigo",
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

const Result =
  mongoose.models.Result || mongoose.model("Result", ResultSchema);

export default Result;