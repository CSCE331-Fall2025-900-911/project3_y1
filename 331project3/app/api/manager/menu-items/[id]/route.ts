import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { PoolClient } from 'pg';

interface Params {
    params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
    let client: PoolClient | undefined;
    try {
        const { id } = params;
        const { field, value } : { field: string, value: string } = await request.json();

        const validFields = ['item_name', 'item_category', 'item_price'];
        if (!validFields.includes(field)) {
            return NextResponse.json({ message: 'Invalid field for update' }, { status: 400 });
        }

        const pool = getDbPool();
        client = await pool.connect();
        
        const query = `
            UPDATE menuitems
            SET ${field} = $1
            WHERE item_id = $2
            RETURNING *
        `;
        
        const result = await client.query(query, [value, id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Item not found' }, { status: 404 });
        }
        
        return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
        console.error('Database PUT error:', error);
        return NextResponse.json({
            message: 'Failed to update menu item.',
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
        const { id } = params;
        const pool = getDbPool();
        client = await pool.connect();
        
        const query = 'DELETE FROM menuitems WHERE item_id = $1 RETURNING *';
        const result = await client.query(query, [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Item not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Database DELETE error:', error);
        return NextResponse.json({
            message: 'Failed to delete menu item.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}