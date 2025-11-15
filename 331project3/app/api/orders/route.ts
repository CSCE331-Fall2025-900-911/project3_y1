import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function POST(request: Request) {
  let client;
  try {
    const pool = getDbPool();
    client = await pool.connect();
    
    const body = await request.json();
    const { items, totalAmount } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: 'Invalid order: items array is required' },
        { status: 400 }
      );
    }

    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      return NextResponse.json(
        { message: 'Invalid order: totalAmount must be a positive number' },
        { status: 400 }
      );
    }

    // Start transaction
    await client.query('BEGIN');

    // Insert order (customer orders don't have employee_id, so it stays NULL)
    const insertOrderQuery = `
      INSERT INTO orders (order_timestamp, total_amount, is_closed) 
      VALUES (NOW(), $1, false) 
      RETURNING order_id
    `;
    const orderResult = await client.query(insertOrderQuery, [totalAmount]);
    const orderId = orderResult.rows[0].order_id;

    // Insert order items
    for (const item of items) {
      // Get size_id from menuitemsizes table
      // Map size names: "Small" -> "Small", "Medium" -> "Medium", "Large" -> "Large"
      const getSizeIdQuery = `
        SELECT size_id 
        FROM menuitemsizes 
        WHERE menu_item_id = $1 AND size_name ILIKE $2
      `;
      const sizeResult = await client.query(getSizeIdQuery, [
        item.itemId,
        item.customizations.size
      ]);

      if (sizeResult.rows.length === 0) {
        throw new Error(`Size "${item.customizations.size}" not found for menu item ${item.itemId}`);
      }

      const sizeId = sizeResult.rows[0].size_id;

      // Insert order item (only size_id and price_at_sale are stored)
      // Note: ice_level, sugar_level, and toppings cannot be stored with current schema
      const insertOrderItemQuery = `
        INSERT INTO orderitems (order_id, size_id, price_at_sale) 
        VALUES ($1, $2, $3)
      `;
      
      await client.query(insertOrderItemQuery, [
        orderId,
        sizeId,
        item.finalPrice
      ]);
    }

    // Commit transaction
    await client.query('COMMIT');

    return NextResponse.json(
      { 
        message: 'Order placed successfully',
        orderId: orderId 
      },
      { status: 201 }
    );
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('Database error:', error);
    return NextResponse.json(
      {
        message: 'Failed to place order',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}