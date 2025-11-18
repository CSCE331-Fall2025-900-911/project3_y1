import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { PoolClient } from 'pg';

export async function GET(request: Request) {
    let client: PoolClient | undefined;
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('start');
        const endDate = searchParams.get('end');

        if (!startDate || !endDate) {
            return NextResponse.json({ message: 'Missing start or end date' }, { status: 400 });
        }
        
        // date objects for start and end
        const endMoment = new Date(endDate);
        endMoment.setDate(endMoment.getDate() + 1);
        const endTimestamp = endMoment.toISOString().split('T')[0];

        const pool = getDbPool();
        client = await pool.connect();

        const query = `
            SELECT i.ingredient_name, i.unit, SUM(ing.quant_used * mis.ingredient_multiplier) AS total_used_quantity
            FROM orders o
            JOIN orderitems oi ON o.order_id = oi.order_id
            JOIN menuitemsizes mis ON oi.size_id = mis.size_id
            JOIN ingredients ing ON mis.menu_item_id = ing.menu_item_id
            JOIN iteminventory i ON ing.ingredient_id = i.ingredient_id
            WHERE o.order_timestamp >= $1 AND o.order_timestamp < $2
            GROUP BY i.ingredient_name, i.unit
            ORDER BY total_used_quantity DESC;
        `;
        
        const result = await client.query(query, [startDate, endTimestamp]);
        return NextResponse.json(result.rows, { status: 200 });

    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({
            message: 'Failed to fetch usage report.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}
