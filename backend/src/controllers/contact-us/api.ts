import { Request, Response } from "express";
import { sendEmail } from "../../lib/sendEmail";
import { composeEmailTemplate } from "../../lib/emailTemp";

const MAIL_RECIPIENT: string = process.env.MAIL_RECIPIENT || '';

export const contactUs = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!email)
      return res.status(400).json({ message: "Email is required" });

    await sendEmail({
      to: email,
      subject: "Thanks for contacting us!",
      html: composeEmailTemplate({
        subject: "Thanks for contacting us!",
        body1: `
          <p>Hi${name ? ` ${name},` : ''},</p>
          <p>Thank you for reaching out to TicTask Contact Center. We are pleased to hear from you!</p>
        `,
        body2: `<p>You message is up for review, and would be responded to, shortly!</p>`,
        closingRemark: `<p>Warm regards! 🔥<br/>The TicTask Team</p>`
      }), 
    });

    if (!MAIL_RECIPIENT) console.log("MAIL RECIPIENT UNSET!")

    await sendEmail({
      to: MAIL_RECIPIENT,
      subject: `New Message from ${name || "Untitled User"}`,
      html: composeEmailTemplate({
        subject: `New Message from ${name || "Untitled User"}`,
        body1: `
          <p>${message}</p>
        `,
      }), 
    });

    return res.status(201).json({ message: "Message sent" });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ message: "Message not sent" });
  }
}