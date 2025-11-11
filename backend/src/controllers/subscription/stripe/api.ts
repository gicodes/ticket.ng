import Stripe from "stripe";
import { Plan } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { userId, plan } = req.body;
    console.log(req.body)

    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const PLAN_PRICES: Record<Plan, string | null> = {
      FREE: null,
      STANDARD: null,
      PRO: process.env.STRIPE_PRICE_PRO!,
      ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE!,
    };

    const priceId = PLAN_PRICES[plan as keyof typeof PLAN_PRICES];
    if (!priceId) return res.status(400).json({ message: "Invalid plan selected" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: { userId: user.id, plan },
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    });

    return res.status(200).json({ 
      ok: true,
      url: session.url, 
      sessionId: session.id 
    });
  } catch (error) {
    console.error("Stripe Checkout error:", error);
    return res.status(500).json({ message: "Failed to create checkout session" });
  }
};