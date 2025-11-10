import { composeEmailTemplate } from "../lib/emailTemp";
import { Request, Response } from "express";
import twilio from "twilio";
import { sendEmail } from "../lib/sendEmail";

export const sendEmailAPI = async (req: Request, res: Response) => {
  try {
    const { to, subject, title, subtitle, body1, body2,  } = req.body;
    await sendEmail({
      from: `"TicTask - Naija's Number One HR App" <${process.env.MAIL_USER}>`,
       to,
        subject,
        html: composeEmailTemplate({
          subject,
          title,
          subtitle,
          body1,
          body2,
          closingRemark: `
            <p>Warm regards,<br/>The TicTask Team</p>
          `
        }),
    });   
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const sendSlackAPI = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    const { default: fetch } = await import("node-fetch");
    const response = await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
    res.json({ success: true, response: await response.text() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export const sendSMS = async (req: Request, res: Response) => {
  try {
    const { to, message } = req.body;
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to,
    });
    res.json({ success: true, sid: sms.sid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
