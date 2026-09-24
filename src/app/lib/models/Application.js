import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    jobTitle: String,
    fullName: String,
    email: String,
    phone: String,
    coverMessage: String,
    resumeUrl: String,
    photoUrl: String,
    status: {
      type: String,
      enum: ["Pending", "Reviewing", "Shortlisted", "Rejected", "Selected"],
      default: "Pending",
    },
    statusNote: {
      type: String,
      default: "",
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Application =
  mongoose.models.Application || mongoose.model("Application", ApplicationSchema);

export default Application;