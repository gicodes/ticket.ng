import { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../lib/jwt";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = verifyAccess(token);
    if (payload.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }

    (req as any).auth = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
