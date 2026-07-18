// app/api/graphics/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/mongodb";
import GraphicAsset from "@/app/models/GraphicAsset";
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
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const all = searchParams.get("all") === "true";

    const filter = {};
    if (!all) {
      filter.isActive = true;
    }
    if (category && category !== "all") {
      filter.category = category.toLowerCase();
    }
    if (search && search.trim() !== "") {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    const assets = await GraphicAsset.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      count: assets.length,
      data: assets,
    });
  } catch (error) {
    console.error("GET /api/graphics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch graphic assets" },
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

    if (!body.title || !body.url || !body.category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, category, url" },
        { status: 400 }
      );
    }

    const assetId = body.id || `ga-${body.category}-${Date.now()}`;
    const newAsset = await GraphicAsset.create({
      id: assetId,
      title: body.title,
      category: body.category,
      url: body.url,
      svgContent: body.svgContent || "",
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    return NextResponse.json(
      { success: true, data: newAsset },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/graphics error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create graphic asset" },
      { status: 500 }
    );
  }
}
