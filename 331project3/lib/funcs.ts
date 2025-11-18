import { getDbPool } from "./db";
import { OrderItem, MenuItem } from "../types/types_cashier";

/**
 * Fetch all menu items for the cashier menu.
 */
export async function getMenuItems(): Promise<MenuItem[]> {
    const pool = getDbPool();
    const sql = `SELECT item_id, item_name, item_price FROM menuitems ORDER BY item_category, item_id`;
    const result = await pool.query(sql);
    return result.rows;
}

/**
 * Get the size ID for a menu item by size name
 */
export async function getSizeId(menuItemId: number, sizeName: string): Promise<number> {
    const pool = getDbPool();
    const sql = `SELECT size_id FROM menuitemsizes WHERE menu_item_id = $1 AND size_name ILIKE $2`;
    const result = await pool.query(sql, [menuItemId, sizeName]);
    if (result.rows.length > 0) return result.rows[0].size_id;
    return -1;
}

/**
 * Insert a new order and return its order_id
 */
async function insertOrder(client: any, totalAmount: number): Promise<number> {
    const sql = `INSERT INTO orders (order_timestamp, total_amount) VALUES (NOW(), $1) RETURNING order_id`;
    const res = await client.query(sql, [totalAmount]);
    return res.rows[0].order_id;
}

/**
 * Insert one order item
 */
async function insertOrderItem(client: any, orderId: number, item: OrderItem): Promise<void> {
    const sql = `INSERT INTO orderitems (order_id, size_id, price_at_sale) VALUES ($1, $2, $3)`;
    await client.query(sql, [orderId, item.size_id, item.price_at_sale]);
}

/**
 * Update inventory for one menu item
 */
async function updateInventoryForItem(client: any, itemId: number): Promise<void> {
    // Get ingredients for this menu item
    const selectSql = `SELECT ingredient_id, quant_used FROM ingredients WHERE menu_item_id = $1`;
    const ingredients = await client.query(selectSql, [itemId]);

    // Update each ingredient
    for (const ing of ingredients.rows) {
        const updateSql = `UPDATE iteminventory SET current_quantity = current_quantity - $1 WHERE ingredient_id = $2`;
        await client.query(updateSql, [ing.quant_used, ing.ingredient_id]);
    }
}

/**
 * Complete an order transaction
 */
export async function completeOrderTransaction(items: OrderItem[], totalAmount: number): Promise<boolean> {
    const pool = getDbPool();
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const newOrderId = await insertOrder(client, totalAmount);

        for (const item of items) {
            await insertOrderItem(client, newOrderId, item);
            await updateInventoryForItem(client, item.item_id);
        }

        await client.query("COMMIT");
        return true;
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Order transaction failed:", err);
        return false;
    } finally {
        client.release();
    }
}

/**
 * Get the price for a certain size
 */

export async function getPrice(menuItemId: number, sizeId: number): Promise<number> {
  const pool = getDbPool();
  const sql = `
    SELECT price 
    FROM menuitemsizes 
    WHERE menu_item_id = $1 AND size_id = $2
  `;

  const result = await pool.query(sql, [menuItemId, sizeId]);
  if (result.rows.length > 0) return result.rows[0].price;

  return -1; 
}

/**
 * Add other cashier-related functions here:
 * - calculate subtotal/total (if not handled in frontend)
 * - fetch size prices
 * - fetch inventory for available toppings
 */

