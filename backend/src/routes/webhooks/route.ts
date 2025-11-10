import { Router } from "express";
import { sendEmailAPI, sendSlackAPI, sendSMS } from "../../webhooks/api";

const router = Router();

router.post("/email", sendEmailAPI);
router.post("/slack", sendSlackAPI);
router.post("/sms", sendSMS);

export default router;
