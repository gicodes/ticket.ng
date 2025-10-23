"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = exports.sendSlackAPI = exports.sendEmailAPI = void 0;
const emailTemp_1 = require("../../lib/emailTemp");
const sendEmail_1 = require("../../lib/sendEmail");
const twilio_1 = __importDefault(require("twilio"));
const sendEmailAPI = async (req, res) => {
    try {
        const { to, subject, title, subtitle, body1, body2, } = req.body;
        await (0, sendEmail_1.sendEmail)({
            from: `"TicTask - Naija's Number One HR App" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html: (0, emailTemp_1.composeEmailTemplate)({
                subject,
                title,
                subtitle,
                body1,
                body2,
                closingRemark: `
            <p>Warm regards,<br/>The TicTask Team</p>
          `
            }),
        });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.sendEmailAPI = sendEmailAPI;
const sendSlackAPI = async (req, res) => {
    try {
        const { message } = req.body;
        const { default: fetch } = await Promise.resolve().then(() => __importStar(require("node-fetch")));
        const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: message }),
        });
        res.json({ success: true, response: await response.text() });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.sendSlackAPI = sendSlackAPI;
const client = (0, twilio_1.default)(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
const sendSMS = async (req, res) => {
    try {
        const { to, message } = req.body;
        const sms = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE,
            to,
        });
        res.json({ success: true, sid: sms.sid });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.sendSMS = sendSMS;
