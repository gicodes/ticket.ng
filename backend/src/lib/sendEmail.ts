import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

type SendEmailProps = {
  from?: string;
  to: string;
  subject: string;
  html: any;
}

export async function sendEmail(
  {
    to,
    subject,
    html
  }: SendEmailProps
) {
  try {
    await transporter.sendMail({
      from: `"TicTask - Naija's Number One HR App" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    return "Successful"
  } catch (err) {
    console.error(err);
    throw new Error
  }
}