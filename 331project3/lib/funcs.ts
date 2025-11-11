// import { getDbPool } from "./db"; // Your existing db connection
// import { OrderItem, MenuItemData } from "../types/menu"; // Create types/interfaces as needed

// /**
//  * Fetch all menu items for the cashier menu.
//  */
// export async function getMenuItems(): Promise<MenuItemData[]> {
//     const pool = getDbPool();
//     const sql = `SELECT item_id, item_name, item_price FROM menuitems ORDER BY item_category, item_id`;
//     const result = await pool.query(sql);
//     return result.rows;
// }

// /**
//  * Get the size ID for a menu item by size name
//  */
// export async function getSizeId(menuItemId: number, sizeName: string): Promise<number> {
//     const pool = getDbPool();
//     const sql = `SELECT size_id FROM menuitemsizes WHERE menu_item_id = $1 AND size_name ILIKE $2`;
//     const result = await pool.query(sql, [menuItemId, sizeName]);
//     if (result.rows.length > 0) return result.rows[0].size_id;
//     return -1;
// }

// /**
//  * Complete an order: inserts into orders, orderitems, and updates inventory.
//  */
// export async function completeOrderTransaction(items: OrderItem[], totalAmount: number): Promise<boolean> {
//     const pool = getDbPool();
//     const client = await pool.connect();
//     try {
//         await client.query("BEGIN");

//         const insertOrderSql = `INSERT INTO orders (order_timestamp, total_amount) VALUES (NOW(), $1) RETURNING order_id`;
//         const res = await client.query(insertOrderSql, [totalAmount]);
//         const newOrderId = res.rows[0].order_id;

//         for (const item of items) {
//             // Insert order items
//             const insertItemSql = `INSERT INTO orderitems (order_id, size_id, price_at_sale) VALUES ($1, $2, $3)`;
//             await client.query(insertItemSql, [newOrderId, item.sizeId, item.priceAtSale]);

//             // Update inventory
//             const selectIngredientsSql = `SELECT ingredient_id, quant_used FROM ingredients WHERE menu_item_id = $1`;
//             const ingredients = await client.query(selectIngredientsSql, [item.menuItemId]);
//             for (const ing of ingredients.rows) {
//                 const updateInventorySql = `UPDATE iteminventory SET current_quantity = current_quantity - $1 WHERE ingredient_id = $2`;
//                 await client.query(updateInventorySql, [ing.quant_used, ing.ingredient_id]);
//             }
//         }

//         await client.query("COMMIT");
//         return true;
//     } catch (err) {
//         await client.query("ROLLBACK");
//         console.error("Order transaction failed:", err);
//         return false;
//     } finally {
//         client.release();
//     }
// }

// /**
//  * Add other cashier-related functions here:
//  * - calculate subtotal/total (if not handled in frontend)
//  * - fetch size prices
//  * - fetch inventory for available toppings
//  */
