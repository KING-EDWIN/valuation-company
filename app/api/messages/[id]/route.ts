import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// PUT /api/messages/[id] - Mark message as read
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messageId = params.id;
    const { read } = await request.json();

    const result = await pool.query(`
      UPDATE messages 
      SET read = $1, read_at = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [
      read,
      read ? new Date() : null,
      messageId
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/messages/[id] - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messageId = params.id;

    const result = await pool.query(
      'DELETE FROM messages WHERE id = $1 RETURNING id',
      [messageId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message: ' + error.message },
      { status: 500 }
    );
  }
}


