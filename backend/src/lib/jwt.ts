import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_SECRET: any = process.env.JWT_ACCESS_SECRET || "";
const REFRESH_SECRET: any = process.env.JWT_REFRESH_SECRET || "";
const ACCESS_TTL: any = process.env.JWT_ACCESS_TTL || "15m";
const REFRESH_TTL: any = process.env.JWT_REFRESH_TTL || "30d";

export const signAccess = (payload: any) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL });

export const signRefresh = (payload: any) => {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ ...payload, jti }, REFRESH_SECRET, {
    expiresIn: REFRESH_TTL,
  });
  const { exp } = jwt.decode(token) as { exp: number };
  return { token, jti, exp: new Date(exp * 1000) };
};

export const verifyAccess = (token: string) =>
  jwt.verify(token, ACCESS_SECRET) as any;

export const verifyRefresh = (token: string) =>
  jwt.verify(token, REFRESH_SECRET) as any;

export const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: (process.env.COOKIE_SAME_SITE as any) || "strict",
  domain: process.env.COOKIE_DOMAIN || undefined,
  path: "/",
});

export const setRefreshCookie = (res: any, token: string) => {
  res.cookie("refresh_token", token, {
    ...cookieOptions(),
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
};
