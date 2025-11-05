import { emailsToDelete } from "../../../controllers/admin/seed";
import { prisma } from "../../../lib/prisma";
import Redis from "../../../lib/redis";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  try {
   await prisma.ticket.deleteMany({
      where: { createdBy: { email: { in: emailsToDelete } } },
    });

    await prisma.refreshToken.deleteMany({
      where: { user: { email: { in: emailsToDelete } } },
    });

    const deletedUsers = await prisma.user.deleteMany({
      where: { email: { in: emailsToDelete } },
    });

    let deletedRedis = 0;
    const patterns = ["verify:*", "onboarding:*"];
    for (const pattern of patterns) {
      const keys = await Redis.keys(pattern);
      if (keys.length > 0) {
        await Redis.delAll(...keys);
        deletedRedis += keys.length;
      }
    }

    console.log("✅ Cleanup complete");
    console.log(`🗑️  Deleted users: ${deletedUsers.count}`);
    console.log(`🧹 Deleted Redis keys: ${deletedRedis}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
  }
})();

