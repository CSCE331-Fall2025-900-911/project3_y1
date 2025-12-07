import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET() {
    let client;
    try {
        const pool = getDbPool();
        client = await pool.connect();

        // Check if settings table exists, if not create it
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

        // Get current drink of the day
        const result = await client.query('SELECT drink_of_the_day_item_id FROM settings WHERE id = 1');
        
        const drinkOfTheDayId = result.rows[0]?.drink_of_the_day_item_id || null;

        return NextResponse.json({ item_id: drinkOfTheDayId }, { status: 200 });
    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({
            message: 'Failed to fetch drink of the day.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}

export async function PUT(request: Request) {
    let client;
    try {
        const { item_id } = await request.json();

        // Validate item_id if provided
        if (item_id !== null && (typeof item_id !== 'number' || item_id <= 0)) {
            return NextResponse.json({
                message: 'Invalid item_id. Must be a positive number or null.',
            }, { status: 400 });
        }

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

        // If item_id is provided, verify it exists
        if (item_id !== null) {
            const itemCheck = await client.query('SELECT item_id FROM menuitems WHERE item_id = $1', [item_id]);
            if (itemCheck.rows.length === 0) {
                return NextResponse.json({
                    message: 'Menu item not found.',
                }, { status: 404 });
            }
        }

        // Update the drink of the day
        await client.query(
            'UPDATE settings SET drink_of_the_day_item_id = $1 WHERE id = 1',
            [item_id]
        );

        return NextResponse.json({ 
            message: 'Drink of the day updated successfully.',
            item_id: item_id 
        }, { status: 200 });
    } catch (error) {
        console.error('Database update error:', error);
        return NextResponse.json({
            message: 'Failed to update drink of the day.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}

