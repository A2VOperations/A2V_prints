// app/api/products/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
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


export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("categorySlug") || searchParams.get("category");
    const serviceType = searchParams.get("serviceType");
    const search = searchParams.get("search");
    const badge = searchParams.get("badge");
    const isActiveParam = searchParams.get("isActive");
    const isFeaturedParam = searchParams.get("isFeatured");
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const sort = searchParams.get("sort") || "createdAt_desc";

    const filter = {};

    if (categorySlug && categorySlug !== "all") {
      filter.categorySlug = categorySlug.toLowerCase();
    }

    if (serviceType && serviceType !== "all") {
      filter.serviceType = serviceType.toLowerCase();
    }

    if (badge && badge !== "all") {
      filter.badge = new RegExp(`^${badge}$`, "i");
    }

    if (isActiveParam !== null && isActiveParam !== "all") {
      filter.isActive = isActiveParam === "true";
    }

    if (isFeaturedParam === "true") {
      filter.isFeatured = true;
    }

    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { title: searchRegex },
        { desc: searchRegex },
        { description: searchRegex },
        { id: searchRegex },
      ];
    }

    // Sorting logic
    let sortObj = { createdAt: -1 };
    if (sort === "price_asc") {
      sortObj = { numericPrice: 1, _id: 1 };
    } else if (sort === "price_desc") {
      sortObj = { numericPrice: -1, _id: 1 };
    } else if (sort === "rating") {
      sortObj = { rating: -1, reviews: -1 };
    } else if (sort === "name_asc") {
      sortObj = { name: 1 };
    }

    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      count: products.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { success: false, error: "Access denied: Only administrators can create products" },
        { status: 403 }
      );
    }
    await connectDB();
    const body = await request.json();

    if (!body.name || !body.categorySlug) {
      return NextResponse.json(
        { success: false, error: "name and categorySlug are required fields" },
        { status: 400 }
      );
    }

    // Generate id if not provided
    if (!body.id) {
      const slugBase = (body.slug || body.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      body.id = `${slugBase}-${Date.now().toString().slice(-4)}`;
    }

    // Sync desc and description
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

    const newProduct = await Product.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/products error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A product with this id already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
