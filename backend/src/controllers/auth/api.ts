import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { Request, Response } from "express";
import { loginSchema } from "../../validators/auth.schema";
import { comparePassword, hashToken } from "../../lib/crypto";
import { 
  signAccess, 
  signRefresh, 
  setRefreshCookie, 
  verifyRefresh, 
  cookieOptions 
} from "../../lib/jwt";

export const login = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return res.status(423).json({ message: "Account temporarily locked" });
  }

  const ok = await comparePassword(password, user.password);
  if (!ok) {
    const failedLogins = user.failedLogins + 1;
    let lockedUntil: Date | null = null;
    if (failedLogins >= 5) {
      lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLogins, lockedUntil }
    });
    return res.status(401).json({ message: "Invalid credentials" });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLogins: 0, 
    lockedUntil: null 
  }
});

  const access = signAccess({ sub: user.id, role: user.role });
  const { token: refresh, jti, exp } = signRefresh({ sub: user.id });

  await prisma.refreshToken.create({
    data: {
      jti,
      userId: user.id,
      hashedToken: await hashToken(refresh),
      expiresAt: exp,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || undefined,
    }
  });

  setRefreshCookie(res, refresh);
  res.json({ accessToken: access, user: { id: user.id, email: user.email, role: user.role } });
};

export const refresh = async (req: Request, res: Response) => {
  const raw = req.cookies?.refresh_token;
  if (!raw) return res.status(401).json({ message: "Missing refresh token" });

  const payload = verifyRefresh(raw);

  const record = await prisma.refreshToken.findUnique({ where: { jti: payload.jti }});
  if (!record) return res.status(401).json({ message: "Unknown token" });
  if (record.revokedAt || record.usedAt || record.expiresAt < new Date()) {
    return res.status(401).json({ message: "Token no longer valid" });
  }

  await prisma.refreshToken.update({
    where: { jti: payload.jti },
    data: { usedAt: new Date() }
  });

  const access = signAccess({ sub: payload.sub, role: payload.role });
  const { token: newRefresh, jti, exp } = signRefresh({ sub: payload.sub, role: payload.role });

  await prisma.refreshToken.create({
    data: {
      jti,
      userId: payload.sub,
      hashedToken: await hashToken(newRefresh),
      expiresAt: exp,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || undefined,
    }
  });

  setRefreshCookie(res, newRefresh);
  res.json({ accessToken: access });
};

export const logout = async (req: Request, res: Response) => {
  const raw = req.cookies?.refresh_token;
  if (raw) {
    const payload = verifyRefresh(raw);
    await prisma.refreshToken.update({
      where: { jti: payload.jti },
      data: { revokedAt: new Date() }
    });
  }
  res.clearCookie("refresh_token", cookieOptions());
  res.status(204).send();
};


export const generateEmailToken = (userId: number) => {
  return jwt.sign({ sub: userId }, process.env.JWT_EMAIL_SECRET!, { expiresIn: "1d" });
};

export const verifyEmailToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_EMAIL_SECRET!);
};