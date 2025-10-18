import express from "express";
import { cleanupDevData } from "../../controllers/admin/api";
import { requireAdmin } from "../../middlewares/requireAdmin";

const router = express.Router();

router.post("/cleanup", requireAdmin, cleanupDevData);

export default router;
