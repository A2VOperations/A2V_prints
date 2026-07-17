// app/models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String },
    name: { type: String, default: "Custom Print Item" },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    quality: { type: String },
    image: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      address: { type: String },
    },
    items: [orderItemSchema],
    itemsSummary: { type: String, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Processing", "Printing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "COD", "Refunded"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      default: "Gateway Future Ready",
    },
  },
  {
    timestamps: true,
  }
);

if (process.env.NODE_ENV !== "production") {
  if (mongoose.models.Order) {
    delete mongoose.models.Order;
  }
  if (mongoose.connection?.models?.Order) {
    delete mongoose.connection.models.Order;
  }
}

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
