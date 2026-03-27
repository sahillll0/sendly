import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/app/lib/db/connect";
import Project from "@/app/models/Project/Project";
import { generateApiKey } from "@/app/utils/authjwt/apiKey";

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

export async function GET(request) {
  try {
    const userId = await authenticate(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ projects }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await authenticate(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    await connectDB();
    const apiKey = generateApiKey();
    const newProject = new Project({
      userId,
      name: name.trim(),
      apiKey,
    });
    await newProject.save();

    return NextResponse.json({ message: "Project created successfully...", project: newProject }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
