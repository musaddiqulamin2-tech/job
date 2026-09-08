import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    workType: { type: String, required: true },
    kycType: { type: String, required: true },
    kycNumber: { type: String, required: true },
    documentUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const Worker =
  mongoose.models.Worker || mongoose.model("Worker", WorkerSchema);

export default Worker;