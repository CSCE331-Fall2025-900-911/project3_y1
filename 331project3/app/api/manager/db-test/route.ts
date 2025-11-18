import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const pool = getDbPool();
        const client = await pool.connect();

        const result = await client.query('SELECT NOW() AS current_time');
        const dbTime = result.rows[0].current_time;

        return NextResponse.json({
            message: 'Database connection successful',
            currentTime: dbTime,
            status: 200
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
        return NextResponse.json({
            message: 'Database connection failed',
            error: (error as Error).message,
            status: 500
        });
    } 
};

