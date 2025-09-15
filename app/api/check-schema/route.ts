import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    // Check if reports table exists and get its structure
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'reports'
      ORDER BY ordinal_position
    `);

    return NextResponse.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error checking schema:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check schema', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


