import { NextResponse } from 'next/server';
import { getSizeId } from '@/lib/funcs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const menuItemId = Number(searchParams.get("menuItemId"));
    const sizeName = searchParams.get("sizeName");

    if (!menuItemId || !sizeName) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const sizeId = await getSizeId(menuItemId, sizeName);
    return NextResponse.json({ sizeId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch sizeId" }, { status: 500 });
  }
}
