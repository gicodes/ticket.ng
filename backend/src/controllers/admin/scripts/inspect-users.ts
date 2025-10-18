import { prisma } from "../../../lib/prisma";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  try {
    console.log("🔍 Fetching all users...\n");

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (users.length === 0) {
      console.log("📭 No users found in the database.");
    } else {
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

    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error inspecting users:", err);
    process.exit(1);
  }
})();
