import { Request, Response } from "express";
import twilio from "twilio";

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



