// app/models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, index: true },
    serviceType: {
      type: String,
      enum: ["printing", "graphic", "custom"],
      default: "printing",
      index: true,
    },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    badge: { type: String, trim: true },
    color: { type: String, trim: true },
    accent: { type: String, trim: true },
    images: [{ type: String, trim: true }],
    qualityLabel: { type: String, trim: true },
    styleLabel: { type: String, trim: true },
    defaultQtyOptions: [{ type: String }],
    defaultQualityOptions: [
      {
        id: { type: String },
        title: { type: String },
        subtitle: { type: String },
      },
    ],
    defaultStyleOptions: [
      {
        id: { type: String },
        title: { type: String },
        subtitle: { type: String },
      },
    ],
    defaultSpecs: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

if (process.env.NODE_ENV !== "production") {
  if (mongoose.models.Category) {
    delete mongoose.models.Category;
  }
  if (mongoose.connection?.models?.Category) {
    delete mongoose.connection.models.Category;
  }
}

export default mongoose.models.Category || mongoose.model("Category", categorySchema);
