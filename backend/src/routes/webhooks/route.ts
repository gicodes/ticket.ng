import { Router } from "express";
import {  sendSMS } from "../../webhooks/sms/api";
import { sendEmailAPI } from "../../webhooks/email/api";
import { sendSlackAPI } from "../../webhooks/slack/api";
import { handleStripeWebhook } from "../../webhooks/stripe/api";

const router = Router();

router.post("/email", sendEmailAPI);
router.post("/slack", sendSlackAPI);
router.post("/sms", sendSMS);

router.post("/stripe", handleStripeWebhook);

export default router;
