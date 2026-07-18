// app/api/orders/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isValidObjectId ? { $or: [{ orderId: id }, { _id: id }] } : { orderId: id };

    const order = await Order.findOne(query).lean();

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isValidObjectId ? { $or: [{ orderId: id }, { _id: id }] } : { orderId: id };

    const updatedOrder = await Order.findOneAndUpdate(
      query,
      { $set: body },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}
