import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { NotificationService } from '../../../lib/notificationService';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// POST /api/auth/register - Register a new user
export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, phone, department } = await request.json();

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user (pending approval)
    const result = await pool.query(`
      INSERT INTO users (name, email, password_hash, role, phone, department, approved, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id, name, email, role, phone, department, approved, created_at
    `, [
      name,
      email,
      hashedPassword,
      role,
      phone || null,
      department || null,
      false // Not approved by default
    ]);

    const user = result.rows[0];

    // Send notification to MD and QA about new user registration
    try {
      await NotificationService.notifyNewUserRegistration(user.id);
    } catch (notificationError) {
      console.error('Error sending new user notification:', notificationError);
      // Don't fail the registration if notification fails
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Your account is pending approval from MD/QA.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        department: user.department,
        approved: user.approved,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}