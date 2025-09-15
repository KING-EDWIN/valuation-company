import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../lib/database';
import { NotificationService } from '../../../lib/notificationService';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT ja.*,
             j.client_name,
             j.asset_type,
             j.asset_details,
             admin.name as admin_name,
             field.name as field_worker_name,
             qa.name as qa_name,
             md.name as md_name
      FROM job_assignments ja
      LEFT JOIN jobs j ON ja.job_id = j.id
      LEFT JOIN users admin ON ja.admin_id = admin.id
      LEFT JOIN users field ON ja.field_worker_id = field.id
      LEFT JOIN users qa ON ja.qa_id = qa.id
      LEFT JOIN users md ON ja.md_id = md.id
      ORDER BY ja.created_at DESC
    `);

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching job assignments:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch job assignments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { job_id, field_worker_id, qa_id, md_id } = await request.json();

    // Get current user (admin) - in a real app, this would come from auth
    const adminId = 1; // For now, hardcode admin ID

    // Create assignment
    const result = await pool.query(`
      INSERT INTO job_assignments (job_id, admin_id, field_worker_id, qa_id, md_id, current_stage, admin_completed_at)
      VALUES ($1, $2, $3, $4, $5, 'field', CURRENT_TIMESTAMP)
      RETURNING *
    `, [job_id, adminId, field_worker_id, qa_id, md_id]);

    const assignment = result.rows[0];

    // Ensure the base job reflects field status so it shows up for field users
    await pool.query(`
      UPDATE jobs
      SET status = 'pending fieldwork', updated_at = NOW()
      WHERE id = $1
    `, [job_id]);

    // Fetch some job info for notification context
    const jobInfo = await pool.query(
      'SELECT client_name FROM jobs WHERE id = $1',
      [job_id]
    );
    const clientName = jobInfo.rows?.[0]?.client_name || 'Client';

    // Notify assigned field worker
    try {
      await NotificationService.createNotification({
        user_id: field_worker_id,
        from_user_id: adminId,
        title: 'New Job Assigned',
        message: `You have been assigned a job: ${clientName}. Open your dashboard to begin field work.`,
        type: 'info',
        category: 'job',
        priority: 'normal',
        action_url: '/field-dashboard',
        metadata: { job_id }
      });
    } catch (e) {
      // Log but do not fail the request if notification fails
      console.error('Failed to create assignment notification:', e);
    }

    return NextResponse.json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error creating job assignment:', error);
    return NextResponse.json({ success: false, error: 'Failed to create job assignment' }, { status: 500 });
  }
}
