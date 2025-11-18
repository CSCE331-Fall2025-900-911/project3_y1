import { NextResponse } from "next/server";
import { completeOrderTransaction } from "@/lib/funcs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { items, totalAmount } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid items in request." },
        { status: 400 }
      );
    }

    // Call your database transaction
    const success = await completeOrderTransaction(items, totalAmount);

    if (!success) {
      return NextResponse.json(
        { error: "Order transaction failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Order completed successfully" });
  } catch (err) {
    console.error("Complete order error:", err);
    return NextResponse.json(
      { error: "Server error while completing order" },
      { status: 500 }
    );
  }
}
