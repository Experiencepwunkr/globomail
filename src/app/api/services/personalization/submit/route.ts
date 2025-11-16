import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  try {
    const { serviceType, details, consent, paymentReference } = await req.json();
    if (!serviceType || details || !consent) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const tx = await prisma.transaction.findUnique({ where: { reference: paymentReference } });
    if (!tx || tx.status !== 'success') return NextResponse.json({ error: 'Payment invalid' }, { status: 403 });
    const u = await prisma.transaction.update({ where: { id: tx.id },
      data: { meta: { serviceType, details }, status: 'pending' },
    });
    return NextResponse.json({ success: true, requestId: u.id });
  } catch (e) { return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally { await prisma.$disconnect();
  }
}


