import { Router } from "express";
import { sendEmail, sendSlack, sendSMS } from "../../controllers/webhooks/api";

const router = Router();

router.post("/email", sendEmail);
router.post("/slack", sendSlack);
router.post("/sms", sendSMS);

export default router;
