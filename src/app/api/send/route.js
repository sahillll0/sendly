import { NextResponse } from "next/server";
import { validateApiKey } from "@/app/utils/authjwt/validateApiKey";
import Submission from "@/app/models/Submission/Submission";
import { sendEmail } from "@/app/lib/email/sendEmail";
import connectDB from "@/app/lib/db/connect";

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ status: "error", message: "Invalid JSON format" }, { status: 400 });
    }

    const { apiKey: bodyApiKey, name, email, message } = body;

    // 1. Validate API Key (checks body first, then headers)
    const { user, project, response } = await validateApiKey(request, bodyApiKey);
    if (response) {
      // Re-map error response to match requested { status: 'error', message: '...' } format
      const origError = await response.json();
      return NextResponse.json(
        { status: "error", message: origError.error },
        { status: response.status }
      );
    }

    // 2. Input Validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ status: "error", message: "Email is required and must be a string" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ status: "error", message: "Invalid email format" }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ status: "error", message: "Message is required and cannot be empty" }, { status: 400 });
    }

    // 3. Connect to DB and Save Submission
    await connectDB();
    const newSubmission = new Submission({
      userId: user._id,
      projectId: project._id,
      name: name?.trim() || "Anonymous",
      email: email.trim(),
      message: message.trim(),
    });
    await newSubmission.save();

    // 4. Send Email Notification
    try {
      // 4a. Send notification to the API key owner (Platform User)
      await sendEmail({
        to: user.email,
        replyTo: email.trim(),
        name: name?.trim(),
        message: message.trim(),
        ownerName: project.name || "your project",
      });

      // 4b. Send an auto-reply confirmation to the form submitter (End User)
      await sendEmail({
        to: email.trim(),
        replyTo: user.email,
        name: name?.trim(),
        message: message.trim(),
        isAutoReply: true,
        ownerName: project.name || "our website",
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // We still return success but maybe log the error, or return a 500 depending on requirements.
      // Requirements say: "status: error, message: Email sending failure" if email fails
      return NextResponse.json({ status: "error", message: "Email sending failure" }, { status: 500 });
    }

    // 5. Success Response
    return NextResponse.json({ status: "success", message: "Email sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
  }
}
