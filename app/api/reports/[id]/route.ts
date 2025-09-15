import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = process.env.POSTGRES_URL ? new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
}) : null;

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
      SELECT r.*, 
             j.client_name, 
             j.status as job_status,
             u1.name as created_by_name,
             u2.name as assigned_to_name
      FROM reports r
      LEFT JOIN jobs j ON r.job_id = j.id
      LEFT JOIN users u1 ON r.created_by = u1.id
      LEFT JOIN users u2 ON r.assigned_to = u2.id
      WHERE r.id = $1
    `, [reportId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Get progress for each role
    const progressResult = await pool.query(`
      SELECT rp.*, u.name as user_name
      FROM report_progress rp
      LEFT JOIN users u ON rp.user_id = u.id
      WHERE rp.report_id = $1
      ORDER BY rp.role
    `, [reportId]);

    const report = result.rows[0];
    report.progress = progressResult.rows;

    return NextResponse.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const {
      status,
      admin_data,
      field_data,
      qa_data,
      final_data,
      assigned_to
    } = body;

    const updateFields = [];
    const values = [];
    let paramCount = 0;

    if (status !== undefined) {
      paramCount++;
      updateFields.push(`status = $${paramCount}`);
      values.push(status);
    }

    if (admin_data !== undefined) {
      paramCount++;
      updateFields.push(`admin_data = $${paramCount}`);
      values.push(JSON.stringify(admin_data));
    }

    if (field_data !== undefined) {
      paramCount++;
      updateFields.push(`field_data = $${paramCount}`);
      values.push(JSON.stringify(field_data));
    }

    if (qa_data !== undefined) {
      paramCount++;
      updateFields.push(`qa_data = $${paramCount}`);
      values.push(JSON.stringify(qa_data));
    }

    if (final_data !== undefined) {
      paramCount++;
      updateFields.push(`final_data = $${paramCount}`);
      values.push(JSON.stringify(final_data));
    }

    if (assigned_to !== undefined) {
      paramCount++;
      updateFields.push(`assigned_to = $${paramCount}`);
      values.push(assigned_to);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    paramCount++;
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(reportId);

    const result = await pool.query(`
      UPDATE reports 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update report' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await pool.query('DELETE FROM reports WHERE id = $1', [reportId]);

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}


