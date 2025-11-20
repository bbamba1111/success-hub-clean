// 🎯 VERIFY SESSION API ROUTE (SECURE VERSION)
// Copy this to: app/api/verify-session/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Get the magic link from temp storage
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('temp_access_tokens')
      .select('magic_link')
      .eq('session_id', sessionId)
      .single();

    if (tokenError) {
      console.error('Error fetching magic link:', tokenError);
      // Still return success but without magic link
      return NextResponse.json({
        success: true,
        customerEmail: session.customer_email || session.customer_details?.email,
        subscriptionId: session.subscription,
        magicLink: null, // User will need to log in manually
      });
    }

    // Delete the used token
    await supabaseAdmin
      .from('temp_access_tokens')
      .delete()
      .eq('session_id', sessionId);

    // Payment is valid and we have the magic link
    return NextResponse.json({
      success: true,
      customerEmail: session.customer_email || session.customer_details?.email,
      subscriptionId: session.subscription,
      magicLink: tokenData.magic_link,
    });
  } catch (error: any) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

