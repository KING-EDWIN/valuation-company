import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface UserPayload {
  userId: number;
  email: string;
  role: string;
}

export function verifyToken(request: NextRequest): UserPayload | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as UserPayload;
    
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );
}


