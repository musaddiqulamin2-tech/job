import mongoose from "mongoose";

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
  },
  {
    timestamps: true,
  }
);

const AdmitCard =
  mongoose.models.AdmitCard || mongoose.model("AdmitCard", AdmitCardSchema);

export default AdmitCard;