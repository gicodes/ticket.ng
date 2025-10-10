import crypto from "crypto";
import bcrypt from "bcryptjs";
import Redis from "../../../lib/redis";
import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { sendEmail } from "../../../lib/sendEmail";
import { hashPassword } from "../../../lib/crypto";

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, role, name, password } = req.body;
    if (!email || !role)
      return res.status(400).json({ message: "Email and role are required" });

    if (role==='ADMIN' && (!password || !name)) 
      return res.status(403).json({ message: "Data incomplete or invalid" });

    const token = crypto.randomBytes(32).toString("hex");

    await Redis.setEx(
      `verify:${token}`,
      900,
      JSON.stringify({ email, role, name, password })
    );

    const link = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Verify your TicTask email",
      html: `
        <div style="font-family:sans-serif;">
          <h2>Welcome to TicTask</h2>
          <p>Click below to verify your email address:</p>
          <a href="${link}" 
             style="background:#0070f3;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
             Verify Email
          </a>
          <p>This link expires in 15 minutes.</p>
        </div>
      `,
    });

    return res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const confirmEmailVerification = async (req: Request, res: Response) => {
  try {
    console.log('hi')
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ message: "Verification token missing" });

    const cached = await Redis.get(`verify:${token}`);
    if (!cached)
      return res.status(400).json({ message: "Invalid or expired link" });

    const data = JSON.parse(cached);
    const { email, role, name, password } = data;

    let user;

    if (role === "ADMIN") {
      const passwordHash = await bcrypt.hash(password, 10);

      user = await prisma.user.create({
        data: {
          email,
          name,
          password: passwordHash,
          role: "ADMIN",
          isVerified: true,
        },
      });

      await Redis.del(`verify:${token}`);

      await sendEmail({
        to: email,
        subject: "TicTask Admin Account is Verified",
        html: `
          <div style="font-family:sans-serif;">
            <h2>Hi ${name}</h2>
            <p>Your TicTask admin account has been successfully verified.
              You can now log in to your dashboard and manage your workspace.</p>
            <a href="/dashboard" 
              style="background:#0070f3;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
              Dashboard →
            </a>
          </div>
        `,
      });

      return res.status(200).json({
        message: "Admin email verified and account created",
        redirect: "/auth/login/admin",
        role: "ADMIN",
        email,
      });
    }

    if (role === "USER") {
      const tempPassword = crypto.randomBytes(8).toString("hex");
      const passwordHash = await hashPassword(tempPassword);
      user = await prisma.user.create({
        data: {
          email,
          name: '',
          role: "USER",
          isVerified: true,
          password: passwordHash
        },
      });

      await Redis.expire(`verify:${token}`, 900);

      await sendEmail({
        to: email,
        subject: "Set your TicTask password",
        html: `
          <div style="font-family:sans-serif;">
            <h2>Welcome to TicTask</h2>
            <p>Your email has been verified successfully.</p>
            <p>Please set your password to continue your onboarding:</p>
            <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}"
              style="background:#0070f3;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
              Set Password
            </a>
            <p>This link expires in 15 minutes.</p>
          </div>
        `
      });

      return res.status(200).json({
        message: "User email verified, proceed to onboarding",
        redirect: "/auth/onboarding",
        role: "USER",
        email,
      });
    }
    return res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    const existing = await Redis.keys(`verify:*`);
    const tokenKey = existing.find(async (key) => {
      const cached = await Redis.get(key);
      if (!cached) return false;
      const parsed = JSON.parse(cached);
      return parsed.email === email && parsed.role === role;
    });

    const token = crypto.randomBytes(32).toString("hex");
    await Redis.setEx(`verify:${token}`, 900, JSON.stringify({ email, role }));

    const link = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Resend: Verify your TicTask email",
      html: `
        <div style="font-family:sans-serif;">
          <h2>Welcome back to TicTask</h2>
          <p>Click below to verify your email address:</p>
          <a href="${link}" 
             style="background:#0070f3;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
             Verify Email
          </a>
          <p>This link expires in 15 minutes.</p>
        </div>
      `,
    });

    return res.status(200).json({ message: "Verification email resent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};