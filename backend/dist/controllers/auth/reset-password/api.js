"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = void 0;
const prisma_1 = require("../../../lib/prisma");
const redis_1 = __importDefault(require("../../../lib/redis"));
const crypto_1 = require("../../../lib/crypto");
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const userId = await redis_1.default.get(`reset:${token}`);
    if (!userId)
        return res.status(400).json({ message: "Invalid or expired token" });
    const hashed = await (0, crypto_1.hashPassword)(newPassword);
    await prisma_1.prisma.user.update({
        where: { id: Number(userId) },
        data: { password: hashed },
    });
    await redis_1.default.del(`reset:${token}`);
    res.json({ message: "Password reset successfully" });
};
exports.resetPassword = resetPassword;
