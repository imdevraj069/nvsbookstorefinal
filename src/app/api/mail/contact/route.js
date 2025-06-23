import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import {
  userContactEmail,
  adminContactEmail
} from '@/utils/templates/contact';

export async function POST(req) {
  try {
    const { firstName, lastName, email, phone, subject, message } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    // Prepare HTML emails
    const userHtml = userContactEmail({ fullName, email, phone, subject, message });
    const adminHtml = adminContactEmail({ fullName, email, phone, subject, message });

    // Send both emails
    await Promise.all([
      sendEmail({
        to: email,
        subject: 'We received your message – NVS Book Store',
        html: userHtml,
      }),
      sendEmail({
        to: process.env.CONTACT_RECEIVER || process.env.SMTP_USER,
        subject: `📨 New contact from ${fullName}`,
        html: adminHtml,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
