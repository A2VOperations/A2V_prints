// app/api/categories/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Category from "@/app/models/Category";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get("serviceType");

    const filter = { isActive: true };
    if (serviceType && serviceType !== "all") {
      filter.serviceType = serviceType.toLowerCase();
    }

    const categories = await Category.find(filter).sort({ createdAt: 1 }).lean();

    return NextResponse.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
