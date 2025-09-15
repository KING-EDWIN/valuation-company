import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../lib/database';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const templatesDir = path.join(process.cwd(), 'Final-Templates');
    const reportTypes = [
      'Agricultural Machinery',
      'Boundary Opening', 
      'Bulk Materials',
      'Commercial Vehicles',
      'Forestry_Timber Property'
    ];

    // Clear existing templates
    await pool.query('DELETE FROM report_templates');

    for (const reportType of reportTypes) {
      const reportDir = path.join(templatesDir, reportType);
      
      // Read all JSON files for this report type
      const adminManPath = path.join(reportDir, 'admin_man.json');
      const adminOptPath = path.join(reportDir, 'admin_opt.json');
      const fieldManPath = path.join(reportDir, 'field_man.json');
      const fieldOptPath = path.join(reportDir, 'field_opt.json');
      const staticPath = path.join(reportDir, 'staic.json');

      // Check if all files exist
      const filesExist = [
        adminManPath,
        adminOptPath, 
        fieldManPath,
        fieldOptPath,
        staticPath
      ].every(file => fs.existsSync(file));

      if (!filesExist) {
        console.log(`Skipping ${reportType} - missing files`);
        continue;
      }

      // Read and parse JSON files
      const adminMandatory = JSON.parse(fs.readFileSync(adminManPath, 'utf8'));
      const adminOptional = JSON.parse(fs.readFileSync(adminOptPath, 'utf8'));
      const fieldMandatory = JSON.parse(fs.readFileSync(fieldManPath, 'utf8'));
      const fieldOptional = JSON.parse(fs.readFileSync(fieldOptPath, 'utf8'));
      const staticData = JSON.parse(fs.readFileSync(staticPath, 'utf8'));

      // Insert template into database
      await pool.query(`
        INSERT INTO report_templates (
          report_type, 
          template_name, 
          admin_mandatory, 
          admin_optional, 
          field_mandatory, 
          field_optional, 
          static_data
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        reportType,
        `${reportType} Valuation Report`,
        JSON.stringify(adminMandatory),
        JSON.stringify(adminOptional),
        JSON.stringify(fieldMandatory),
        JSON.stringify(fieldOptional),
        JSON.stringify(staticData)
      ]);

      console.log(`Loaded template: ${reportType}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Report templates loaded successfully',
      loadedCount: reportTypes.length
    });

  } catch (error) {
    console.error('Error loading report templates:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load report templates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


