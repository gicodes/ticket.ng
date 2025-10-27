import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailProps = {
  from?: string;
  to: string;
  subject: string;
  html: any;
};

export async function sendEmail({ to, subject, html }: SendEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TicTask <onboarding@gicodes.com>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email error:', error);
      throw new Error(error.message);
    }

    console.log('Email sent:', data);
    return 'Successful';
  } catch (err) {
    console.error('Send email failed:', err);
    throw new Error('Failed to send email');
  }
}
