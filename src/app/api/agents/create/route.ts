// src/app/api/agents/create/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    // 🔐 Basic validation
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Name, email, phone, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // 🔒 Check if email already exists
    const existingAgent = await prisma.agent.findUnique({ where: { email } });
    if (existingAgent) {
      return NextResponse.json(
        { error: 'An agent with this email already exists.' },
        { status: 409 }
      );
    }

    // 🔑 Hash password
    const hashedPassword = await hash(password, 12);

    // 🧾 Create agent (no account yet)
    const agent = await prisma.agent.create({
       {
        name,
        email,
        phone,
        password: hashedPassword,
        // walletBalance: 0.0 (default)
        // canWithdraw: false (default)
      },
    });

    // 💰 Generate Paystack Dedicated Virtual Account (optional for MVP — skip if not ready)
    // For now, we’ll simulate — or you can uncomment when keys are added.

    // let accountData: { account_number: string; bank_name: string; account_name: string; customer_code?: string } | null = null;
    // try {
    //   const paystackRes = await fetch('https://api.paystack.co/dedicated_account', {
    //     method: 'POST',
    //     headers: {
    //       Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       customer: email,
    //       preferred_bank: 'wema-bank',
    //       first_name: name.split(' ')[0],
    //       last_name: name.split(' ').slice(1).join(' ') || '.',
    //       phone,
    //     }),
    //   });
    //   const json = await paystackRes.json();
    //   if (json.status) {
    //     accountData = {
    //       account_number: json.data.account_number,
    //       bank_name: json.data.bank_name,
    //       account_name: json.data.account_name,
    //       customer_code: json.data.customer?.customer_code,
    //     };
    //   }
    // } catch (err) {
    //   console.warn('Paystack account creation failed — agent created without account:', err);
    // }

    // 🎯 Update agent with account details (if any)
    // const updatedAgent = await prisma.agent.update({
    //   where: { id: agent.id },
    //    {
    //     accountNumber: accountData?.account_number,
    //     bankName: accountData?.bank_name,
    //     accountName: accountData?.account_name,
    //     paystackCode: accountData?.customer_code,
    //   },
    // });

    // ✅ Success — return minimal safe data
    return NextResponse.json(
      {
        success: true,
        message: 'Agent registered successfully.',
        agent: {
          id: agent.id,
          name: agent.name,
          email: agent.email,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Agent creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}