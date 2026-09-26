import mongoose from "mongoose";

const JobSubmissionSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    officialEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    companyWebsite: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    vacancies: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: String,
      required: true,
      default: "Private Job",
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    employmentType: {
      type: String,
      required: true,
      default: "Full Time",
    },
    salary: {
      type: String,
      default: "",
    },
    startDate: {
      type: String,
      default: "",
    },
    lastDate: {
      type: String,
      default: "",
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    ageLimit: {
      type: String,
      default: "",
    },
    applicationProcess: {
      type: String,
      default: "",
    },
    applicationUrl: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    responsibilities: {
      type: String,
      default: "",
    },

    notificationFileUrl: {
      type: String,
      default: "",
    },
    companyLogoUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["PENDING_REVIEW", "APPROVED", "REJECTED"],
      default: "PENDING_REVIEW",
      index: true,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const JobSubmission =
  mongoose.models.JobSubmission ||
  mongoose.model("JobSubmission", JobSubmissionSchema);

export default JobSubmission;