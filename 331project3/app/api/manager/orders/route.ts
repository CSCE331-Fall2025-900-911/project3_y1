import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { PoolClient } from 'pg';
import { Order } from '@/app/types/manager'; 

export async function GET() {
    let client: PoolClient | undefined;
    try {
        const pool = getDbPool();
        client = await pool.connect();
        
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        
        //orders 'placed' within last day
        const query = `
            SELECT order_id, total_amount, order_timestamp, customer_email, order_status
            FROM orders
            WHERE order_status = 'PLACED' 
              AND order_timestamp >= $1
              AND customer_email IS NOT NULL
            ORDER BY order_timestamp ASC
        `;
        
        const result = await client.query(query, [twentyFourHoursAgo]);
        
        const orders: Order[] = result.rows.map(row => ({
            ...row,
            total_amount: parseFloat(row.total_amount),
            order_id: parseInt(row.order_id, 10),
            order_status: row.order_status || 'PLACED', 
        }));

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({
            message: 'Failed to fetch recent orders.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}