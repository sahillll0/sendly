import { validateApiKey } from "@/app/utils/authjwt/validateApiKey";
import { getAuthUser } from "@/app/utils/authjwt/getAuthUser";
import connectDB from "@/app/lib/db/connect";
import Submission from "@/app/models/Submission/Submission";
import { NextResponse } from "next/server";

export async function POST(request) {
  // 1. Invoke the validateApiKey utility to protect this endpoint
  const { user, response } = await validateApiKey(request);

  // 2. If response is populated, validation failed -> return the error
  if (response) {
    return response;
  }

  // 3. Validation passed! We know exactly who is making the request
  try {
    const body = await request.json();

    // Process the submission (mocked here)
    // Eg. saving to Submission schema
    
    return NextResponse.json(
      {
        message: "Protected submission successful!",
        identifiedUser: {
          id: user._id,
          email: user.email,
        },
        yourSubmission: body,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Given body is invalid JSON" }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const decodedUser = await getAuthUser(request);
    
    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch submissions belonging to the logged in user
    const submissions = await Submission.find({ userId: decodedUser.userId })
      .select('name email message createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
