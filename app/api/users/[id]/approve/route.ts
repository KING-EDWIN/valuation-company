import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
// import { NotificationService } from '../../../../lib/notificationService';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// POST /api/users/[id]/approve - Approve a user
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Update user approval status
    const result = await pool.query(`
      UPDATE users 
      SET approved = true, approved_at = NOW(), updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, email, role, approved, approved_at
    `, [userId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Send notification to the approved user
    try {
      await NotificationService.notifyUserApproval(userId, true, 1); // Assuming admin user ID 1
    } catch (notificationError) {
      console.error('Error sending approval notification:', notificationError);
      // Don't fail the approval if notification fails
    }

    return NextResponse.json({
      success: true,
      message: 'User approved successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error approving user:', error);
    return NextResponse.json(
      { error: 'Failed to approve user' },
      { status: 500 }
    );
  }
}
