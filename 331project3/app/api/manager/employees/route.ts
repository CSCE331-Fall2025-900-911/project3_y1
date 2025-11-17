import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET(request: Request) {
    let client;
    try {
        const pool = getDbPool();
        client = await pool.connect();

        const query = 'SELECT employee_id, first_name, last_name, username, password FROM employees';
        const result = await client.query(query);

        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error('Database query error:', error);

        //return error if error ):
        return NextResponse.json({
            message: 'Failed to fetch employees.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) client.release();
    }
};

export async function POST(request: Request) {
    let client;
    try {
        const { first_name, last_name, username, password } = await request.json();

        if (!first_name || !last_name || !username || !password) {
            return NextResponse.json({
                message: 'Missing required fields.',
            }, { status: 400 });
        }

        const pool = getDbPool();
        client = await pool.connect();

        const query = `INSERT INTO employees (first_name, last_name, username, password)
            VALUES ($1, $2, $3, $4)
            RETURNING employee_id, first_name, last_name, username`;

        const result = await client.query(query, [first_name, last_name, username, password]);

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
