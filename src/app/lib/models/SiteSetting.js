import mongoose from "mongoose";

const SiteSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "general",
    },
    siteName: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      default: "",
    },
    contactPhone: {
      type: String,
      default: "",
    },
    siteTagline: {
      type: String,
      default: "",
    },
    aboutText: {
      type: String,
      default: "",
    },
    notifications: {
      newApplication: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true },
      emailAlerts: { type: Boolean, default: false },
      jobExpiry: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

const SiteSetting =
  mongoose.models.SiteSetting || mongoose.model("SiteSetting", SiteSettingSchema);

export default SiteSetting;