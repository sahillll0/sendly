import { NextResponse } from "next/server";
import { validateApiKey } from "@/app/utils/authjwt/validateApiKey";
import Submission from "@/app/models/Submission/Submission";
import { sendEmail } from "@/app/lib/email/sendEmail";
import connectDB from "@/app/lib/db/connect";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key, Authorization",
    },
  });
}

export async function POST(request) {
  // CORS Headers for all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key, Authorization",
  };

  try {
    let body;
    const contentType = request.headers.get("content-type") || "";
    
    try {
      if (contentType.includes("application/json")) {
        body = await request.json();
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await request.formData();
        body = Object.fromEntries(formData.entries());
      } else {
        // Fallback to try JSON if content-type is missing or different
        body = await request.json();
      }
    } catch (e) {
      return NextResponse.json(
        { status: "error", message: "Invalid request body or format" }, 
        { status: 400, headers: corsHeaders }
      );
    }

    const { apiKey: bodyApiKey, name, email, message } = body;

    // 1. Validate API Key (checks body first, then headers)
    const { user, project, response } = await validateApiKey(request, bodyApiKey);
    if (response) {
      // Re-map error response to match requested { status: 'error', message: '...' } format
      const origError = await response.json();
      return NextResponse.json(
        { status: "error", message: origError.error },
        { status: response.status, headers: corsHeaders }
      );
    }

    // 2. Input Validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { status: "error", message: "Email is required and must be a string" }, 
        { status: 400, headers: corsHeaders }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { status: "error", message: "Invalid email format" }, 
        { status: 400, headers: corsHeaders }
      );
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { status: "error", message: "Message is required and cannot be empty" }, 
        { status: 400, headers: corsHeaders }
      );
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
      return NextResponse.json(
        { status: "error", message: "Email sending failure" }, 
        { status: 500, headers: corsHeaders }
      );
    }

    // 5. Success Response
    return NextResponse.json(
      { status: "success", message: "Email sent successfully" }, 
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" }, 
      { status: 500, headers: corsHeaders }
    );
  }
}
