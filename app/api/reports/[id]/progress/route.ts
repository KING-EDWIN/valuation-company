import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = process.env.POSTGRES_URL ? new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
}) : null;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!pool) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const reportId = parseInt(params.id);
    const body = await request.json();
    const { role, user_id, data, completed } = body;

    // Check if progress entry exists
    const existingResult = await pool.query(`
      SELECT id FROM report_progress 
      WHERE report_id = $1 AND role = $2
    `, [reportId, role]);

    let result;
    if (existingResult.rows.length > 0) {
      // Update existing progress
      result = await pool.query(`
        UPDATE report_progress 
        SET user_id = $1, data = $2, completed = $3, 
            completed_at = CASE WHEN $3 = true THEN CURRENT_TIMESTAMP ELSE completed_at END,
            updated_at = CURRENT_TIMESTAMP
        WHERE report_id = $4 AND role = $5
        RETURNING *
      `, [user_id, JSON.stringify(data), completed, reportId, role]);
    } else {
      // Create new progress entry
      result = await pool.query(`
        INSERT INTO report_progress (report_id, role, user_id, data, completed, completed_at)
        VALUES ($1, $2, $3, $4, $5, CASE WHEN $5 = true THEN CURRENT_TIMESTAMP ELSE NULL END)
        RETURNING *
      `, [reportId, role, user_id, JSON.stringify(data), completed]);
    }

    // Update the main report data based on role
    const updateFields = [];
    const values = [];
    let paramCount = 0;

    if (role === 'admin' && data) {
      paramCount++;
      updateFields.push(`admin_data = $${paramCount}`);
      values.push(JSON.stringify(data));
    } else if (role === 'field' && data) {
      paramCount++;
      updateFields.push(`field_data = $${paramCount}`);
      values.push(JSON.stringify(data));
    } else if (role === 'qa' && data) {
      paramCount++;
      updateFields.push(`qa_data = $${paramCount}`);
      values.push(JSON.stringify(data));
    }

    if (updateFields.length > 0) {
      paramCount++;
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(reportId);

      await pool.query(`
        UPDATE reports 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
      `, values);
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating report progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update report progress' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!pool) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const reportId = parseInt(params.id);

    const result = await pool.query(`
      SELECT rp.*, u.name as user_name
      FROM report_progress rp
      LEFT JOIN users u ON rp.user_id = u.id
      WHERE rp.report_id = $1
      ORDER BY rp.role
    `, [reportId]);

    return NextResponse.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching report progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch report progress' },
      { status: 500 }
    );
  }
}


