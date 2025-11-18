import { NextResponse } from "next/server";
import { getPrice } from "@/lib/funcs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const menuItemId = Number(url.searchParams.get("menuItemId"));
    const sizeId = Number(url.searchParams.get("sizeId"));

    if (!menuItemId || !sizeId) {
      return NextResponse.json(
        { error: "Missing menuItemId or sizeId" },
        { status: 400 }
      );
    }

    const price = await getPrice(menuItemId, sizeId);

    return NextResponse.json({ price });
  } catch (err) {
    console.error("Failed to get price:", err);
    return NextResponse.json(
      { error: "Failed to get price" },
      { status: 500 }
    );
  }
}
