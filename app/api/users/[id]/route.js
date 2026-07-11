// app/api/users/[id]/route.js
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const user = await User.findById(id).select("-password");
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });
    return Response.json(user);
  } catch (error) {
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Prevent direct password overwrite via PATCH without hashing if password passed
    delete body.password;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("PATCH User Error:", error);
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    return Response.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE User Error:", error);
    return Response.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
