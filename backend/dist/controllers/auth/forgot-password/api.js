"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const redis_1 = __importDefault(require("../../../lib/redis"));
const prisma_1 = require("../../../lib/prisma");
const sendEmail_1 = require("../../../lib/sendEmail");
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(404).json({ message: "No account found with that email" });
    const token = crypto_1.default.randomBytes(32).toString("hex");
    await redis_1.default.setEx(`reset:${token}`, 60 * 10, user.id.toString());
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await (0, sendEmail_1.sendEmail)({
        to: user.email,
        subject: "Reset Your TicTask Password",
        html: `<p>Click to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });
    res.json({ message: "Password reset link sent" });
};
exports.forgotPassword = forgotPassword;
