import express from "express";
import { cleanupDevData } from "../../controllers/admin/api";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { contactUs } from "../../controllers/contact-us/api";

const router = express.Router();

router.post("/contact-us", contactUs);
router.post("/cleanup", requireAdmin, cleanupDevData);

export default router;
