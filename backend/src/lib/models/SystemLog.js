import mongoose from "mongoose";

const SystemLogSchema = new mongoose.Schema(
  {
    level: { type: String, required: true },
    source: { type: String, default: "System" },
    message: { type: String, default: "" },
    status: { type: Number, default: null },
    requestId: { type: String, default: null },
    meta: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

// Retention: 7 days, then documents are auto-expired by MongoDB TTL index.
SystemLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });
SystemLogSchema.index({ level: 1, createdAt: -1 });

const SystemLog =
  mongoose.models.SystemLog || mongoose.model("SystemLog", SystemLogSchema);

export default SystemLog;