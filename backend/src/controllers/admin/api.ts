import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { emailsToDelete } from "./seed";
import Redis from "../../lib/redis";

export const cleanupDevData = async (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({ message: "Cleanup only allowed in development mode" });
  }

  try {
   const deletedUsers = await prisma.user.deleteMany({
      where: {
        email: { in: emailsToDelete },
      },
    });

    let deletedRedis = 0;
    const patterns = ["verify:*", "onboarding:*"];

    for (const pattern of patterns) {
      const keys: string[] = await Redis.keys(pattern);
      if (keys.length > 0) {
        await Redis.delAll(...(keys as string[]));
        deletedRedis += keys.length;
      }
    }
    
    return res.status(200).json({
      message: "Cleanup complete",
      deletedUsers: deletedUsers.count,
      deletedRedis,
    });
  } catch (err) {
    console.error("Cleanup error:", err);
    return res.status(500).json({ message: "Cleanup failed" });
  }
};
