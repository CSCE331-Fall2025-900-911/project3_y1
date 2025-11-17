import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET() {
    let client;
    try {
        const pool = getDbPool();
        client = await pool.connect();

        const query = 'SELECT ingredient_id, ingredient_name, unit, current_quantity FROM iteminventory';
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
        const { ingredient_name, unit, current_quantity } = await request.json();

        if (!ingredient_name || !unit || !current_quantity) {
            return NextResponse.json({
                message: 'Missing required fields.',
            }, { status: 400 });
        }

        const pool = getDbPool();
        client = await pool.connect();

        const query = `INSERT INTO iteminventory (ingredient_name, unit, current_quantity)
            VALUES ($1, $2, $3)
            RETURNING ingredient_id, ingredient_name, unit, current_quantity`;

        const result = await client.query(query, [ingredient_name, unit, current_quantity]);

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Database insert error:', error);
        return NextResponse.json({
            message: 'Failed to add item.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}
