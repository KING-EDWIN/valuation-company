import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// GET /api/users - Fetch all users
export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(`
      SELECT id, name, email, role, phone, department, approved, approved_by, approved_at, created_at, updated_at
      FROM users 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      success: true,
      users: result.rows
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}


