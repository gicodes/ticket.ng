import express from "express";
import { getUserProfile, updateUserProfile } from "../../controllers/user/api";

const router = express.Router();

router.get("/:id", getUserProfile);
router.patch("/:id", updateUserProfile);

export default router;
