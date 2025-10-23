import crypto from "crypto";
import Redis from "../../../lib/redis";
import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { sendEmail } from "../../../lib/sendEmail";

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "No account found with that email" });

  const token = crypto.randomBytes(32).toString("hex");
  await Redis.setEx(`reset:${token}`, 60 * 10, user.id.toString());

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: "Reset Your TicTask Password",
    html: `<p>Click to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
  });

  res.json({ message: "Password reset link sent" });
};
