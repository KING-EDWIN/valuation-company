import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../lib/database';

export async function POST() {
  try {
    // Create job_assignments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_assignments (
        id SERIAL PRIMARY KEY,
        job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        admin_id INTEGER NOT NULL REFERENCES users(id),
        field_worker_id INTEGER REFERENCES users(id),
        qa_id INTEGER REFERENCES users(id),
        md_id INTEGER REFERENCES users(id),
        current_stage VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (current_stage IN ('admin', 'field', 'qa', 'md', 'complete')),
        admin_completed_at TIMESTAMP,
        field_completed_at TIMESTAMP,
        qa_completed_at TIMESTAMP,
        md_completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_job_assignments_job_id ON job_assignments(job_id)
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_job_assignments_current_stage ON job_assignments(current_stage)
    `);

    return NextResponse.json({ success: true, message: 'Job assignments table created successfully' });
  } catch (error) {
    console.error('Error creating job assignments table:', error);
    return NextResponse.json({ success: false, error: 'Failed to create job assignments table' }, { status: 500 });
  }
}


