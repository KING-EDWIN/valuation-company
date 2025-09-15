import { Pool } from 'pg';

// Create PostgreSQL connection pool
const pool = process.env.POSTGRES_URL ? new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
}) : null;

// Database connection helper
export async function getConnection() {
  if (!pool) {
    throw new Error('Database not configured. Please set POSTGRES_URL environment variable.');
  }
  return pool;
}

// Initialize database tables
export async function initializeDatabase() {
  if (!pool) {
    console.log('Database not configured. Skipping database initialization.');
    return;
  }
  
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'field_team',
        phone VARCHAR(50),
        department VARCHAR(255),
        approved BOOLEAN DEFAULT FALSE,
        approved_by INTEGER REFERENCES users(id),
        approved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create jobs table with comprehensive structure
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_info JSONB NOT NULL DEFAULT '{}',
        asset_type VARCHAR(100) NOT NULL,
        asset_details JSONB NOT NULL DEFAULT '{}',
        valuation_requirements JSONB NOT NULL DEFAULT '{}',
        bank_info JSONB NOT NULL DEFAULT '{}',
        status VARCHAR(50) NOT NULL DEFAULT 'pending fieldwork',
        qa_checklist JSONB DEFAULT '{}',
        field_report_data JSONB DEFAULT '{}',
        admin_reviewed BOOLEAN DEFAULT FALSE,
        admin_review_date TIMESTAMP,
        admin_review_notes TEXT,
        qa_notes TEXT,
        md_approval BOOLEAN,
        payment_received BOOLEAN DEFAULT FALSE,
        revocation_reason TEXT,
        chain JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
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

    // Create messages table for user-to-user communication
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

    // Create report_templates table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS report_templates (
        id SERIAL PRIMARY KEY,
        report_type VARCHAR(100) NOT NULL,
        template_name VARCHAR(255) NOT NULL,
        admin_mandatory JSONB NOT NULL,
        admin_optional JSONB NOT NULL,
        field_mandatory JSONB NOT NULL,
        field_optional JSONB NOT NULL,
        static_data JSONB NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create reports table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        report_type VARCHAR(100) NOT NULL,
        report_title VARCHAR(255) NOT NULL,
        report_reference_number VARCHAR(100) UNIQUE,
        status VARCHAR(50) DEFAULT 'draft',
        admin_data JSONB,
        field_data JSONB,
        qa_data JSONB,
        final_data JSONB,
        generated_pdf_path VARCHAR(500),
        created_by INTEGER REFERENCES users(id),
        assigned_to INTEGER REFERENCES users(id),
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create report_progress table to track completion by role
    await pool.query(`
      CREATE TABLE IF NOT EXISTS report_progress (
        id SERIAL PRIMARY KEY,
        report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL,
        user_id INTEGER REFERENCES users(id),
        completed BOOLEAN DEFAULT FALSE,
        data JSONB,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create clients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create reports table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        created_by INTEGER REFERENCES users(id) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Helper function to execute queries
export async function executeQuery(query: string, params: any[] = []) {
  if (!pool) {
    throw new Error('Database not configured. Please set POSTGRES_URL environment variable.');
  }
  
  try {
    const result = await pool.query(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export { pool };


