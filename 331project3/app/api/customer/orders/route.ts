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

    // Insert order
    const insertOrderQuery = `
      INSERT INTO orders (order_timestamp, total_amount, is_closed)
      VALUES (NOW(), $1, false)
      RETURNING order_id
    `;
    const orderResult = await client.query(insertOrderQuery, [totalAmount]);
    const orderId = orderResult.rows[0].order_id;

    // Process each item in the order
    for (const item of items) {
      const { itemId, finalPrice } = item;

      // 1. Get size_id
      const getSizeIdQuery = `
        SELECT size_id 
        FROM menuitemsizes 
        WHERE menu_item_id = $1 AND size_name ILIKE $2
      `;
      const sizeResult = await client.query(getSizeIdQuery, [
        itemId,
        item.customizations.size
      ]);

      if (sizeResult.rows.length === 0) {
        throw new Error(`Size "${item.customizations.size}" not found for menu item ${itemId}`);
      }

      const sizeId = sizeResult.rows[0].size_id;

      // 2. Insert order item
      const insertOrderItemQuery = `
        INSERT INTO orderitems (order_id, size_id, price_at_sale)
        VALUES ($1, $2, $3)
      `;
      await client.query(insertOrderItemQuery, [orderId, sizeId, finalPrice]);

      // 3. Get ingredient usage for this menu item
      const ingredientQuery = `
        SELECT ingredient_id, quant_used
        FROM ingredients
        WHERE menu_item_id = $1
      `;
      const ingredientResult = await client.query(ingredientQuery, [itemId]);

      // 4. Deduct inventory for each ingredient
      for (const ing of ingredientResult.rows) {
        const { ingredient_id, quant_used } = ing;

        // Check current inventory
        const invCheck = await client.query(
          `SELECT current_quantity FROM iteminventory WHERE ingredient_id = $1`,
          [ingredient_id]
        );

        if (invCheck.rows.length === 0) {
          throw new Error(`Ingredient ${ingredient_id} missing in inventory`);
        }

        const currentQty = Number(invCheck.rows[0].current_quantity);
        const newQty = currentQty - Number(quant_used);

        if (newQty < 0) {
          throw new Error(
            `Not enough ingredient_id ${ingredient_id}: need ${quant_used}, have ${currentQty}`
          );
        }

        // Update inventory
        await client.query(
          `
          UPDATE iteminventory
          SET current_quantity = $1
          WHERE ingredient_id = $2
        `,
          [newQty, ingredient_id]
        );
      }
    }

    // Commit transaction
    await client.query('COMMIT');

    return NextResponse.json(
      {
        message: 'Order placed successfully, inventory updated',
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
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}
