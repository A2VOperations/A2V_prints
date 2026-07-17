// app/models/Template.js
import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    categorySlug: { type: String, required: true, trim: true, index: true },
    categoryName: { type: String, trim: true },
    price: { type: String, trim: true, default: "₹200.00" },
    unitPrice: { type: String, trim: true, default: "₹2.00 each / 100 units" },
    image: { type: String, trim: true },
    frontImage: { type: String, trim: true },
    backImage: { type: String, trim: true },
    frontElements: { type: mongoose.Schema.Types.Mixed, default: [] },
    backElements: { type: mongoose.Schema.Types.Mixed, default: [] },
    frontBackground: { type: String, trim: true },
    backBackground: { type: String, trim: true },
    size: { type: String, trim: true },
    hasBackSide: { type: Boolean, default: false },
    rating: { type: Number, default: 4.8 },
    reviews: { type: Number, default: 0 },
    badge: { type: String, trim: true },
    colors: [{ type: String }],
    orientation: { type: String, default: "Horizontal" },
    corners: { type: String, default: "Standard" },
    stock: { type: String, default: "Standard Matte" },
    finish: { type: String, default: "Matte" },
    industry: { type: String, default: "Corporate & Executive" },
    style: { type: String, default: "Bold & Modern" },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to ensure cover image & id if needed
templateSchema.pre("save", async function () {
  this.hasBackSide = this.categorySlug === "visiting-cards";
  if (!this.frontImage && this.image) {
    this.frontImage = this.image;
  } else if (!this.image && this.frontImage) {
    this.image = this.frontImage;
  }
  if (this.hasBackSide) {
    if (!this.backImage && this.frontImage) {
      this.backImage = this.frontImage;
    }
  } else {
    this.backImage = this.frontImage || this.image;
  }
  if (!this.categoryName && this.categorySlug) {
    this.categoryName = this.categorySlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
});

if (process.env.NODE_ENV !== "production") {
  if (mongoose.models.Template) {
    delete mongoose.models.Template;
  }
  if (mongoose.connection?.models?.Template) {
    delete mongoose.connection.models.Template;
  }
}

export default mongoose.models.Template || mongoose.model("Template", templateSchema);
