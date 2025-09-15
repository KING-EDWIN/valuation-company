import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('report_type');
    const isActive = searchParams.get('is_active');

    let query = 'SELECT * FROM report_templates WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (reportType) {
      paramCount++;
      query += ` AND report_type = $${paramCount}`;
      params.push(reportType);
    }

    if (isActive !== null) {
      paramCount++;
      query += ` AND is_active = $${paramCount}`;
      params.push(isActive === 'true');
    }

    query += ' ORDER BY report_type';

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching report templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch report templates' },
      { status: 500 }
    );
  }
}


