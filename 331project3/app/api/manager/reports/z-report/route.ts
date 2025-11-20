import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { PoolClient } from 'pg';

//check if z-report has been run
async function isZReportRun(client: PoolClient, date: string): Promise<boolean> {
    const query = "SELECT 1 FROM zreporthistory WHERE report_date = $1";
    const result = await client.query(query, [date]);
    return (result.rowCount ?? 0) > 0;
}

// add zreport being run to the table
async function logZReportRun(client: PoolClient, date: string): Promise<void> {
    const query = "INSERT INTO zreporthistory (report_date) VALUES ($1)";
    await client.query(query, [date]);
}

export async function POST(request: Request) {
    let client: PoolClient | undefined;
    try {
        const { date } = await request.json();
        if (!date) {
            return NextResponse.json({ message: 'Missing date in request body' }, { status: 400 });
        }

        const pool = getDbPool();
        client = await pool.connect();
        
        await client.query('BEGIN');

        //check if already run
        if (await isZReportRun(client, date)) {
            await client.query('ROLLBACK');
            return NextResponse.json({ status: 'ALREADY_RUN' }, { status: 200 });
        }

        
        //total sales
        const salesRes = await client.query(
            "SELECT COALESCE(SUM(total_amount), 0) AS total_sales FROM orders WHERE DATE(order_timestamp) = $1",
            [date]
        );
        const totalSales = parseFloat(salesRes.rows[0].total_sales);

        //total sold items
        const itemsRes = await client.query(
            "SELECT COUNT(*) AS total_items FROM orderitems oi JOIN orders o ON oi.order_id = o.order_id WHERE DATE(o.order_timestamp) = $1",
            [date]
        );
        const totalItemsSold = parseInt(itemsRes.rows[0].total_items, 10);

        //sales by category
        const categoryRes = await client.query(
            `SELECT mi.item_category, SUM(oi.price_at_sale) AS total
             FROM orderitems oi
             JOIN orders o ON oi.order_id = o.order_id
             JOIN menuitemsizes mis ON oi.size_id = mis.size_id
             JOIN menuitems mi ON mis.menu_item_id = mi.item_id
             WHERE DATE(o.order_timestamp) = $1
             GROUP BY mi.item_category`,
            [date]
        );
        const salesByCategory: { [key: string]: number } = {};
        categoryRes.rows.forEach(row => {
            salesByCategory[row.item_category] = parseFloat(row.total);
        });

        //ingredient usagfe
        const usageRes = await client.query(
            `SELECT ii.ingredient_name, ii.unit, SUM(ing.quant_used * mis.ingredient_multiplier) AS total_used
             FROM orderitems oi
             JOIN orders o ON oi.order_id = o.order_id
             JOIN menuitemsizes mis ON oi.size_id = mis.size_id
             JOIN ingredients ing ON mis.menu_item_id = ing.menu_item_id
             JOIN itemInventory ii ON ing.ingredient_id = ii.ingredient_id
             WHERE DATE(o.order_timestamp) = $1
             GROUP BY ii.ingredient_name, ii.unit
             ORDER BY ii.ingredient_name`,
            [date]
        );
        const ingredientUsage: { [key: string]: number } = {};
        usageRes.rows.forEach(row => {
            ingredientUsage[`${row.ingredient_name} (${row.unit})`] = parseFloat(row.total_used);
        });

        //log that it was run
        if (totalSales > 0 || totalItemsSold > 0) {
            await logZReportRun(client, date);
        }
        
        //commit the transaction
        await client.query('COMMIT');

        return NextResponse.json({
            status: 'SUCCESS',
            totalSales,
            totalItemsSold,
            salesByCategory,
            ingredientUsage
        }, { status: 201 });

    } catch (error) {
        //if there were errors with any request rollback
        if (client) {
            await client.query('ROLLBACK');
        }
        console.error('Database query error:', error);
        return NextResponse.json({
            status: 'ERROR',
            message: 'Failed to generate Z-Report.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function DELETE(request: Request) {
    let client: PoolClient | undefined;
    try {
        const pool = getDbPool();
        client = await pool.connect();
        
        await client.query('DELETE FROM zreporthistory');
        
        return NextResponse.json({ message: 'Z-Report history cleared successfully.' }, { status: 200 });

    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({
            message: 'Failed to clear Z-Report history.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}