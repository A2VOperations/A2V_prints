// app/api/auth/logout/route.js
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return Response.json({ message: "Logged out" });
  } catch (error) {
    return Response.json({ error: "Failed to log out" }, { status: 500 });
  }
}