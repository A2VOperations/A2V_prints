// app/api/products/seed/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Product from "@/app/models/Product";
import Category from "@/app/models/Category";

export async function GET() {
  try {
    await connectDB();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();

    return NextResponse.json({
      success: true,
      message: "Database is seeded and active.",
      totalProducts,
      totalCategories,
    });
  } catch (error) {
    console.error("GET /api/products/seed error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
