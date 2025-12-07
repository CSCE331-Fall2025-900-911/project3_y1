import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET(request: Request) {
    let client;
    try {
        const pool = getDbPool();
        client = await pool.connect();

        // Ensure settings table exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY DEFAULT 1,
                drink_of_the_day_item_id INTEGER,
                CONSTRAINT settings_single_row CHECK (id = 1),
                CONSTRAINT fk_drink_of_the_day FOREIGN KEY (drink_of_the_day_item_id) 
                    REFERENCES menuitems(item_id) ON DELETE SET NULL
            )
        `);

        // Insert default row if it doesn't exist
        await client.query(`
            INSERT INTO settings (id, drink_of_the_day_item_id)
            VALUES (1, NULL)
            ON CONFLICT (id) DO NOTHING
        `);

        // Get menu items
        const query = 'SELECT item_id, item_name, item_category, item_price FROM menuitems';
        const result = await client.query(query);

        // Get drink of the day
        const settingsResult = await client.query('SELECT drink_of_the_day_item_id FROM settings WHERE id = 1');
        const drinkOfTheDayId = settingsResult.rows[0]?.drink_of_the_day_item_id || null;

        return NextResponse.json({
            menuItems: result.rows,
            drinkOfTheDayItemId: drinkOfTheDayId
        }, { status: 200 });
    } catch (error) {
        console.error('Database query error:', error);

        //return error if error ):
        return NextResponse.json({
            message: 'Failed to fetch menu items.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
};