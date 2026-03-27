import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db/connect";
import User from "@/app/models/User/User";
import { generateApiKey } from "@/app/utils/authjwt/apiKey";
import { getAuthUser } from "@/app/utils/authjwt/getAuthUser";

export async function GET(request) {
  try {
    await connectDB();
    const decodedUser = await getAuthUser(request);
    
    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(decodedUser.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Include the apiKey in the response since this route is for viewing it!
    return NextResponse.json({ apiKey: user.apiKey }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving API key:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const decodedUser = await getAuthUser(request);

    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(decodedUser.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newApiKey = generateApiKey();
    user.apiKey = newApiKey;
    await user.save();

    return NextResponse.json({ message: "API key regenerated successfully", apiKey: newApiKey }, { status: 200 });
  } catch (error) {
    console.error("Error regenerating API key:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
