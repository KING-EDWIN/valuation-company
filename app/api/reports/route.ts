import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('job_id');
    const reportType = searchParams.get('report_type');
    const status = searchParams.get('status');

    let query = `
      SELECT r.*, 
             j.client_name, 
             j.status as job_status,
             u1.name as created_by_name,
             u2.name as assigned_to_name
      FROM reports r
      LEFT JOIN jobs j ON r.job_id = j.id
      LEFT JOIN users u1 ON r.created_by = u1.id
      LEFT JOIN users u2 ON r.assigned_to = u2.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 0;

    if (jobId) {
      paramCount++;
      query += ` AND r.job_id = $${paramCount}`;
      params.push(parseInt(jobId));
    }

    if (reportType) {
      paramCount++;
      query += ` AND r.report_type = $${paramCount}`;
      params.push(reportType);
    }

    if (status) {
      paramCount++;
      query += ` AND r.status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      job_id,
      report_type,
      report_title,
      report_reference_number,
      created_by,
      assigned_to
    } = body;

    // Generate reference number if not provided
    const refNumber = report_reference_number || `REF-${Date.now()}`;

    const result = await pool.query(`
      INSERT INTO reports (
        job_id, 
        report_type, 
        report_title, 
        report_reference_number,
        created_by,
        assigned_to
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [job_id, report_type, report_title, refNumber, created_by, assigned_to]);

    const report = result.rows[0];

    // Create initial progress entries for each role
    const roles = ['admin', 'field', 'qa'];
    for (const role of roles) {
      await pool.query(`
        INSERT INTO report_progress (report_id, role, user_id, completed)
        VALUES ($1, $2, $3, $4)
      `, [report.id, role, null, false]);
    }

    return NextResponse.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create report' },
      { status: 500 }
    );
  }
}


