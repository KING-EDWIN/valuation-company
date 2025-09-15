import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../../lib/database';
import bcrypt from 'bcryptjs';

// DELETE /api/users/[id] - Delete a user
export async function DELETE(
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

    // Check if user exists
    const userCheck = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update name/email/password
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, password, current_password } = body as { name?: string; email?: string; password?: string; current_password?: string };

    if (!name && !email && !password) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Build dynamic query
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (name) { fields.push(`name = $${idx++}`); values.push(name); }
    if (email) { fields.push(`email = $${idx++}`); values.push(email); }
    if (password) {
      // Verify current password before allowing change
      const userRow = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
      if (userRow.rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      if (!current_password) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
      }
      const ok = await bcrypt.compare(current_password, userRow.rows[0].password);
      if (!ok) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 403 });
      }
      const hash = await bcrypt.hash(password, 10);
      fields.push(`password = $${idx++}`);
      values.push(hash);
    }

    values.push(userId);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING id, name, email, role, approved`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
