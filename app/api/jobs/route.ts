import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// GET /api/jobs - Fetch all jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const bankName = searchParams.get('bankName');
    
    let query = 'SELECT * FROM jobs ORDER BY created_at DESC';
    const params: any[] = [];
    
    if (status) {
      query = 'SELECT * FROM jobs WHERE status = $1 ORDER BY created_at DESC';
      params.push(status);
    }
    
    if (bankName) {
      query = 'SELECT * FROM jobs WHERE bank_info->>\'bankName\' = $1 ORDER BY created_at DESC';
      params.push(bankName);
    }
    
    const result = await pool.query(query, params);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json();
    
    const {
      clientName,
      clientInfo,
      assetType,
      assetDetails,
      valuationRequirements,
      bankInfo,
      status = 'pending fieldwork',
      qaChecklist = {},
      chain = {}
    } = jobData;
    
    const result = await pool.query(`
      INSERT INTO jobs (
        client_name, client_info, asset_type, asset_details, 
        valuation_requirements, bank_info, status, qa_checklist, chain
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      clientName,
      JSON.stringify(clientInfo),
      assetType,
      JSON.stringify(assetDetails),
      JSON.stringify(valuationRequirements),
      JSON.stringify(bankInfo),
      status,
      JSON.stringify(qaChecklist),
      JSON.stringify(chain)
    ]);
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}