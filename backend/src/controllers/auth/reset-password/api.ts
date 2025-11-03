import Redis from "../../../lib/redis";
import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { hashPassword } from "../../../lib/crypto";

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const userId = await Redis.get(`reset:${token}`);
  if (!userId) return res.status(400).json({ message: "Invalid or expired token" });

  const hashed = await hashPassword(password);
  await prisma.user.update({
    where: { id: Number(userId) },
    data: { password: hashed },
  });

  await Redis.del(`reset:${token}`);
  res.json({ 
    ok: true, 
    message: "Password reset successfully"
  });
};
