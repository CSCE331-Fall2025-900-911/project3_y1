import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { PoolClient } from 'pg';

export async function GET(request: Request) {
    let client: PoolClient | undefined;
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');

        if (!date) {
            return NextResponse.json({ message: 'Missing date parameter' }, { status: 400 });
        }

        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(0, 0, 0, 0);

        const pool = getDbPool();
        client = await pool.connect();

        const query = `
            SELECT EXTRACT(HOUR FROM order_timestamp) AS hr,
                   SUM(total_amount) AS total
            FROM orders
            WHERE order_timestamp >= $1 AND order_timestamp < $2
            GROUP BY hr
            ORDER BY hr;
        `;

        const result = await client.query(query, [startDate, endDate]);

        //map all hours 0-23
        const hourlyTotals = new Map<number, number>();
        for (let h = 0; h < 24; h++) {
            hourlyTotals.set(h, 0.0);
        }

        //populate map with query
        result.rows.forEach(row => {
            hourlyTotals.set(Number(row.hr), parseFloat(row.total));
        });

        //convert to array of objs
        const reportData = Array.from(hourlyTotals.entries()).map(([hour, sales_totals]) => ({
            hour,
            sales_totals
        }));

        return NextResponse.json(reportData, { status: 200 });

    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({
            message: 'Failed to fetch X-Report.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}