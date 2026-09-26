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
    siteTagline: {
      type: String,
      default: "",
    },
    siteLogo: {
      type: String,
      default: "",
    },
    favicon: {
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
    footerText: {
      type: String,
      default: "",
    },
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
      telegram: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
    },
    homepageCategories: {
      type: [String],
      default: ["government-job", "private-job", "admit-card", "result", "admission"],
    },
    featuredSlots: {
      enabled: { type: Boolean, default: false },
      count: { type: Number, default: 4 },
    },
    postOrder: {
      type: String,
      enum: ["latest", "featured"],
      default: "latest",
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