import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    publicId: { type: String, default: "" },
    url: { type: String, required: true },
    secureUrl: { type: String, default: "" },
    resourceType: { type: String, default: "image" },
    format: { type: String, default: "" },
    size: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    filename: { type: String, default: "" },
    folder: { type: String, default: "" },
    uploadedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

MediaSchema.index({ createdAt: -1 });

const Media = mongoose.models.Media || mongoose.model("Media", MediaSchema);

export default Media;