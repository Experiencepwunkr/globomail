// GET /api/admin/transactions
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 🔐 In production: add admin auth (e.g., JWT, session)
    const txs = await prisma.transaction.findMany({
      where: { status: { in: ['pending', 'processing'] } },
      include: { agent: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(txs);
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}