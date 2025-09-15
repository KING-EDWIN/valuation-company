import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = process.env.POSTGRES_URL ? new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
}) : null;

// Mock data for local development
const mockJobs = [
  {
    id: 1,
    client_name: "ABC Bank Uganda",
    client_info: {
      name: "ABC Bank Uganda",
      email: "loans@abcbank.ug",
      phone: "+256 414 123 456",
      address: "Kampala Road, Kampala"
    },
    asset_type: "Commercial Property",
    asset_details: {
      property_type: "Office Building",
      location: "Kampala Central",
      size: "5000 sq ft"
    },
    valuation_requirements: {
      purpose: "Loan Security",
      value_range: "UGX 2B - 3B"
    },
    bank_info: {
      bankName: "ABC Bank Uganda",
      loan_officer: "John Mukisa",
      loan_amount: "UGX 2.5B"
    },
    status: "pending fieldwork",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    client_name: "XYZ Properties Ltd",
    client_info: {
      name: "XYZ Properties Ltd",
      email: "info@xyzproperties.ug",
      phone: "+256 414 789 012",
      address: "Nakawa Industrial Area"
    },
    asset_type: "Industrial Property",
    asset_details: {
      property_type: "Warehouse",
      location: "Nakawa",
      size: "10000 sq ft"
    },
    valuation_requirements: {
      purpose: "Insurance Valuation",
      value_range: "UGX 1B - 1.5B"
    },
    bank_info: {
      bankName: "Standard Chartered",
      loan_officer: "Sarah Nalukenge",
      loan_amount: "UGX 1.2B"
    },
    status: "fieldwork completed",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

// GET /api/jobs - Fetch all jobs
export async function GET(request: NextRequest) {
  try {
    // If no database connection, return mock data
    if (!pool) {
      const { searchParams } = new URL(request.url);
      const status = searchParams.get('status');
      const bankName = searchParams.get('bankName');
      
      let filteredJobs = mockJobs;
      
      if (status) {
        filteredJobs = mockJobs.filter(job => job.status === status);
      }
      
      if (bankName) {
        filteredJobs = mockJobs.filter(job => job.bank_info.bankName === bankName);
      }
      
      return NextResponse.json({
        success: true,
        data: filteredJobs
      });
    }
    
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