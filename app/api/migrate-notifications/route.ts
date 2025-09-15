import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function POST(request: NextRequest) {
  try {
    console.log('Starting notification system migration...');

    // Drop and recreate notifications table with new schema
    await pool.query('DROP TABLE IF EXISTS notifications CASCADE');
    
    await pool.query(`
      CREATE TABLE notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        from_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'info',
        category VARCHAR(50) DEFAULT 'system',
        priority VARCHAR(20) DEFAULT 'normal',
        read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        action_url VARCHAR(500),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        subject VARCHAR(255),
        content TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create some sample notifications for demo users
    const sampleNotifications = [
      {
        user_id: 1,
        title: 'Welcome to Valuation Company',
        message: 'Your admin account has been set up successfully. You can now manage the entire system.',
        type: 'success',
        category: 'system',
        priority: 'normal'
      },
      {
        user_id: 1,
        title: 'New User Registration',
        message: 'A new field worker has registered and is pending approval.',
        type: 'info',
        category: 'user',
        priority: 'normal'
      },
      {
        user_id: 5,
        title: 'QA Review Required',
        message: 'Job #1 is ready for quality assurance review.',
        type: 'info',
        category: 'job',
        priority: 'high'
      },
      {
        user_id: 6,
        title: 'MD Approval Required',
        message: 'Job #2 is pending your final approval.',
        type: 'info',
        category: 'approval',
        priority: 'high'
      }
    ];

    for (const notification of sampleNotifications) {
      await pool.query(`
        INSERT INTO notifications (user_id, title, message, type, category, priority, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [
        notification.user_id,
        notification.title,
        notification.message,
        notification.type,
        notification.category,
        notification.priority
      ]);
    }

    console.log('Notification system migration completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Notification system migrated successfully'
    });

  } catch (error: any) {
    console.error('Error migrating notification system:', error);
    return NextResponse.json(
      { error: 'Failed to migrate notification system: ' + error.message },
      { status: 500 }
    );
  }
}


