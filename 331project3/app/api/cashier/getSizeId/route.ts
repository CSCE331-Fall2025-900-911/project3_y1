import { NextResponse } from "next/server";
import { getSizeId } from "@/lib/funcs"; // adjust path if needed

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const menuItemId = Number(url.searchParams.get("menuItemId"));
    const sizeName = url.searchParams.get("sizeName");

    if (!menuItemId || !sizeName) {
      return NextResponse.json(
        { error: "Missing menuItemId or sizeName" },
        { status: 400 }
      );
    }

    const sizeId = await getSizeId(menuItemId, sizeName);

    return NextResponse.json({ sizeId });
  } catch (err) {
    console.error("Failed to get size ID:", err);
    return NextResponse.json(
      { error: "Failed to get size ID" },
      { status: 500 }
    );
  }
}
