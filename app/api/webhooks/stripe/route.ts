// 🎯 STRIPE WEBHOOK HANDLER (SECURE VERSION WITH AUTH)
// Copy this to: app/api/webhooks/stripe/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

// Initialize Supabase Admin Client (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Admin key, NOT anon key
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    // SECURITY: Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('✅ Checkout completed:', session.id);

      // Get customer details
      const customerEmail = session.customer_email || session.customer_details?.email;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (!customerEmail) {
        console.error('❌ No customer email in session');
        break;
      }

      try {
        // STEP 1: Create Supabase Auth User
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: customerEmail,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            membership_tier: 'monday_gateway',
            stripe_customer_id: customerId,
          },
        });

        if (authError && authError.message !== 'User already registered') {
          console.error('❌ Error creating Supabase auth user:', authError);
          throw authError;
        }

        const userId = authData?.user?.id || (await supabaseAdmin.auth.admin.getUserByEmail(customerEmail)).data.user?.id;

        if (!userId) {
          throw new Error('Failed to get user ID');
        }

        // STEP 2: Upsert user profile in database
        const { error: upsertError } = await supabaseAdmin
          .from('users')
          .upsert({
            id: userId,
            email: customerEmail,
            membership_tier: 'monday_gateway',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: 'active',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id',
          });

        if (upsertError) {
          console.error('❌ Error upserting user profile:', upsertError);
          throw upsertError;
        }

        console.log('✅ Created/updated user:', customerEmail);

        // STEP 3: Generate magic link for instant access
        const { data: magicLinkData, error: magicLinkError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email: customerEmail,
          options: {
            redirectTo: 'https://success-hub-clean.vercel.app/monday-hub',
          },
        });

        if (magicLinkError) {
          console.error('❌ Error generating magic link:', magicLinkError);
        } else {
          console.log('✅ Generated magic link for:', customerEmail);
          
          // TODO: Send welcome email with magic link
          // await sendWelcomeEmail({
          //   email: customerEmail,
          //   magicLink: magicLinkData.properties.action_link,
          // });
          
          // For now, log the magic link (in production, send via email)
          console.log('🔗 Magic Link:', magicLinkData.properties.action_link);
        }

        // STEP 4: Store magic link temporarily for success page
        await supabaseAdmin
          .from('temp_access_tokens')
          .insert({
            session_id: session.id,
            user_id: userId,
            magic_link: magicLinkData?.properties.action_link,
            expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour
          });

      } catch (error) {
        console.error('❌ Supabase error:', error);
        // Don't return error - Stripe will retry webhook
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      
      console.log('📝 Subscription updated:', subscription.id);

      // Update subscription status in Supabase
      const { error } = await supabaseAdmin
        .from('users')
        .update({
          subscription_status: subscription.status,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);

      if (error) {
        console.error('❌ Error updating subscription status:', error);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      
      console.log('❌ Subscription cancelled:', subscription.id);

      // Revoke access in Supabase
      const { error } = await supabaseAdmin
        .from('users')
        .update({
          membership_tier: null,
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);

      if (error) {
        console.error('❌ Error revoking access:', error);
      }
      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

