import rateLimit from "express-rate-limit";

export const addLoginAttemptLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  message: { message: "Too many login attempts, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});