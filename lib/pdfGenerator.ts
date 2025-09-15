import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export interface ReportData {
  report_type: string;
  report_title: string;
  report_reference_number: string;
  admin_data: any;
  field_data: any;
  qa_data: any;
  static_data: any;
  client_name: string;
  created_at: string;
}

export class PDFGenerator {
  private static instance: PDFGenerator;
  private browser: any = null;

  private constructor() {}

  public static getInstance(): PDFGenerator {
    if (!PDFGenerator.instance) {
      PDFGenerator.instance = new PDFGenerator();
    }
    return PDFGenerator.instance;
  }

  private async getBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    return this.browser;
  }

  public async generateReportPDF(reportData: ReportData): Promise<string> {
    try {
      const browser = await this.getBrowser();
      const page = await browser.newPage();

      // Generate HTML content based on report type
      const htmlContent = this.generateHTML(reportData);

      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      // Create reports directory if it doesn't exist
      const reportsDir = path.join(process.cwd(), 'public', 'reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      // Generate unique filename
      const filename = `${reportData.report_type.replace(/\s+/g, '_')}_${reportData.report_reference_number}_${Date.now()}.pdf`;
      const filepath = path.join(reportsDir, filename);

      // Generate PDF
      await page.pdf({
        path: filepath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
      });

      await page.close();

      return `/reports/${filename}`;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  private generateHTML(reportData: ReportData): string {
    const { report_type, report_title, report_reference_number, admin_data, field_data, qa_data, static_data, client_name, created_at } = reportData;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${report_title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #2196F3;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2196F3;
            margin: 0;
            font-size: 24px;
          }
          .header h2 {
            color: #666;
            margin: 10px 0 0 0;
            font-size: 18px;
            font-weight: normal;
          }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .section h3 {
            color: #2196F3;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          .field-group {
            margin-bottom: 15px;
          }
          .field-label {
            font-weight: bold;
            color: #555;
            margin-bottom: 5px;
          }
          .field-value {
            margin-left: 20px;
            margin-bottom: 10px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .table th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            width: 200px;
            text-align: center;
          }
          .signature-line {
            border-bottom: 1px solid #333;
            height: 40px;
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${report_title}</h1>
          <h2>${report_type} Valuation Report</h2>
          <p><strong>Reference Number:</strong> ${report_reference_number}</p>
          <p><strong>Client:</strong> ${client_name}</p>
          <p><strong>Date:</strong> ${new Date(created_at).toLocaleDateString()}</p>
        </div>

        ${admin_data ? this.generateAdminSection(admin_data) : ''}
        ${field_data ? this.generateFieldSection(field_data) : ''}
        ${qa_data ? this.generateQASection(qa_data) : ''}
        ${static_data ? this.generateStaticSection(static_data) : ''}

        <div class="footer">
          <p>This report was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>Stanfield Valuation Services - Professional Property Valuation</p>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <p>Field Worker Signature</p>
            <p>Date: _______________</p>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <p>QA Officer Signature</p>
            <p>Date: _______________</p>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <p>Managing Director Signature</p>
            <p>Date: _______________</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateAdminSection(adminData: any): string {
    if (!adminData) return '';

    return `
      <div class="section">
        <h3>1. Project Details</h3>
        ${adminData.project_details ? `
          <div class="field-group">
            <div class="field-label">Report Title:</div>
            <div class="field-value">${adminData.project_details.report_title || 'N/A'}</div>
          </div>
          <div class="field-group">
            <div class="field-label">Assignment Type:</div>
            <div class="field-value">${adminData.project_details.assignment_type || 'N/A'}</div>
          </div>
          <div class="field-group">
            <div class="field-label">Assignment Purpose:</div>
            <div class="field-value">${adminData.project_details.assignment_purpose || 'N/A'}</div>
          </div>
        ` : ''}
        
        ${adminData.client_details ? `
          <h3>2. Client Information</h3>
          <div class="field-group">
            <div class="field-label">Client Name:</div>
            <div class="field-value">${adminData.client_details.name || 'N/A'}</div>
          </div>
          <div class="field-group">
            <div class="field-label">Branch:</div>
            <div class="field-value">${adminData.client_details.branch || 'N/A'}</div>
          </div>
          <div class="field-group">
            <div class="field-label">Location:</div>
            <div class="field-value">${adminData.client_details.location || 'N/A'}</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  private generateFieldSection(fieldData: any): string {
    if (!fieldData) return '';

    return `
      <div class="section">
        <h3>3. Field Inspection Details</h3>
        ${fieldData.asset_details?.inspection_details ? `
          <div class="field-group">
            <div class="field-label">Inspection Date:</div>
            <div class="field-value">${fieldData.asset_details.inspection_details.inspection_date || 'N/A'}</div>
          </div>
        ` : ''}
        
        ${fieldData.valuation_findings?.asset_conditions ? `
          <h3>4. Asset Valuation Findings</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Operational Status</th>
                <th>Physical Condition</th>
                <th>Market Value</th>
                <th>Forced Sale Value</th>
              </tr>
            </thead>
            <tbody>
              ${fieldData.valuation_findings.asset_conditions.map((condition: any) => `
                <tr>
                  <td>${condition.asset_name || 'N/A'}</td>
                  <td>${condition.operational_status || 'N/A'}</td>
                  <td>${condition.physical_condition || 'N/A'}</td>
                  <td>${condition.estimated_value?.market_value ? `${condition.estimated_value.market_value.toLocaleString()} ${condition.estimated_value.currency}` : 'N/A'}</td>
                  <td>${condition.estimated_value?.forced_sale_value ? `${condition.estimated_value.forced_sale_value.toLocaleString()} ${condition.estimated_value.currency}` : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}
      </div>
    `;
  }

  private generateQASection(qaData: any): string {
    if (!qaData) return '';

    return `
      <div class="section">
        <h3>5. Quality Assurance Review</h3>
        <div class="field-group">
          <div class="field-label">QA Review Status:</div>
          <div class="field-value">${qaData.review_status || 'Pending'}</div>
        </div>
        <div class="field-group">
          <div class="field-label">QA Comments:</div>
          <div class="field-value">${qaData.comments || 'No comments provided'}</div>
        </div>
      </div>
    `;
  }

  private generateStaticSection(staticData: any): string {
    if (!staticData) return '';

    return `
      <div class="section">
        <h3>6. Firm Details</h3>
        ${staticData.firm_details ? `
          <div class="field-group">
            <div class="field-label">Firm Name:</div>
            <div class="field-value">${staticData.firm_details.name || 'Stanfield Valuation Services'}</div>
          </div>
          <div class="field-group">
            <div class="field-label">Address:</div>
            <div class="field-value">${staticData.firm_details.address || 'Kampala, Uganda'}</div>
          </div>
        ` : ''}
        
        <h3>7. Disclaimers</h3>
        <div class="field-group">
          <div class="field-value">
            <p>This report is prepared for the specific purpose stated and should not be used for any other purpose without the express written consent of the valuer.</p>
            <p>The valuation is based on the information available at the time of inspection and is subject to the assumptions and limitations set out in this report.</p>
            <p>No responsibility is accepted for any loss or damage arising from the use of this report.</p>
          </div>
        </div>
      </div>
    `;
  }

  public async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}


