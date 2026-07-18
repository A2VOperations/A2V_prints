// app/api/templates/[id]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/mongodb";
import Template from "@/app/models/Template";
import User from "@/models/User";
import mongoose from "mongoose";

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

async function findTemplateByIdOrSlug(idOrSlug) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    const byObjId = await Template.findById(idOrSlug);
    if (byObjId) return byObjId;
  }
  return await Template.findOne({ id: String(idOrSlug) });
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const template = await findTemplateByIdOrSlug(id);

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    console.error(`GET /api/templates/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch template" },
      { status: 500 }
    );
  }
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

    const template = await findTemplateByIdOrSlug(id);
    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    if (body.categorySlug) {
      body.hasBackSide = body.categorySlug === "visiting-cards";
      if (!body.hasBackSide) {
        body.backImage = body.frontImage || body.image;
      }
    }

    if (body.frontBackground && (body.frontBackground.startsWith('http') || body.frontBackground.startsWith('/') || body.frontBackground.startsWith('data:image'))) {
      if (!body.frontImage) body.frontImage = body.frontBackground;
      if (!body.image) body.image = body.frontBackground;
    }
    if (body.backBackground && (body.backBackground.startsWith('http') || body.backBackground.startsWith('/') || body.backBackground.startsWith('data:image'))) {
      if (!body.backImage) body.backImage = body.backBackground;
    }
    if (body.frontImage || body.image) {
      if (!body.frontBackground) body.frontBackground = body.frontImage || body.image;
      if (!body.image) body.image = body.frontImage;
      if (!body.frontImage) body.frontImage = body.image;
    }
    if (body.backImage && !body.backBackground) {
      body.backBackground = body.backImage;
    }

    const up = await Template.findByIdAndUpdate(template._id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: up });
  } catch (error) {
    console.error(`PUT /api/templates/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update template" },
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
    const template = await findTemplateByIdOrSlug(id);

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    await Template.findByIdAndDelete(template._id);

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error(`DELETE /api/templates/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to delete template" },
      { status: 500 }
    );
  }
}
