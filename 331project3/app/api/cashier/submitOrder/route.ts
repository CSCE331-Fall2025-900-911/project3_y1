import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body;

    const pool = getDbPool();

    const totalAmount = items.reduce((sum: number, item: any) => sum + item.finalPrice, 0);

    // Create order
    const orderResult = await pool.query(
      `INSERT INTO orders (order_timestamp, total_amount) VALUES (NOW(), $1) RETURNING order_id`,
      [totalAmount]
    );
    const orderId = orderResult.rows[0].order_id;

    // Insert items
    for (const item of items) {
      await pool.query(
        `
          INSERT INTO orderitems (order_id, size_id, price_at_sale)
          VALUES ($1, $2, $3)
        `,
        [orderId, item.sizeId, item.finalPrice]
      );
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error("Submit order error:", err);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}
