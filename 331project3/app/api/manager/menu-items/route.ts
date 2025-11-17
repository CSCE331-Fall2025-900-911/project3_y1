import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET() {
    let client;
    try {
        const pool = getDbPool();
        client = await pool.connect();

        const query = 'SELECT item_id, item_name, item_category, item_price FROM menuitems';
        const result = await client.query(query);

        return NextResponse.json(result.rows, { status: 200 });
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

export async function POST(request: Request) {
    let client;
    try {
        const { item_name, item_category, item_price } = await request.json();

        if (!item_name || !item_category || !item_price) {
            return NextResponse.json({
                message: 'Missing required fields.',
            }, { status: 400 });
        }

        const pool = getDbPool();
        client = await pool.connect();

        const query = `INSERT INTO menuitems (item_name, item_category, item_price)
            VALUES ($1, $2, $3)
            RETURNING item_id, item_name, item_category, item_price`;

        const result = await client.query(query, [item_name, item_category, item_price]);

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Database insert error:', error);
        return NextResponse.json({
            message: 'Failed to add menu item.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}
