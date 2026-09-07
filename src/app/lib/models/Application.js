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
  },
  { timestamps: true }
);

const Application =
  mongoose.models.Application || mongoose.model("Application", ApplicationSchema);

export default Application;