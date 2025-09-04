import { Request, Response } from "express";
import nodemailer from "nodemailer";
import twilio from "twilio";

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const { to, subject, text } = req.body;
    await transporter.sendMail({
      from: `"Teaketing App" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const sendSlack = async (req: Request, res: Response) => {
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
