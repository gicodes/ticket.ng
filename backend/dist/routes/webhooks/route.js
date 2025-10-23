"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = require("../../controllers/webhooks/api");
const router = (0, express_1.Router)();
router.post("/email", api_1.sendEmailAPI);
router.post("/slack", api_1.sendSlackAPI);
router.post("/sms", api_1.sendSMS);
exports.default = router;
