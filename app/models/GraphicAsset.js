// app/models/GraphicAsset.js
import mongoose from "mongoose";

const graphicAssetSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["image", "icon", "illustration"],
      default: "image",
      index: true,
    },
    url: { type: String, required: true },
    svgContent: { type: String, default: "" },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

if (process.env.NODE_ENV !== "production") {
  if (mongoose.models.GraphicAsset) {
    delete mongoose.models.GraphicAsset;
  }
  if (mongoose.connection?.models?.GraphicAsset) {
    delete mongoose.connection.models.GraphicAsset;
  }
}

export default mongoose.models.GraphicAsset ||
  mongoose.model("GraphicAsset", graphicAssetSchema);
