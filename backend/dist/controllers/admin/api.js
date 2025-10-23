"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupDevData = void 0;
const prisma_1 = require("../../lib/prisma");
const seed_1 = require("./seed");
const redis_1 = __importDefault(require("../../lib/redis"));
const cleanupDevData = async (req, res) => {
    if (process.env.NODE_ENV !== "development") {
        return res.status(403).json({ message: "Cleanup only allowed in development mode" });
    }
    try {
        const deletedUsers = await prisma_1.prisma.user.deleteMany({
            where: {
                email: { in: seed_1.emailsToDelete },
            },
        });
        let deletedRedis = 0;
        const patterns = ["verify:*", "onboarding:*"];
        for (const pattern of patterns) {
            const keys = await redis_1.default.keys(pattern);
            if (keys.length > 0) {
                await redis_1.default.delAll(...keys);
                deletedRedis += keys.length;
            }
        }
        return res.status(200).json({
            message: "Cleanup complete",
            deletedUsers: deletedUsers.count,
            deletedRedis,
        });
    }
    catch (err) {
        console.error("Cleanup error:", err);
        return res.status(500).json({ message: "Cleanup failed" });
    }
};
exports.cleanupDevData = cleanupDevData;
