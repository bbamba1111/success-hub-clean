// 🎯 STRIPE CHECKOUT API ROUTE (SECURE VERSION)
// Copy this to: app/api/create-checkout-session/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with CORRECT API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia', // Use valid API version
});

export async function POST(req: NextRequest) {
  try {
    // SECURITY: Use server-side env vars ONLY - never trust client input!
    const priceId = process.env.STRIPE_MONDAY_PRICE_ID!;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.headers.get('origin');

    if (!priceId) {
      throw new Error('STRIPE_MONDAY_PRICE_ID environment variable is not set');
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // Recurring subscription
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Server-controlled price ID
          quantity: 1,
        },
      ],
      // Server-controlled URLs
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}`,
      allow_promotion_codes: true, // Allow discount codes
      billing_address_collection: 'required',
      customer_email: undefined, // Let customer enter email
      metadata: {
        membership_tier: 'monday_gateway',
      },
      subscription_data: {
        metadata: {
          membership_tier: 'monday_gateway',
        },
        trial_period_days: 0, // No trial
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

