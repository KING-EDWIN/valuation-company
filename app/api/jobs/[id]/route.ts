import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
// import { NotificationService } from '../../../lib/notificationService';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// GET /api/jobs/[id] - Fetch a specific job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(
      'SELECT * FROM jobs WHERE id = $1',
      [params.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// PUT /api/jobs/[id] - Update a specific job
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updateData = await request.json();
    
    // Get current job status for comparison
    const currentJob = await pool.query(
      'SELECT status FROM jobs WHERE id = $1',
      [params.id]
    );

    if (currentJob.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const oldStatus = currentJob.rows[0].status;
    
    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    // Handle JSONB fields
    const jsonbFields = ['client_info', 'asset_details', 'valuation_requirements', 'bank_info', 'qa_checklist', 'field_report_data', 'chain'];
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (jsonbFields.includes(key)) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(JSON.stringify(value));
      } else {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(value);
      }
      paramCount++;
    });
    
    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }
    
    // Add updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add the id parameter
    values.push(params.id);
    
    const query = `
      UPDATE jobs 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const updatedJob = result.rows[0];

    // Trigger notification if status changed
    if (updateData.status && updateData.status !== oldStatus) {
      try {
        await NotificationService.notifyJobStatusChange(
          parseInt(params.id),
          oldStatus,
          updateData.status,
          1 // Assuming admin user ID 1 for now
        );
      } catch (notificationError) {
        console.error('Error sending job status notification:', notificationError);
        // Don't fail the job update if notification fails
      }
    }
    
    return NextResponse.json({
      success: true,
      data: updatedJob
    });
    
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Delete a specific job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(
      'DELETE FROM jobs WHERE id = $1 RETURNING *',
      [params.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}