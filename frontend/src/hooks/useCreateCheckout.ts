'use client'

import { useMutation } from '@tanstack/react-query';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { apiPost } from '@/lib/api';
import { useAuth } from '@/providers/auth';
import { StripeCheckOutSessionRequest, StripeCheckOutSessionResponse } from '@/types/axios';

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
);

interface CheckoutResponse {
  sessionId: string;
}

export function useCreateCheckoutSession() {
  const { user } = useAuth()
      
  if (!user) return;

  return useMutation({
    mutationFn: async (plan: string): Promise<CheckoutResponse> => {

      const checkOutCredentials = {
        userId: user?.id,
        plan: plan
      }
      const res = await apiPost< StripeCheckOutSessionResponse, StripeCheckOutSessionRequest>(
        "/subscription/stripe/checkout", checkOutCredentials)
      if (!res.ok) throw new Error('Failed to create checkout session');
      
      return res.data;
    },
    onSuccess: async (data) => {
      const stripe = await stripePromise;
      if (!stripe) {
        console.error('Stripe not initialized');
        return;
      }

      const result = await stripe;
      console.log(data, result);

      // const result = await stripe.redirectToCheckout({
      //   sessionId: data.sessionId,
      // });

      // if (result.error) {
      //   console.error(result.error.message);
      // }
    },
  });
}
