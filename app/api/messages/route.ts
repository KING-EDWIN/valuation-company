import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// GET /api/messages - Get messages for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const conversationWith = searchParams.get('conversation_with');
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
        m.*,
        sender.name as sender_name,
        sender.role as sender_role,
        recipient.name as recipient_name,
        recipient.role as recipient_role
      FROM messages m
      LEFT JOIN users sender ON m.sender_id = sender.id
      LEFT JOIN users recipient ON m.recipient_id = recipient.id
      WHERE (m.sender_id = $1 OR m.recipient_id = $1)
    `;
    
    const params: any[] = [userId];

    if (conversationWith) {
      query += ' AND ((m.sender_id = $1 AND m.recipient_id = $2) OR (m.sender_id = $2 AND m.recipient_id = $1))';
      params.push(conversationWith);
    }

    if (unreadOnly) {
      query += ' AND m.recipient_id = $1 AND m.read = false';
    }

    query += ' ORDER BY m.created_at DESC LIMIT $' + (params.length + 1);
    params.push(limit);

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      messages: result.rows
    });

  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages: ' + error.message },
      { status: 500 }
    );
  }
}

// POST /api/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const {
      sender_id,
      recipient_id,
      subject,
      content
    } = await request.json();

    if (!sender_id || !recipient_id || !content) {
      return NextResponse.json(
        { error: 'Sender ID, recipient ID, and content are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(`
      INSERT INTO messages (sender_id, recipient_id, subject, content, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `, [sender_id, recipient_id, subject || null, content]);

    // Create notification for the recipient
    await pool.query(`
      INSERT INTO notifications (
        user_id, from_user_id, title, message, type, category, 
        priority, action_url, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    `, [
      recipient_id,
      sender_id,
      subject || 'New Message',
      `You have received a new message: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`,
      'message',
      'communication',
      'normal',
      '/messages'
    ]);

    return NextResponse.json({
      success: true,
      message: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message: ' + error.message },
      { status: 500 }
    );
  }
}


