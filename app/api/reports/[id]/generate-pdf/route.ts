import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../../../lib/database';
import puppeteer from 'puppeteer';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reportId = parseInt(id);

    // Fetch report data
    const result = await pool.query(`
      SELECT r.*, 
             j.client_name,
             rt.admin_mandatory,
             rt.admin_optional,
             rt.field_mandatory,
             rt.field_optional,
             rt.static_data
      FROM reports r
      LEFT JOIN jobs j ON r.job_id = j.id
      LEFT JOIN report_templates rt ON r.report_type = rt.report_type
      WHERE r.id = $1
    `, [reportId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    const report = result.rows[0];

    // Generate HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${report.report_title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { border-bottom: 2px solid #1976d2; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; color: #1976d2; }
          .value { margin-left: 10px; }
          .footer { margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px; font-size: 12px; color: #666; }
          .json-data { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${report.report_title}</h1>
          <p><strong>Report Type:</strong> ${report.report_type}</p>
          <p><strong>Reference Number:</strong> ${report.report_reference_number}</p>
          <p><strong>Client:</strong> ${report.client_name || 'Unknown Client'}</p>
          <p><strong>Status:</strong> ${report.status}</p>
          <p><strong>Created:</strong> ${new Date(report.created_at).toLocaleDateString()}</p>
        </div>

        <div class="section">
          <h2>Report Details</h2>
          <div class="field">
            <span class="label">Report ID:</span>
            <span class="value">${report.id}</span>
          </div>
          <div class="field">
            <span class="label">Job ID:</span>
            <span class="value">${report.job_id}</span>
          </div>
          <div class="field">
            <span class="label">Created By:</span>
            <span class="value">${report.created_by_name || 'Unknown'}</span>
          </div>
          <div class="field">
            <span class="label">Assigned To:</span>
            <span class="value">${report.assigned_to_name || 'Unassigned'}</span>
          </div>
        </div>

        <div class="section">
          <h2>Admin Data</h2>
          <div class="field">
            <div class="json-data">${report.admin_data ? JSON.stringify(report.admin_data, null, 2) : 'No admin data available'}</div>
          </div>
        </div>

        <div class="section">
          <h2>Field Data</h2>
          <div class="field">
            <div class="json-data">${report.field_data ? JSON.stringify(report.field_data, null, 2) : 'No field data available'}</div>
          </div>
        </div>

        <div class="section">
          <h2>QA Data</h2>
          <div class="field">
            <div class="json-data">${report.qa_data ? JSON.stringify(report.qa_data, null, 2) : 'No QA data available'}</div>
          </div>
        </div>

        <div class="section">
          <h2>Template Information</h2>
          <div class="field">
            <span class="label">Admin Mandatory Fields:</span>
            <div class="json-data">${report.admin_mandatory ? JSON.stringify(report.admin_mandatory, null, 2) : 'No template data'}</div>
          </div>
        </div>

        <div class="footer">
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p>Valuation Company - Professional Valuation Services</p>
        </div>
      </body>
      </html>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    await browser.close();

    // Return PDF content
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${report.report_title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
} 