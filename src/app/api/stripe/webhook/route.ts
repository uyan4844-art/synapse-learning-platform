import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: any;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error("Stripe Webhook signature error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle subscription activation
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const tierId = session.metadata?.tierId;

    if (userId && userId !== "anonymous") {
      try {
        const supabase = await createClient();
        await supabase.from("profiles").update({
          theme: tierId === "group" ? "group_premium" : "premium",
        }).eq("id", userId);
      } catch (err) {
        console.error("Failed to update profile subscription:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
