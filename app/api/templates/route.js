// app/api/templates/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/mongodb";
import Template from "@/app/models/Template";
import User from "@/models/User";
import { categoryTemplateMap } from "@/app/lib/templatesData";

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
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "200", 10);
    const sort = searchParams.get("sort") || "createdAt_desc";

    const filter = {};

    if (categorySlug && categorySlug !== "all") {
      filter.categorySlug = categorySlug.toLowerCase();
    }

    if (search && search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { categoryName: { $regex: search, $options: "i" } },
        { badge: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };

    const templates = await Template.find(filter)
      .sort(sortOption)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    console.error("GET /api/templates error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await request.json();

    if (!body.title || !body.categorySlug) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, categorySlug" },
        { status: 400 }
      );
    }

    const isVisitingCard = body.categorySlug === "visiting-cards";
    const catData = categoryTemplateMap[body.categorySlug] || {};
    const slugId = body.id || `tpl-${body.categorySlug}-${Date.now()}`;
    const newTemplate = await Template.create({
      id: slugId,
      title: body.title,
      categorySlug: body.categorySlug,
      categoryName: body.categoryName || catData.name || body.categorySlug.replace(/-/g, " "),
      price: body.price || catData.basePrice || "₹200.00",
      unitPrice: body.unitPrice || catData.unitPriceText || "₹2.00 each / 100 units",
      size: body.size || catData.size || "Standard Fixed Size",
      hasBackSide: isVisitingCard,
      image: body.frontImage || body.image || body.frontBackground || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80",
      frontImage: body.frontImage || body.image || body.frontBackground || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80",
      backImage: isVisitingCard
        ? (body.backImage || body.backBackground || body.frontImage || body.image || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80")
        : (body.frontImage || body.image || body.frontBackground || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80"),
      rating: body.rating || 4.8,
      reviews: body.reviews || 0,
      badge: body.badge || "New",
      colors: body.colors || ["#2563EB", "#1E293B", "#10B981"],
      orientation: body.orientation || "Horizontal",
      frontElements: body.frontElements || [],
      backElements: body.backElements || [],
      frontBackground: body.frontBackground || body.frontImage || body.image || "",
      backBackground: body.backBackground || body.backImage || body.frontImage || body.image || "",
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    return NextResponse.json(
      { success: true, data: newTemplate },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/templates error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A template with this ID already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create template" },
      { status: 500 }
    );
  }
}
