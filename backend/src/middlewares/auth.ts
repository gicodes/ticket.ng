import { verifyAccess } from "../lib/jwt";
import { Request, Response } from "express";

export const requireAuth = (req: Request, res: Response, next: () => any) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = verifyAccess(token);
    (req as any).auth = { userId: payload.sub, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRole = (...roles: string[]) =>
  (req: Request, res: Response, next: () => any) => {
    const role = (req as any).auth?.role;
    if (!role || !roles.includes(role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
