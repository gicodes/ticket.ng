"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seed_1 = require("../../../controllers/admin/seed");
const prisma_1 = require("../../../lib/prisma");
const redis_1 = __importDefault(require("../../../lib/redis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(async () => {
    try {
        await prisma_1.prisma.refreshToken.deleteMany({
            where: {
                user: { email: { in: seed_1.emailsToDelete } },
            },
        });
        const deletedUsers = await prisma_1.prisma.user.deleteMany({
            where: { email: { in: seed_1.emailsToDelete } },
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
        console.log("✅ Cleanup complete");
        console.log(`🗑️  Deleted users: ${deletedUsers.count}`);
        console.log(`🧹 Deleted Redis keys: ${deletedRedis}`);
        process.exit(0);
    }
    catch (err) {
        console.error("❌ Cleanup failed:", err);
        process.exit(1);
    }
})();
