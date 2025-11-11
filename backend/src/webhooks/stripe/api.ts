import Stripe from "stripe";
import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, plan } = session.metadata || {};

        if (userId && plan) {
          await prisma.subscription.upsert({
            where: { userId: Number(userId) },
            update: {
              plan: plan as "FREE" | "STANDARD" | "PRO" | "ENTERPRISE",
              active: true,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            create: {
              userId: Number(userId),
              plan: plan as "FREE" | "STANDARD" | "PRO" | "ENTERPRISE",
              active: true,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await prisma.subscription.updateMany({
            where: { userId: Number(userId) },
            data: { active: false },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    res.status(500).json({ message: "Webhook processing error" });
  }
};