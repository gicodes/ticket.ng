import express from "express";
import {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
} from "../../controllers/subscription/api";
import {
  createCheckoutSession,
  handleStripeWebhook,
} from "../../controllers/subscription/stripe/api";
import "../../cron-jobs/subscription";

const router = express.Router();

router.post("/", createSubscription);
router.get("/:id", getSubscription);
router.put("/:id", updateSubscription);
router.delete("/:id", cancelSubscription);


router.post("/stripe/checkout", createCheckoutSession);

router.post("/stripe/webhook", handleStripeWebhook);

export default router;
