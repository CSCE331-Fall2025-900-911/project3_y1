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

        const endMoment = new Date(endDate);
        endMoment.setDate(endMoment.getDate() + 1);
        const endTimestamp = endMoment.toISOString().split('T')[0];

        const pool = getDbPool();
        client = await pool.connect();
        
        const query = `
            SELECT mi.item_name,
                   COUNT(oi.order_item_id) AS total_quantity,
                   SUM(oi.price_at_sale) AS total_revenue
            FROM orderitems oi
            JOIN menuitemsizes mis ON oi.size_id = mis.size_id
            JOIN menuitems mi ON mis.menu_item_id = mi.item_id
            JOIN orders o ON oi.order_id = o.order_id
            WHERE o.order_timestamp >= $1 AND o.order_timestamp < $2
            GROUP BY mi.item_name
            ORDER BY total_revenue DESC;
        `;

        const result = await client.query(query, [startDate, endTimestamp]);
        return NextResponse.json(result.rows, { status: 200 });

    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({
            message: 'Failed to fetch sales report.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}