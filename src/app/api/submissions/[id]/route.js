import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db/connect";
import Submission from "@/app/models/Submission/Submission";
import { getAuthUser } from "@/app/utils/authjwt/getAuthUser";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    await connectDB();
    const decodedUser = await getAuthUser(request);

    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submission = await Submission.findById(id).lean();

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Check ownership
    if (submission.userId.toString() !== decodedUser.userId) {
      return NextResponse.json({ error: "Unauthorized access to submission" }, { status: 401 });
    }

    return NextResponse.json({ submission }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving submission:", error);
    // If id is not a valid ObjectId, Mongoose throws a CastError
    if (error.name === "CastError") {
       return NextResponse.json({ error: "Invalid submission ID format" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await connectDB();
    const decodedUser = await getAuthUser(request);

    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submission = await Submission.findById(id);

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Check ownership
    if (submission.userId.toString() !== decodedUser.userId) {
      return NextResponse.json({ error: "Unauthorized access to submission" }, { status: 401 });
    }

    await Submission.findByIdAndDelete(id);

    return NextResponse.json({ message: "Submission deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting submission:", error);
     if (error.name === "CastError") {
       return NextResponse.json({ error: "Invalid submission ID format" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
