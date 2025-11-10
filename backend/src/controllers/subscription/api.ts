import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { Plan } from "@prisma/client";

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { id, plan, duration } = req.body; // id = userId or teamId

    if (!id || !plan) return res.status(400).json({ message: "Missing id or plan" });

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isTeam = user.userType === "BUSINESS";

    const existing = await prisma.subscription.findFirst({
      where: isTeam ? { teamId: Number(id) } : { userId: Number(id) },
    });

    if (existing) {
      return res.status(409).json({ message: "Subscription already exists" });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (duration === "yearly" ? 365 : 30));

    const subscription = await prisma.subscription.create({
      data: {
        plan,
        expiresAt,
        active: true,
        ...(isTeam ? { teamId: Number(id) } : { userId: Number(id) }),
      },
    });

    return res.status(201).json({
      ok: true,
      message: `${isTeam ? "Team" : "User"} subscription created successfully`,
      subscription,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(409).json({ ok: false, message: "User not found" });

    const isTeam = user.userType === "BUSINESS";

    const subscription = await prisma.subscription.findFirst({
      where: isTeam ? { teamId: Number(id) } : { userId: Number(id) },
    });

    if (!subscription) {
      return res.status(200).json({ 
        ok: true, 
        message: "No subscription found",
        data: null,
      });
    }

    return res.status(201).json({
      ok: true,
      message: "Subscription retrieved",
      data: subscription
    });
  } catch (error) {
    console.error("Error reading subscription:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { plan, active, expiresAt } = req.body;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isTeam = user.userType === "BUSINESS";

    const subscription = await prisma.subscription.updateMany({
      where: isTeam ? { teamId: Number(id) } : { userId: Number(id) },
      data: {
        plan,
        active,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      },
    });

    if (subscription.count === 0)
      return res.status(404).json({ message: "Subscription not found" });

    return res.status(200).json({ message: "Subscription updated successfully" });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isTeam = user.userType === "BUSINESS";

    const canceled = await prisma.subscription.updateMany({
      where: isTeam ? { teamId: Number(id) } : { userId: Number(id) },
      data: { active: false },
    });

    if (canceled.count === 0)
      return res.status(404).json({ message: "Subscription not found" });

    return res.status(200).json({ message: "Subscription canceled successfully" });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
