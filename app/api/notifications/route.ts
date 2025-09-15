import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// GET /api/notifications - Get notifications for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const unreadOnly = searchParams.get('unread_only') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let query = `
      SELECT 
        n.*,
        u.name as from_user_name,
        u.role as from_user_role
      FROM notifications n
      LEFT JOIN users u ON n.from_user_id = u.id
      WHERE n.user_id = $1
    `;
    
    const params: any[] = [userId];

    if (unreadOnly) {
      query += ' AND n.read = false';
    }

    query += ' ORDER BY n.created_at DESC LIMIT $2';
    params.push(limit);

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      notifications: result.rows
    });

  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications: ' + error.message },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create a new notification
export async function POST(request: NextRequest) {
  try {
    const {
      user_id,
      from_user_id,
      title,
      message,
      type = 'info',
      category = 'system',
      priority = 'normal',
      action_url,
      metadata
    } = await request.json();

    if (!user_id || !title || !message) {
      return NextResponse.json(
        { error: 'User ID, title, and message are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(`
      INSERT INTO notifications (
        user_id, from_user_id, title, message, type, category, 
        priority, action_url, metadata, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `, [
      user_id,
      from_user_id || null,
      title,
      message,
      type,
      category,
      priority,
      action_url || null,
      metadata ? JSON.stringify(metadata) : null
    ]);

    return NextResponse.json({
      success: true,
      notification: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification: ' + error.message },
      { status: 500 }
    );
  }
}