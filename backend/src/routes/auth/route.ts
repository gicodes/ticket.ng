import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { login, refresh, logout } from "../../controllers/auth/api";
import { addLoginAttemptLimiter } from "../../middlewares/rateLimit";

import { onboarding } from "../../controllers/auth/user/onboarding/api";
import { resetPassword } from "../../controllers/auth/reset-password/api";
import { forgotPassword } from "../../controllers/auth/forgot-password/api";
import { 
  sendVerificationEmail,
  resendVerificationEmail, 
  confirmEmailVerification, 
} from "../../controllers/auth/verify-email/api";

const router = Router();

router.post("/verify-email", sendVerificationEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/confirm-verification", confirmEmailVerification);
router.post("/onboarding", requireAuth, onboarding);

router.get("/admin/ping", requireAuth, requireRole("ADMIN"), (req, res) => res.json({ ok: true }));

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/login", addLoginAttemptLimiter, login);
router.post("/refresh", refresh);

router.post("/logout", logout);

export default router;
