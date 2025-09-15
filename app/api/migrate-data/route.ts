import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Sample data to migrate
const sampleJobs = [
  {
    clientName: 'ABC Bank Limited',
    clientInfo: {
      clientType: 'Financial Institution',
      contactNumber: '+256 700 123 456',
      email: 'loans@abcbank.ug',
      address: 'Plot 123, Kampala Road, Kampala'
    },
    assetType: 'Commercial Property',
    assetDetails: {
      location: 'Nakasero, Kampala',
      size: '2,500 sqm',
      propertyUse: 'Office Building',
      previousWorkHistory: ['Valuation 2022', 'Inspection 2021'],
      neighborhood: ['Nakasero', 'Kololo', 'Old Kampala']
    },
    valuationRequirements: {
      purpose: 'Mortgage Security',
      value: 850000000,
      currency: 'UGX',
      deadline: '2024-02-15'
    },
    bankInfo: {
      bankName: 'ABC Bank',
      branch: 'Kampala Main',
      contactPerson: 'John Muwonge',
      contactNumber: '+256 700 123 456'
    },
    status: 'pending QA',
    qaChecklist: {
      completed: false,
      items: ['Field Report Review', 'Document Verification', 'Value Assessment'],
      notes: 'Field inspection completed, awaiting QA review'
    },
    fieldReportData: {
      inspectionDate: '2024-01-20',
      siteConditions: 'Excellent - Well maintained commercial building with modern amenities',
      measurements: 'Length: 50m, Width: 50m, Height: 15m',
      photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
      notes: 'Property in prime location with high rental yields. Building condition is excellent with modern finishes.',
      documents: {
        orthophoto: 'orthophoto_job1.pdf',
        topographic: 'topographic_job1.pdf',
        areaSchedule: 'area_schedule_job1.pdf',
        titleSearch: 'title_search_job1.pdf',
        occupancyPermit: 'occupancy_permit_job1.pdf',
        additionalDocs: ['site_plan_job1.pdf', 'structural_report_job1.pdf']
      }
    },
    adminReviewed: true,
    adminReviewDate: '2024-01-21T09:00:00Z',
    adminReviewNotes: 'Field report comprehensive and well documented. Ready for QA review.',
    chain: {
      surveyor: 'John Smith',
      qa: 'Sarah Johnson'
    }
  },
  {
    clientName: 'XYZ Development Company',
    clientInfo: {
      clientType: 'Private Company',
      contactNumber: '+256 700 234 567',
      email: 'info@xyzdev.ug',
      address: 'Plot 456, Entebbe Road, Kampala'
    },
    assetType: 'Residential Property',
    assetDetails: {
      location: 'Kololo, Kampala',
      size: '1,200 sqm',
      propertyUse: 'Residential Villa',
      previousWorkHistory: ['Site Survey 2023'],
      neighborhood: ['Kololo', 'Nakasero', 'Old Kampala']
    },
    valuationRequirements: {
      purpose: 'Insurance Assessment',
      value: 450000000,
      currency: 'UGX',
      deadline: '2024-02-20'
    },
    bankInfo: {
      bankName: 'XYZ Bank',
      branch: 'Kololo Branch',
      contactPerson: 'Sarah Nalukenge',
      contactNumber: '+256 700 234 567'
    },
    status: 'pending fieldwork',
    qaChecklist: {
      completed: false,
      items: ['Site Inspection', 'Document Collection', 'Initial Assessment'],
      notes: 'New assignment, awaiting field team inspection'
    },
    chain: {
      surveyor: 'John Smith'
    }
  },
  {
    clientName: 'DEF Microfinance',
    clientInfo: {
      clientType: 'Microfinance Institution',
      contactNumber: '+256 700 345 678',
      email: 'loans@defmicro.ug',
      address: 'Plot 789, Jinja Road, Kampala'
    },
    assetType: 'Vacant Land',
    assetDetails: {
      location: 'Ntinda, Kampala',
      size: '5,000 sqm',
      propertyUse: 'Development Land',
      previousWorkHistory: ['Boundary Survey 2022'],
      neighborhood: ['Ntinda', 'Kisaasi', 'Bukoto']
    },
    valuationRequirements: {
      purpose: 'Loan Security',
      value: 120000000,
      currency: 'UGX',
      deadline: '2024-02-25'
    },
    bankInfo: {
      bankName: 'DEF Bank',
      branch: 'Ntinda Branch',
      contactPerson: 'Michael Kato',
      contactNumber: '+256 700 345 678'
    },
    status: 'pending MD approval',
    qaChecklist: {
      completed: true,
      items: ['Field Report Review', 'Document Verification', 'Value Assessment', 'QA Approval'],
      notes: 'QA review completed, awaiting MD final approval'
    },
    fieldReportData: {
      inspectionDate: '2024-01-18',
      siteConditions: 'Good - Flat land suitable for development, good road access',
      measurements: 'Length: 100m, Width: 50m',
      photos: ['photo1.jpg', 'photo2.jpg'],
      notes: 'Prime development land with excellent road access. Suitable for residential or commercial development.',
      documents: {
        orthophoto: 'orthophoto_job3.pdf',
        topographic: 'topographic_job3.pdf',
        areaSchedule: 'area_schedule_job3.pdf',
        titleSearch: 'title_search_job3.pdf',
        occupancyPermit: 'N/A',
        additionalDocs: ['zoning_report_job3.pdf', 'soil_test_job3.pdf']
      }
    },
    adminReviewed: true,
    adminReviewDate: '2024-01-19T10:00:00Z',
    adminReviewNotes: 'Field report approved and forwarded to QA.',
    qaNotes: 'All documents verified. Valuation methodology sound. Recommended for approval.',
    chain: {
      surveyor: 'John Smith',
      qa: 'Sarah Johnson',
      md: 'Dr. Michael Brown'
    }
  },
  {
    clientName: 'GHI Savings Cooperative',
    clientInfo: {
      clientType: 'Cooperative Society',
      contactNumber: '+256 700 456 789',
      email: 'info@ghisavings.ug',
      address: 'Plot 321, Masaka Road, Kampala'
    },
    assetType: 'Institutional Property',
    assetDetails: {
      location: 'Makindye, Kampala',
      size: '3,000 sqm',
      propertyUse: 'School Building',
      previousWorkHistory: ['Maintenance Assessment 2023'],
      neighborhood: ['Makindye', 'Nsambya', 'Kabalagala']
    },
    valuationRequirements: {
      purpose: 'Asset Valuation',
      value: 650000000,
      currency: 'UGX',
      deadline: '2024-03-01'
    },
    bankInfo: {
      bankName: 'GHI Bank',
      branch: 'Makindye Branch',
      contactPerson: 'Grace Namukasa',
      contactNumber: '+256 700 456 789'
    },
    status: 'pending fieldwork',
    qaChecklist: {
      completed: false,
      items: ['Site Inspection', 'Document Collection', 'Initial Assessment'],
      notes: 'New assignment, awaiting field team inspection'
    },
    chain: {
      surveyor: 'John Smith'
    }
  },
  {
    clientName: 'JKL Investment Group',
    clientInfo: {
      clientType: 'Investment Company',
      contactNumber: '+256 700 567 890',
      email: 'investments@jklgroup.ug',
      address: 'Plot 654, Mbarara Road, Kampala'
    },
    assetType: 'Commercial Property',
    assetDetails: {
      location: 'Industrial Area, Kampala',
      size: '8,000 sqm',
      propertyUse: 'Warehouse Complex',
      previousWorkHistory: ['Rental Assessment 2023', 'Structural Survey 2022'],
      neighborhood: ['Industrial Area', 'Nakawa', 'Luzira']
    },
    valuationRequirements: {
      purpose: 'Investment Analysis',
      value: 1200000000,
      currency: 'UGX',
      deadline: '2024-03-05'
    },
    bankInfo: {
      bankName: 'JKL Bank',
      branch: 'Industrial Branch',
      contactPerson: 'David Ssemwogerere',
      contactNumber: '+256 700 567 890'
    },
    status: 'pending fieldwork',
    qaChecklist: {
      completed: false,
      items: ['Site Inspection', 'Document Collection', 'Initial Assessment'],
      notes: 'New assignment, awaiting field team inspection'
    },
    chain: {
      surveyor: 'John Smith'
    }
  },
  {
    clientName: 'MNO Real Estate',
    clientInfo: {
      clientType: 'Real Estate Company',
      contactNumber: '+256 700 678 901',
      email: 'sales@mnoreal.ug',
      address: 'Plot 987, Hoima Road, Kampala'
    },
    assetType: 'Residential Property',
    assetDetails: {
      location: 'Bukoto, Kampala',
      size: '2,500 sqm',
      propertyUse: 'Apartment Complex',
      previousWorkHistory: ['Construction Monitoring 2023'],
      neighborhood: ['Bukoto', 'Ntinda', 'Kisaasi']
    },
    valuationRequirements: {
      purpose: 'Market Valuation',
      value: 850000000,
      currency: 'UGX',
      deadline: '2024-03-10'
    },
    bankInfo: {
      bankName: 'MNO Bank',
      branch: 'Bukoto Branch',
      contactPerson: 'Patience Nalubega',
      contactNumber: '+256 700 678 901'
    },
    status: 'complete',
    qaChecklist: {
      completed: true,
      items: ['Field Report Review', 'Document Verification', 'Value Assessment', 'QA Approval', 'MD Approval'],
      notes: 'Project completed successfully'
    },
    fieldReportData: {
      inspectionDate: '2024-01-15',
      siteConditions: 'Excellent - Newly constructed apartment complex with modern amenities',
      measurements: 'Length: 80m, Width: 31.25m, Height: 25m',
      photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg'],
      notes: 'High-quality residential development with excellent rental potential. Construction quality is superior.',
      documents: {
        orthophoto: 'orthophoto_job6.pdf',
        topographic: 'topographic_job6.pdf',
        areaSchedule: 'area_schedule_job6.pdf',
        titleSearch: 'title_search_job6.pdf',
        occupancyPermit: 'occupancy_permit_job6.pdf',
        additionalDocs: ['construction_certificate_job6.pdf', 'architectural_plans_job6.pdf', 'final_inspection_job6.pdf']
      }
    },
    adminReviewed: true,
    adminReviewDate: '2024-01-16T09:00:00Z',
    adminReviewNotes: 'Field report comprehensive and well documented. Ready for QA review.',
    qaNotes: 'All documents verified. Valuation methodology sound. Recommended for approval.',
    mdApproval: true,
    paymentReceived: true,
    chain: {
      surveyor: 'John Smith',
      qa: 'Sarah Johnson',
      md: 'Dr. Michael Brown',
      accounts: 'Lisa Wilson'
    }
  }
];

// POST /api/migrate-data - Migrate sample data to database
export async function POST(request: NextRequest) {
  try {
    // Clear existing data
    await pool.query('DELETE FROM jobs');
    
    // Insert sample data
    for (const job of sampleJobs) {
      await pool.query(`
        INSERT INTO jobs (
          client_name, client_info, asset_type, asset_details, 
          valuation_requirements, bank_info, status, qa_checklist, 
          field_report_data, admin_reviewed, admin_review_date, 
          admin_review_notes, qa_notes, md_approval, payment_received, chain
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `, [
        job.clientName,
        JSON.stringify(job.clientInfo),
        job.assetType,
        JSON.stringify(job.assetDetails),
        JSON.stringify(job.valuationRequirements),
        JSON.stringify(job.bankInfo),
        job.status,
        JSON.stringify(job.qaChecklist),
        JSON.stringify(job.fieldReportData || {}),
        job.adminReviewed || false,
        job.adminReviewDate || null,
        job.adminReviewNotes || null,
        job.qaNotes || null,
        job.mdApproval || null,
        job.paymentReceived || false,
        JSON.stringify(job.chain)
      ]);
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${sampleJobs.length} jobs to database`,
      count: sampleJobs.length
    });
    
  } catch (error) {
    console.error('Error migrating data:', error);
    return NextResponse.json(
      { error: 'Failed to migrate data' },
      { status: 500 }
    );
  }
}
