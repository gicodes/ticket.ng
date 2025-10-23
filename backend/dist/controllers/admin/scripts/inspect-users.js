"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../../lib/prisma");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(async () => {
    try {
        console.log("🔍 Fetching all users...\n");
        const users = await prisma_1.prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });
        if (users.length === 0) {
            console.log("📭 No users found in the database.");
        }
        else {
            console.log(`👥 Found ${users.length} user(s):\n`);
            for (const user of users) {
                console.log({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                });
            }
        }
        await prisma_1.prisma.$disconnect();
        process.exit(0);
    }
    catch (err) {
        console.error("❌ Error inspecting users:", err);
        process.exit(1);
    }
})();
