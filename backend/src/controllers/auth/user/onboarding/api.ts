import Redis from "../../../../lib/redis";
import { Request, Response } from "express";

export const onboarding = async (req: Request, res: Response) => {
  const userId = (req as any).auth?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { step, data } = req.body;
  await Redis.hSet(`onboarding:${userId}`, step, JSON.stringify(data));
  res.json({ message: "Step saved" });
};
