// app/models/Product.js
import mongoose from "mongoose";

const specificationSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const customOptionChoiceSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    priceModifier: { type: Number, default: 0 },
  },
  { _id: false }
);

const customOptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, default: "dropdown" },
    required: { type: Boolean, default: true },
    choices: [customOptionChoiceSchema],
  },
  { _id: false }
);

const quantityTierSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    priceModifier: { type: Number, default: 0 },
  },
  { _id: false }
);

const qualityOptionSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: { type: String },
    subtitle: { type: String },
    priceModifier: { type: Number, default: 0 },
  },
  { _id: false }
);

const styleOptionSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: { type: String },
    subtitle: { type: String },
    priceModifier: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    numericId: { type: Number },
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    slug: { type: String, trim: true, index: true },
    categorySlug: { type: String, required: true, trim: true, index: true },
    categoryName: { type: String, trim: true },
    serviceType: {
      type: String,
      enum: ["printing", "graphic", "custom"],
      default: "printing",
      index: true,
    },
    price: { type: String, trim: true },
    numericPrice: { type: Number, default: 0 },
    turnaround: { type: String, trim: true },
    rating: { type: Number, default: 4.8 },
    reviews: { type: Number, default: 0 },
    badge: { type: String, trim: true },
    desc: { type: String, trim: true },
    description: { type: String, trim: true },
    deliverables: [{ type: String }],
    paper: { type: String, trim: true },
    finish: { type: String, trim: true },
    shape: { type: String, trim: true },
    image: { type: String, trim: true },
    images: [{ type: String, trim: true }],
    specifications: [specificationSchema],
    customOptions: [customOptionSchema],
    quantityTiers: [quantityTierSchema],
    qualityOptions: [qualityOptionSchema],
    styleOptions: [styleOptionSchema],
    options: { type: mongoose.Schema.Types.Mixed },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to sync description fields & slug if missing
productSchema.pre("save", async function () {
  if (!this.slug && this.id) {
    this.slug = this.id;
  }
  if (!this.description && this.desc) {
    this.description = this.desc;
  } else if (!this.desc && this.description) {
    this.desc = this.description;
  }
  if (!this.title && this.name) {
    this.title = this.name;
  }
});

if (process.env.NODE_ENV !== "production") {
  if (mongoose.models.Product) {
    delete mongoose.models.Product;
  }
  if (mongoose.connection?.models?.Product) {
    delete mongoose.connection.models.Product;
  }
}

export default mongoose.models.Product || mongoose.model("Product", productSchema);
