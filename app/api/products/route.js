import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// GET /api/products -> list all products
export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.description, p.price, p.category_id,
              c.name AS category_name, p.created_at
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ORDER BY p.id DESC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/products -> create a new product
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price } = body;
    const categoryId = body.category_id || null;

    if (!name || price === undefined || price === '') {
      return NextResponse.json(
        { error: 'Field "name" and "price" wajib diisi' },
        { status: 400 }
      );
    }

    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, category_id) VALUES (?, ?, ?, ?)',
      [name, description || null, price, categoryId]
    );

    return NextResponse.json(
      { id: result.insertId, name, description, price, category_id: categoryId },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
