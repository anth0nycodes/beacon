import { LoopsClient } from "loops";
import { NextResponse } from "next/server";

const loops = new LoopsClient(process.env.LOOPS_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await loops.updateContact(email, { email });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
