import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db/connect";
import User from "@/app/models/User/User";
import Submission from "@/app/models/Submission/Submission";
import Project from "@/app/models/Project/Project"; // Import Project model
import { getAuthUser } from "@/app/utils/authjwt/getAuthUser";

export async function GET(request) {
  try {
    const decodedUser = await getAuthUser(request);
    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(decodedUser.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const projectCount = await Project.countDocuments({ userId: decodedUser.userId });

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name || "",
        image: user.image || "",
        email: user.email,
        status: "Active",
        totalProjects: projectCount,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const decodedUser = await getAuthUser(request);
    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updateData = {};

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.image !== undefined) updateData.image = body.image.trim();

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      decodedUser.userId,
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully", name: user.name, image: user.image });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const decodedUser = await getAuthUser(request);
    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Purge all submissions first
    await Submission.deleteMany({ userId: decodedUser.userId });

    // Delete user
    const user = await User.findByIdAndDelete(decodedUser.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
