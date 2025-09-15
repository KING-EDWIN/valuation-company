import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting reports table migration...');

    // Drop the existing reports table and recreate it with the correct schema
    await pool.query('DROP TABLE IF EXISTS reports CASCADE');
    console.log('Dropped existing reports table');

    // Create the new reports table with the correct schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        report_type VARCHAR(100) NOT NULL,
        report_title VARCHAR(255) NOT NULL,
        report_reference_number VARCHAR(100) UNIQUE,
        status VARCHAR(50) DEFAULT 'draft',
        admin_data JSONB,
        field_data JSONB,
        qa_data JSONB,
        final_data JSONB,
        generated_pdf_path VARCHAR(500),
        created_by INTEGER REFERENCES users(id),
        assigned_to INTEGER REFERENCES users(id),
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created new reports table');

    // Recreate the report_progress table
    await pool.query('DROP TABLE IF EXISTS report_progress CASCADE');
    console.log('Dropped existing report_progress table');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS report_progress (
        id SERIAL PRIMARY KEY,
        report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL,
        user_id INTEGER REFERENCES users(id),
        completed BOOLEAN DEFAULT FALSE,
        data JSONB,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created new report_progress table');

    return NextResponse.json({
      success: true,
      message: 'Reports table migration completed successfully'
    });

  } catch (error) {
    console.error('Error migrating reports table:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to migrate reports table',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


