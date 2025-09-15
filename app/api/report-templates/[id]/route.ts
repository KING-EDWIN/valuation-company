import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../../lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const result = await pool.query(
      'SELECT * FROM report_templates WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch template' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const {
      template_name,
      admin_mandatory,
      admin_optional,
      field_mandatory,
      field_optional,
      static_data,
      is_active
    } = body;

    const result = await pool.query(`
      UPDATE report_templates 
      SET 
        template_name = $1,
        admin_mandatory = $2,
        admin_optional = $3,
        field_mandatory = $4,
        field_optional = $5,
        static_data = $6,
        is_active = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [
      template_name,
      JSON.stringify(admin_mandatory),
      JSON.stringify(admin_optional),
      JSON.stringify(field_mandatory),
      JSON.stringify(field_optional),
      JSON.stringify(static_data),
      is_active,
      id
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json({ success: false, error: 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const result = await pool.query(
      'DELETE FROM report_templates WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete template' }, { status: 500 });
  }
}


