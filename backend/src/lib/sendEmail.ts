import nodemailer from "nodemailer";

type SendEmailProps = {
  from?: string;
  to: string;
  subject: string;
  html: any;
}

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});



export async function sendEmail(
  {
    to,
    subject,
    html
  }: SendEmailProps
) {
  try {
    await transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP connection error:', error);
      } else {
        console.log('Server is ready to take messages');
      }
    });
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