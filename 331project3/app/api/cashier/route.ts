import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM menuItems ORDER BY item_id ASC;');
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Database query failed:', err);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
