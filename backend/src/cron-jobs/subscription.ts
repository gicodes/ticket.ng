import cron from "node-cron";
import { prisma } from "../lib/prisma";

cron.schedule("0 0 * * *", async () => {
  console.log("🔁 Checking expired subscriptions...");
  await prisma.subscription.updateMany({
    where: { expiresAt: { lt: new Date() }, active: true },
    data: { active: false },
  });
});
