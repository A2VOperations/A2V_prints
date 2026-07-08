// app/api/users/route.js
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request) {
  await connectDB();
  const users = await User.find().lean();
  return Response.json(users);
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const user = await User.create(body);
  return Response.json(user, { status: 201 });
}