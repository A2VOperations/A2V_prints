// app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/mongodb";
import Product from "@/app/models/Product";
import User from "@/models/User";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  if (!payload) return false;
  const userId = payload.userId || payload.id;
  if (!userId) return false;
  await connectDB();
  const user = await User.findById(userId);
  return user && user.role === "admin";
}


async function findProductByIdOrSlug(idOrSlug, categorySlug) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    const byObjId = await Product.findById(idOrSlug);
    if (byObjId) return byObjId;
  }

  const numVal = !isNaN(Number(idOrSlug)) ? Number(idOrSlug) : null;
  const idCondition = numVal !== null
    ? { $or: [{ id: String(idOrSlug) }, { numericId: numVal }] }
    : { id: String(idOrSlug) };

  if (categorySlug && categorySlug !== "all") {
    const byCatAndId = await Product.findOne({
      categorySlug: categorySlug.toLowerCase(),
      ...idCondition,
    });
    if (byCatAndId) return byCatAndId;
  }

  return await Product.findOne(idCondition);
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");

    const product = await findProductByIdOrSlug(id, categorySlug);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(`GET /api/products/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { success: false, error: "Access denied: Only administrators can modify products" },
        { status: 403 }
      );
    }
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const product = await findProductByIdOrSlug(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Keep desc and description synchronized
    if (body.description && !body.desc) {
      body.desc = body.description;
    } else if (body.desc && !body.description) {
      body.description = body.desc;
    }

    // Extract numeric price if possible
    if (body.price && typeof body.numericPrice === "undefined") {
      const numericMatch = body.price.toString().replace(/[^0-9.]/g, "");
      if (numericMatch) {
        body.numericPrice = parseFloat(numericMatch);
      }
    }

    Object.assign(product, body);
    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error(`PUT /api/products/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { success: false, error: "Access denied: Only administrators can delete products" },
        { status: 403 }
      );
    }
    await connectDB();
    const { id } = await params;

    const product = await findProductByIdOrSlug(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    await Product.deleteOne({ _id: product._id });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      id: product.id,
    });
  } catch (error) {
    console.error(`DELETE /api/products/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
