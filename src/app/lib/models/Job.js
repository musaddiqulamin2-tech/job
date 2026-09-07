import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "Full Time",
    },
    category: {
      type: String,
      default: "Technology",
    },
    tagColor: {
      type: String,
      default: "teal",
    },
    description: {
      type: String,
      default: "",
    },
    requirements: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: "",
    },
    posted: {
      type: String,
      default: "",
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

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);

export default Job;
