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
    status: {
      type: String,
      enum: ["Active", "Inactive", "Expired"],
      default: "Active",
    },
    vacancies: {
      type: Number,
      default: 0,
    },
    lastDate: {
      type: String,
      default: "",
    },
    officialLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);

export default Job;
