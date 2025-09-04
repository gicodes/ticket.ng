import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { addLoginAttemptLimiter } from "../../middlewares/rateLimit";
import { register, login, refresh, logout } from "../../controllers/auth/api";

const router = Router();

router.post("/register", register);
router.post("/login", addLoginAttemptLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/me", requireAuth, (req, res) => res.json({ userId: (req as any).auth.userId, role: (req as any).auth.role }));

router.get("/admin/ping", requireAuth, requireRole("ADMIN"), (req, res) => res.json({ ok: true }));

export default router;