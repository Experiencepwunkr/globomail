// src/app/api/admin/transactions/[id]/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// SendGrid setup
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, result } = await req.json();
    const id = params.id;

    // 🔐 Optional: Add basic auth (e.g., header check) in production
    // if (req.headers.get('x-admin-secret') !== process.env.ADMIN_SECRET) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    // }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        status,
        result: result || undefined,
        deliveredAt: status === 'completed' ? new Date() : undefined,
        failedAt: status === 'failed' ? new Date() : undefined,
        updatedAt: new Date(),
      },
      include: { agent: { select: { name: true, email: true } } },
    });

    // 📨 Send email notification to agent
    if (status === 'completed' || status === 'failed') {
      const { agent, serviceType } = updated;

      if (agent?.email) {
        const subject = status === 'completed'
          ? `✅ Globomail: Your ${serviceType} Request is Completed`
          : `❌ Globomail: Your ${serviceType} Request Failed`;

        const message = status === 'completed'
          ? result?.message || 'Your request has been processed successfully.'
          : result?.message || 'We were unable to complete your request. Please try again or contact support.';

        const html = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Globomail</h1>
              <p style="margin: 8px 0 0; opacity: 0.8;">Professional Service Delivery</p>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #1f2937; margin-top: 0;">Hi ${agent.name},</h2>
              <p>Your <strong>${serviceType}</strong> request has been <strong style="color: ${
                status === 'completed' ? '#10b981' : '#ef4444'
              }">${status}</strong>.</p>
              <div style="background: ${status === 'completed' ? '#ecfdf5' : '#fef2f2'}; border-left: 4px solid ${
                status === 'completed' ? '#10b981' : '#ef4444'
              }; padding: 12px 16px; margin: 16px 0; border-radius: 0 4px 4px 0;">
                <p style="margin: 0; color: ${status === 'completed' ? '#065f46' : '#b91c1c'};">
                  ${message}
                </p>
              </div>
              ${
                result?.fileUrls?.length
                  ? `<p><strong>📎 Attachments:</strong></p>
                     <ul style="padding-left: 20px; margin: 8px 0;">
                       ${result.fileUrls
                         .map((url: string) => `<li><a href="${url}" style="color: #2563eb;">Download Result</a></li>`)
                         .join('')}
                     </ul>`
                  : ''
              }
              <p><a href="https://globomail.site/dashboard" style="display: inline-block; background: #1d4ed8; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; margin-top: 16px;">View in Dashboard</a></p>
              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="font-size: 13px; color: #6b7280;">Need help? Reply to this email or contact support@globomail.site</p>
            </div>
            <div style="background: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
              © 2025 Globomail. All rights reserved.<br />
              123 Service Lane, Lagos, Nigeria
            </div>
          </div>
        `;

        const msg = {
          to: agent.email,
          from: {
            email: 'noreply@globomail.site',
            name: 'Globomail Team',
          },
          subject: subject,
          text: `Hi ${agent.name},\n\nYour ${serviceType} request is ${status}.\n\n${message}\n\nLogin: https://globomail.site/dashboard`,
          html: html,
        };

        try {
          await sgMail.send(msg);
          console.log(`✅ Email sent to ${agent.email} for transaction ${id}`);
        } catch (emailErr: any) {
          console.error('❌ SendGrid error:', emailErr.response?.body || emailErr.message);
          // Don't fail the whole update if email fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: updated.id,
        status: updated.status,
        result: updated.result,
      },
    });
  } catch (error: any) {
    console.error('Admin update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update transaction' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}