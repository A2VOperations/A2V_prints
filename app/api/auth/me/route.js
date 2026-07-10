// app/api/auth/me/route.js
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ user: null }, { status: 200 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.userId || !mongoose.Types.ObjectId.isValid(payload.userId)) {
      return Response.json({ user: null }, { status: 200 });
    }

    await connectDB();
    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return Response.json({ user: null }, { status: 200 });
    }

    return Response.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("Auth /me error:", error);
    return Response.json({ user: null }, { status: 200 });
  }
}
