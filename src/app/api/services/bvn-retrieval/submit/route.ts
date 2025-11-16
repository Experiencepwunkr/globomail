import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { fullName, dob, phone, consent, paymentReference } = await req.json();

    // Check for missing fields
    if (!fullName || !dob || !phone || !consent) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      );
    }

    // Check payment transaction
    const tx = await prisma.transaction.findUnique({
      where: { reference: paymentReference },
    });

    if (!tx || tx.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment invalid' },
        { status: 403 }
      );
    }

    // Update transaction and attach metadata
    const u = await prisma.transaction.update({
      where: { id: tx.id },
      data: {
        meta: { fullName, dob, phone }, // ❌ previous missing colon
        status: 'pending',
      },
    });

    return NextResponse.json({ success: true, requestId: u.id });
  } catch (e) {
    console.error(e); // optional: log server error
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // ❌ previous had invalid await prisma.()
  }
}

