import Stripe from "stripe";

// Initialize server-side Stripe client
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-01-27.acacia" as any,
  typescript: true,
});

export interface CheckoutSessionParams {
  tierId: "premium" | "group";
  regionId: string;
  currency: string;
  amount: number;
  userEmail?: string;
  userId?: string;
  successUrl: string;
  cancelUrl: string;
}
