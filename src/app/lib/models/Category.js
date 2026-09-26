import mongoose from "mongoose";

export const DEFAULT_CATEGORIES = [
  { name: "Government Jobs", slug: "government-job", description: "Latest central and state government job notifications, recruitment and application links.", order: 1, enabled: true, icon: "gov" },
  { name: "Private Jobs", slug: "private-job", description: "Latest private sector jobs, walk-in interviews and career opportunities.", order: 2, enabled: true, icon: "private" },
  { name: "Admit Cards", slug: "admit-card", description: "Latest admit cards and hall tickets for government and competitive exams.", order: 3, enabled: true, icon: "admit-card" },
  { name: "Results", slug: "result", description: "Latest exam results, merit lists, scorecards and cut-off marks.", order: 4, enabled: true, icon: "result" },
  { name: "Admissions", slug: "admission", description: "Latest college, university and school admission updates and application dates.", order: 5, enabled: true, icon: "admission" },
  { name: "Answer Keys", slug: "answer-key", description: "Latest exam answer keys and response sheets.", order: 6, enabled: true, icon: "answer-key" },
  { name: "Syllabus", slug: "syllabus", description: "Latest exam syllabus and paper patterns.", order: 7, enabled: true, icon: "syllabus" },
];

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    parent: { type: String, default: "" },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
    icon: { type: String, default: "" },
  },
  { timestamps: true }
);

CategorySchema.index({ enabled: 1, order: 1 });

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;