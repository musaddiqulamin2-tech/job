import mongoose from "mongoose";

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
    officialSite: {
      type: String,
      default: "",
    },
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