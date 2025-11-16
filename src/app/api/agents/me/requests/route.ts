// GET /api/agents/me/requests
import { NextRequest, NextResponse } from 'next/server';
import { getAgent } from '@/lib/auth'; // your session helper

export async function GET(req: NextRequest) {
  const agent = getAgent(); // from localStorage cookie/headers
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 🔐 In production: get agentId from session, not localStorage
  const prisma = new PrismaClient();
  try {
    const txs = await prisma.transaction.findMany({
      where: { agentId: agent.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(txs);
  } finally {
    await prisma.$disconnect();
  }
}

