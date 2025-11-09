import express from "express";
import {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
} from "../../controllers/subscription/api";

const router = express.Router();

router.post("/", createSubscription);
router.get("/:id", getSubscription);
router.put("/:id", updateSubscription);
router.delete("/:id", cancelSubscription);

export default router;
