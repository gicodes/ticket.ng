import { transporter } from "../controllers/webhooks/api";

type SendEmailProps = {
  from?: string;
  to: string;
  subject: string;
  html: any;
}

export async function sendEmail(
  {
    from,
    to,
    subject,
    html
  }: SendEmailProps
) {
  try {
    await transporter.sendMail({
      from: `"Teaketing App" <${process.env.MAIL_USER}>`,
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