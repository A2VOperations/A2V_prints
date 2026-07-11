// app/api/auth/seed-admin/route.js
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const email = "admin@a2vprints.com";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    let adminUser = await User.findOne({ email });
    if (adminUser) {
      adminUser.password = hashedPassword;
      adminUser.role = "admin";
      adminUser.name = "A2V Admin";
      await adminUser.save();
    } else {
      adminUser = await User.create({
        name: "A2V Admin",
        email,
        password: hashedPassword,
        role: "admin",
      });
    }

    return Response.json({
      success: true,
      message: "Admin account seeded successfully",
      credentials: {
        email: "admin@a2vprints.com",
        password: "admin123",
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Seed admin error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
