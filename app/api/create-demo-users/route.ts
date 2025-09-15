import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Demo users to create
const demoUsers = [
  { 
    name: "Admin User 1", 
    email: "admin1@stanfield.com", 
    password: "admin123", 
    role: "admin",
    phone: "+256 700 000 001",
    department: "Administration"
  },
  { 
    name: "Admin User 2", 
    email: "admin2@stanfield.com", 
    password: "admin123", 
    role: "admin",
    phone: "+256 700 000 002",
    department: "Administration"
  },
  { 
    name: "Field Worker 1", 
    email: "field1@stanfield.com", 
    password: "field123", 
    role: "field_team",
    phone: "+256 700 000 003",
    department: "Field Operations"
  },
  { 
    name: "Field Worker 2", 
    email: "field2@stanfield.com", 
    password: "field123", 
    role: "field_team",
    phone: "+256 700 000 004",
    department: "Field Operations"
  },
  { 
    name: "QA Officer", 
    email: "qa@stanfield.com", 
    password: "qa123", 
    role: "qa_officer",
    phone: "+256 700 000 005",
    department: "Quality Assurance"
  },
  { 
    name: "Managing Director", 
    email: "md@stanfield.com", 
    password: "md123", 
    role: "md",
    phone: "+256 700 000 006",
    department: "Management"
  },
  { 
    name: "Accountant", 
    email: "accounts@stanfield.com", 
    password: "accounts123", 
    role: "accounts",
    phone: "+256 700 000 007",
    department: "Finance"
  }
];

// POST /api/create-demo-users - Create demo user accounts
export async function POST(request: NextRequest) {
  try {
    console.log('Starting demo user creation...');
    
    // Clear existing demo users
    console.log('Clearing existing demo users...');
    await pool.query('DELETE FROM users WHERE email LIKE \'%@stanfield.com\'');
    
    const createdUsers = [];

    // Create demo users
    for (const userData of demoUsers) {
      console.log(`Creating user: ${userData.name} (${userData.email})`);
      
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const result = await pool.query(`
        INSERT INTO users (name, email, password_hash, role, phone, department, approved, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING id, name, email, role, phone, department, approved
      `, [
        userData.name,
        userData.email,
        hashedPassword,
        userData.role,
        userData.phone,
        userData.department,
        true // Pre-approved for demo
      ]);

      createdUsers.push(result.rows[0]);
      console.log(`Created user: ${userData.name} with ID: ${result.rows[0].id}`);
    }

    console.log(`Successfully created ${createdUsers.length} demo users`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdUsers.length} demo user accounts`,
      users: createdUsers
    });

  } catch (error) {
    console.error('Error creating demo users:', error);
    return NextResponse.json(
      { error: 'Failed to create demo users: ' + error.message },
      { status: 500 }
    );
  }
}
