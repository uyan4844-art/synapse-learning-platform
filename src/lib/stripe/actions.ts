"use server";

import { stripe, type CheckoutSessionParams } from "./server";

/**
 * Server Action: Create regional Stripe Checkout Session
 */
export async function createCheckoutSessionAction(params: CheckoutSessionParams) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith("sk_test_placeholder")) {
      // In development mode when Stripe key is not yet set, simulate smooth redirection
      return {
        success: true,
        url: `${params.successUrl}?session_id=mock_session_${Date.now()}&tier=${params.tierId}`,
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: params.currency.toLowerCase(),
            product_data: {
              name: params.tierId === "group" ? "SYNAPSE Grup Planı (6 Kullanıcı)" : "SYNAPSE Premium Öğrenci",
              description: `Bölgesel indirimli aylık öğrenci aboneliği (${params.regionId.toUpperCase()})`,
            },
            unit_amount: Math.round(params.amount * 100),
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: params.userEmail,
      metadata: {
        userId: params.userId || "anonymous",
        tierId: params.tierId,
        regionId: params.regionId,
      },
      success_url: `${params.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl,
    });

    return { success: true, url: session.url };
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return { success: false, error: error.message || "Ödeme oturumu başlatılamadı." };
  }
}
