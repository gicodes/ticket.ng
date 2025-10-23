"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
async function sendEmail({ to, subject, html }) {
    try {
        await transporter.sendMail({
            from: `"TicTask - TicTask - Naija's Number One HR App" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });
        return "Successful";
    }
    catch (err) {
        console.error(err);
        throw new Error;
    }
}
