import { NextResponse } from 'next/server';
import { getPrice } from '@/lib/funcs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const menuItemId = Number(searchParams.get("menuItemId"));
    const sizeId = Number(searchParams.get("sizeId"));

    if (isNaN(menuItemId) || isNaN(sizeId)) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const price = await getPrice(menuItemId, sizeId);
    if (price === -1) {
      return NextResponse.json({ error: "Price not found" }, { status: 404 });
    }

    return NextResponse.json({ price });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}
