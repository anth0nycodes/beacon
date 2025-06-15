import { NextResponse } from "next/server";

const LOOPS_API_KEY = process.env.LOOPS_API_KEY;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    if (!LOOPS_API_KEY) {
      return NextResponse.json(
        { message: "API configuration error" },
        { status: 500 }
      );
    }

    // Create contact in Loops
    const response = await fetch(
      "https://app.loops.so/api/v1/contacts/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOOPS_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          // You can add optional fields here if needed:
          // firstName: "",
          // lastName: "",
          // subscribed: true,
          // userGroup: "", // You can add this later if you create groups
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle specific Loops error cases
      if (data.error?.includes("already exists")) {
        return NextResponse.json(
          { message: "This email already exists in our waitlist" },
          { status: 400 }
        );
      }

      throw new Error(data.error || "Failed to subscribe");
    }

    return NextResponse.json(
      { message: "Successfully subscribed to waitlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { message: "Failed to subscribe to waitlist" },
      { status: 500 }
    );
  }
}
