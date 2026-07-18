// app/api/upload/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/models/User";
import { uploadToCloudinary } from "@/app/lib/cloudinary";

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

export async function POST(request) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    let fileData = null;
    let folder = "a2v_graphics";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided in form data." },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mimeType = file.type || "image/png";
      fileData = `data:${mimeType};base64,${base64}`;
      const folderParam = formData.get("folder");
      if (folderParam) folder = folderParam;
    } else if (contentType.includes("application/json")) {
      const body = await request.json();
      fileData = body.data || body.file || body.image;
      if (body.folder) folder = body.folder;
    }

    if (!fileData) {
      return NextResponse.json(
        { success: false, error: "No image or file data provided." },
        { status: 400 }
      );
    }

    const result = await uploadToCloudinary(fileData, folder);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("POST /api/upload error:", error.message || error);
    return NextResponse.json(
      { success: false, error: error.message || "Upload failed.", useFallback: true },
      { status: 200 }
    );
  }
}
