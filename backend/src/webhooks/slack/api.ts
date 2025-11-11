import { Request, Response } from "express";

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