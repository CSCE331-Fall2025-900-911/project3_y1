import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { PoolClient } from 'pg';

interface Params {
    params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
    let client: PoolClient | undefined;
    try {
        const { id } = await params;
        const { field, value } : { field: string, value: string } = await request.json();

        const validFields = ['first_name' , 'last_name', 'username', 'password'];
        if (!validFields.includes(field)) {
            return NextResponse.json({ message: 'Invalid field for update' }, { status: 400 });
        }

        const pool = getDbPool();
        client = await pool.connect();
        
        const query = `
            UPDATE employees
            SET ${field} = $1
            WHERE employee_id = $2
            RETURNING *
        `;
        
        const result = await client.query(query, [value, id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
        }
        
        return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
        console.error('Database PUT error:', error);
        return NextResponse.json({
            message: 'Failed to update employee.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function DELETE(request: Request, { params }: Params) {
    let client: PoolClient | undefined;
    try {
        const { id } = await params;
        const pool = getDbPool();
        client = await pool.connect();
        
        const query = 'DELETE FROM employees WHERE employee_id = $1 RETURNING *';
        const result = await client.query(query, [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Database DELETE error:', error);
        return NextResponse.json({
            message: 'Failed to delete employee.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}