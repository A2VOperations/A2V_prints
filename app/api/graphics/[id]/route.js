// app/api/graphics/[id]/route.js
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

export async function PUT(request, { params }) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updated = await GraphicAsset.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Graphic asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/graphics/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update asset" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;

    const deleted = await GraphicAsset.findOneAndDelete({ id });

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Graphic asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Asset deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/graphics/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete asset" },
      { status: 500 }
    );
  }
}
