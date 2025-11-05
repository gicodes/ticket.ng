import crypto from "crypto";
import Redis from "../../../../lib/redis";
import { Request, Response } from "express";
import { prisma } from "../../../../lib/prisma";;
import { signAccess } from "../../../../lib/jwt";
import { sendEmail } from "../../../../lib/sendEmail";
import { hashPassword } from "../../../../lib/crypto";
import { composeEmailTemplate } from "../../../../lib/emailTemp"

export const onboarding = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { step, data } = req.body;
    if (!step || !data) return res.status(400).json({ message: "Invalid request" });

    const redisKey = `onboarding:${userId}`;

    await Redis.hSet(redisKey, step.toString(), JSON.stringify(data));
    await Redis.expire(redisKey, 3600);

    if (step === 1) {
      const { password } = data as { password: string };
  
      const hashed = await hashPassword(password);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
      });
    }

    if (step < 1 || step > 3) {
      return res.status(400).json({ message: "Invalid step" });
    }

    if (step === 3) {
      const stepsData = await Redis.hGetAll(redisKey);

      const merged = Object.values(stepsData)
        .map((v) => JSON.parse(v))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});
      
      const userRecord = await prisma.user.findUnique({ where: { id: userId } });
      const email = userRecord?.email;
      if (!email) return res.status(400).json({ message: "User email missing" });

      const {
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

      const accessToken = signAccess({ sub: user.id, role: user.role });
      const refreshToken = crypto.randomBytes(32).toString("hex");
      const hashedRefresh = await hashPassword(refreshToken);

      const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await prisma.refreshToken.create({
        data: {
          jti: crypto.randomUUID(),
          hashedToken: hashedRefresh,
          expiresAt: refreshExpiresAt,
          userId: user.id,
        },
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 min
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      await sendEmail({
        to: email,
        subject: "Onboarding Complete. Welcome Aboard!",
        html: composeEmailTemplate({
          subject: "Onboarding Complete. Welcome Aboard!",
          title: "Welcome Aboard!",
          body1: `
            <p>Hi ${name || orgName || ""},</p>
            <p>Your onboarding is complete — you can now start being productive with TicTask!</p>
            <p>Click below to access your dashboard:</p>
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
          `,
          body2: `<p>If you did not expect this email, please contact our support team immediately.</p>`,
          closingRemark: `<p>All the best!,<br/>The TicTask Team</p>`
        }),
      });

      await Redis.del(redisKey);

      return res.json({
        ok: true,
        message: "Onboarding complete. Session created.",
        redirect: "/dashboard",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    }

    return res.json({
      ok: true,
      message: `Step ${step} saved`,
      redirect: step < 3 ? `/onboarding?step=${step + 1}` : "/dashboard",
    });
  } catch (err: any) {
    console.error("❌ Onboarding Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
