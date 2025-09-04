import bcrypt from "bcryptjs";
import crypto from "crypto";

export const hashPassword = (plain: string) => bcrypt.hash(plain, 12);
export const comparePassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

export const hashToken = async (t: string) =>
  crypto.createHash("sha256").update(t, "utf8").digest("hex");