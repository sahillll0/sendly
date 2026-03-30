import connectDB from "@/app/lib/db/connect";
import Project from "@/app/models/Project/Project";
import User from "@/app/models/User/User"; // Register the User model before populating
import { NextResponse } from "next/server";

export async function validateApiKey(request, manualKey = null) {
  try {
    let apiKey = manualKey;
    if (!apiKey) {
      apiKey = request.headers.get("x-api-key") || request.headers.get("apikey");
    }
    
    if (!apiKey) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer sk_")) {
        apiKey = authHeader.split(" ")[1];
      }
    }

    if (!apiKey) {
      return { project: null, user: null, response: NextResponse.json({ error: "Unauthorized: Missing API Key" }, { status: 401 }) };
    }

    if (!apiKey.startsWith("sk_")) {
      return { project: null, user: null, response: NextResponse.json({ error: "Unauthorized: Invalid API Key format" }, { status: 401 }) };
    }

    await connectDB();
    const project = await Project.findOne({ apiKey }).populate('userId');

    if (!project || !project.userId) {
      return { project: null, user: null, response: NextResponse.json({ error: "Unauthorized: Invalid API Key" }, { status: 401 }) };
    }

    return { project, user: project.userId, response: null };
  } catch (error) {
    console.error("Error validating API key:", error);
    return { project: null, user: null, response: NextResponse.json({ error: "Internal Server Error during authentication" }, { status: 500 }) };
  }
}
