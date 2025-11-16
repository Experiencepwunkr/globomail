// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { scryptSync, timingSafeEqual } from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const agent = await prisma.agent.findUnique({ where: { email } });
    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // 🔑 Verify password: salt:hash format
    const [salt, storedHash] = agent.password.split(':');
    const derivedKey = scryptSync(password, salt, 64).toString('hex');

    if (!timingSafeEqual(Buffer.from(storedHash), Buffer.from(derivedKey))) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // 🧾 Create session (simple: set cookie or use Auth.js later)
    // For now: return success + redirect hint
    return NextResponse.json({
      success: true,
      message: 'Login successful.',
      agent: {
        id: agent.id,
        name: agent.name,
        email: agent.email,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}