import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// PUT /api/notifications/[id] - Mark notification as read
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = params.id;
    const { read } = await request.json();

    const result = await pool.query(`
      UPDATE notifications 
      SET read = $1, read_at = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [
      read,
      read ? new Date() : null,
      notificationId
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      notification: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/[id] - Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = params.id;

    const result = await pool.query(
      'DELETE FROM notifications WHERE id = $1 RETURNING id',
      [notificationId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification: ' + error.message },
      { status: 500 }
    );
  }
}


