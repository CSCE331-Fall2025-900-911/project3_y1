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