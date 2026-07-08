// app/api/users/[id]/route.js
export async function GET(request, { params }) {
  await connectDB();
  const user = await User.findById(params.id);
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(user);
}