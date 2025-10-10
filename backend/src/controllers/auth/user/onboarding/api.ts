import { Request, Response } from "express";
import Redis from "../../../../lib/redis";
import { prisma } from "../../../../lib/prisma";
import crypto from "crypto";
import { sendEmail } from "../../../../lib/sendEmail";
import { hashPassword } from "../../../../lib/crypto";

export const onboarding = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { step, data } = req.body;
    if (!step || !data) return res.status(400).json({ message: "Invalid request" });

    const redisKey = `onboarding:${userId}`;

    await Redis.hSet(redisKey, step.toString(), JSON.stringify(data));
    await Redis.expire(redisKey, 3600);

    if (step === 3) {
      const stepsData = await Redis.hGetAll(redisKey);

      const merged = Object.values(stepsData)
        .map((v) => JSON.parse(v))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});

      const {
        email,
        name,
        orgName,
        country,
        phone,
        userType,
        industry,
        teamSize,
        hqCountry,
        website,
        bio,
      } = merged;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          userType,
          name: name || orgName || "",
          country: country || hqCountry || null,
          phone,
          organization: orgName || null,
          industry: industry || null,
          teamSize: teamSize || null,
          website: website || null,
          bio: bio || null,
        },
      });

      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = await hashPassword(token);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await prisma.refreshToken.create({
        data: {
          jti: crypto.randomUUID(),
          hashedToken,
          expiresAt,
          userId: user.id,
        },
      });

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
        `,
      });

      await Redis.del(redisKey);

      return res.json({ message: "Onboarding complete. Email sent.", user });
    }

    return res.json({ message: `Step ${step} saved` });
  } catch (err: any) {
    console.error("❌ Onboarding Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
