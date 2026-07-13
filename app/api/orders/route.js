// app/api/orders/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";
import User from "@/models/User";

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  const userId = payload.userId || payload.id;
  if (!userId) return null;
  await connectDB();
  const user = await User.findById(userId);
  return user ? { id: user._id.toString(), role: user.role, name: user.name, email: user.email } : null;
}

function sanitizeOrderDisplay(order) {
  let displayNames = [];
  if (Array.isArray(order.items) && order.items.length > 0) {
    displayNames = order.items
      .map((i) => {
        const name = i.name || i.title || i.productName;
        return name && name !== "undefined" ? name : "Custom Print Product";
      })
      .filter(Boolean);
  }
  let summary = order.itemsSummary || "";
  if (summary.includes("undefined") || !summary) {
    summary = displayNames.length > 0 ? displayNames.join(", ") : "Premium Visiting Cards (Custom Print)";
  }
  return {
    ...order,
    itemsSummary: summary.replace(/undefined/g, "Custom Print Product"),
  };
}

export async function GET(request) {
  try {
    await connectDB();
    const user = await getCurrentUser();

    // If admin, return all orders in MongoDB
    if (user && user.role === "admin") {
      const orders = await Order.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, data: orders.map(sanitizeOrderDisplay) });
    }

    // If logged in regular user, return their orders
    if (user) {
      const orders = await Order.find({ userId: user.id }).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, data: orders.map(sanitizeOrderDisplay) });
    }

    // Fallback if unauthenticated query
    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    const body = await request.json();

    const orderId = body.orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const rawItems = Array.isArray(body.items) ? body.items : [];
    const sanitizedItems = rawItems.map((item) => {
      let numericPrice = item.numericPrice || item.price || 0;
      if (typeof numericPrice !== "number") {
        numericPrice = parseFloat(String(numericPrice).replace(/[^0-9.]/g, "")) || 0;
      }
      return {
        productId: String(item.productId || item.id || ""),
        name: String(item.name || item.title || "Custom Print Item"),
        price: numericPrice,
        quantity: Number(item.quantity) || 1,
        quality: String(item.quality || item.style || "Standard"),
        image: String(item.image || ""),
      };
    });

    const newOrder = await Order.create({
      orderId,
      userId: user ? user.id : body.userId || "guest",
      customer: {
        name: body.customer?.name || (user ? user.name : "Customer"),
        email: body.customer?.email || (user ? user.email : "customer@example.com"),
        phone: body.customer?.phone || "+91 98765 43210",
        address: body.customer?.address || "Delivery Address Provided",
      },
      items: sanitizedItems,
      itemsSummary: body.itemsSummary || (sanitizedItems.length > 0 ? sanitizedItems.map((i) => `${i.quantity}x ${i.name}`).join(", ") : "Custom Print Order"),
      total: Number(body.total) || 0,
      status: body.status || "Processing",
      paymentStatus: body.paymentStatus || "Pending",
      paymentMethod: body.paymentMethod || "Gateway Future Ready",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        data: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
