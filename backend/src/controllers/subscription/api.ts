import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

const getExpiryDate = (duration: "monthly" | "yearly") => {
  const date = new Date();
  date.setDate(date.getDate() + (duration === "yearly" ? 365 : 30));
  return date;
};

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { id, plan, duration } = req.body;

    if (!id || !plan) return res.status(400).json({ ok: false, message: "Missing id or plan" });

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });

    const isTeam = user.userType === "BUSINESS";

    const existing = await prisma.subscription.findFirst({
      where: isTeam ? { teamId: Number(id) } : { userId: Number(id) },
    });

    if (existing) return res.status(409).json({ 
      ok: true, 
      data: null,
      message: "Subscription already exists" 
    });

    const expiresAt = getExpiryDate(duration);

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
      message: "Subscription created successfully",
      subscription,
    });
  } catch (error) {
    console.error("❌ Error creating subscription:", error);
    return res.status(500).json({ ok: false, message: "Internal server error" });
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
        subscribed: false,
        message: "No subscription found",
        data: null,
      });
    }

    const now = new Date();
    const daysRemaining = Math.max(
      0,
      Math.floor((subscription.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    return res.status(200).json({
      ok: true,
      subscribed: true,
      message: "Subscription retrieved",
      data: {
        ...subscription,
        daysRemaining,
        expired: subscription.expiresAt < now,
      },
    });
  } catch (error) {
    console.error("❌ Error reading subscription:", error);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { plan, active, expiresAt } = req.body;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });

    const isTeam = user.userType === "BUSINESS";

    const updated = await prisma.subscription.updateMany({
      where: isTeam ? { teamId: Number(id) } : { userId: Number(id) },
      data: {
        plan,
        active,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      },
    });

    if (updated.count === 0)
      return res.status(404).json({ ok: false, message: "Subscription not found" });

    return res.status(200).json({ ok: true, message: "Subscription updated successfully" });
  } catch (error) {
    console.error("❌ Error updating subscription:", error);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });

    const isTeam = user.userType === "BUSINESS";

    const canceled = await prisma.subscription.updateMany({
      where: isTeam ? { teamId: Number(id) } : { userId: Number(id) },
      data: { active: false },
    });

    if (canceled.count === 0)
      return res.status(404).json({ ok: false, message: "Subscription not found" });

    return res.status(200).json({ ok: true, message: "Subscription canceled successfully" });
  } catch (error) {
    console.error("❌ Error canceling subscription:", error);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
};

export const trackSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });

    const isTeam = user.userType === "BUSINESS";

    const subscription = await prisma.subscription.findFirst({
      where: isTeam ? { teamId: Number(id) } : { userId: Number(id) },
    });

    if (!subscription)
      return res.status(200).json({
        ok: true,
        subscribed: false,
        plan: "FREE",
        expiresInDays: null,
        active: false,
      });

    const now = new Date();
    const expiresInDays = Math.max(
      0,
      Math.floor((subscription.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    return res.status(200).json({
      ok: true,
      subscribed: subscription.active && expiresInDays > 0,
      plan: subscription.plan,
      expiresInDays,
      active: subscription.active,
      expired: expiresInDays <= 0,
    });
  } catch (error) {
    console.error("❌ Error tracking subscription:", error);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
};
