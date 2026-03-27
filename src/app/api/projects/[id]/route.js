import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/app/lib/db/connect";
import Project from "@/app/models/Project/Project";

const authenticate = async (request) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (err) {
    return null;
  }
};

export async function DELETE(request, { params }) {
  try {
    const userId = await authenticate(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    // In Next.js App Router, params is a Promise that must be awaited
    const { id } = await params;

    await connectDB();
    const project = await Project.findOne({ _id: id, userId });
    
    if (!project) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 });
    }

    await project.deleteOne();
    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
