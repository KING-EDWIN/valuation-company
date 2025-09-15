import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    const { job_id, current_stage } = await request.json();

    if (!job_id || !current_stage) {
      return NextResponse.json({ 
        success: false, 
        error: 'Job ID and current stage are required' 
      }, { status: 400 });
    }

    // Get the current assignment
    const assignmentResult = await pool.query(
      'SELECT * FROM job_assignments WHERE job_id = $1',
      [job_id]
    );

    if (assignmentResult.rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Job assignment not found' 
      }, { status: 404 });
    }

    const assignment = assignmentResult.rows[0];

    // Determine next stage and update accordingly
    let nextStage = '';
    let updateQuery = '';
    let updateValues: any[] = [];

    switch (current_stage) {
      case 'field':
        nextStage = 'qa';
        updateQuery = `
          UPDATE job_assignments 
          SET current_stage = $1, field_completed_at = NOW(), qa_id = (
            SELECT id FROM users WHERE role IN ('qa', 'qa_officer') LIMIT 1
          )
          WHERE job_id = $2
        `;
        updateValues = [nextStage, job_id];
        break;

      case 'qa':
        nextStage = 'md';
        updateQuery = `
          UPDATE job_assignments 
          SET current_stage = $1, qa_completed_at = NOW(), md_id = (
            SELECT id FROM users WHERE role = 'md' LIMIT 1
          )
          WHERE job_id = $2
        `;
        updateValues = [nextStage, job_id];
        break;

      case 'md':
        nextStage = 'complete';
        updateQuery = `
          UPDATE job_assignments 
          SET current_stage = $1, md_completed_at = NOW()
          WHERE job_id = $2
        `;
        updateValues = [nextStage, job_id];
        break;

      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid current stage' 
        }, { status: 400 });
    }

    // Update the assignment
    await pool.query(updateQuery, updateValues);

    // Update the job status in the jobs table
    const jobStatusMap: { [key: string]: string } = {
      'qa': 'pending QA',
      'md': 'pending MD review',
      'complete': 'completed'
    };

    const jobStatus = jobStatusMap[nextStage];
    if (jobStatus) {
      await pool.query(
        'UPDATE jobs SET status = $1 WHERE id = $2',
        [jobStatus, job_id]
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Work submitted to ${nextStage} successfully`,
      next_stage: nextStage
    });

  } catch (error) {
    console.error('Error submitting work to next stage:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit work to next stage' 
    }, { status: 500 });
  }
}


