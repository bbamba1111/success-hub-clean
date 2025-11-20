"use client"

// 🎯 PAYMENT SUCCESS PAGE (SECURE VERSION WITH AUTH)
// Copy this to: app/success/page.tsx

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Sparkles, Calendar, ArrowRight, Loader2 } from "lucide-react";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [magicLink, setMagicLink] = useState<string | null>(null);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setIsVerifying(false);
      return;
    }

    // Verify payment and get magic link
    fetch('/api/verify-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setMagicLink(data.magicLink);
        }
        setIsVerifying(false);
      })
      .catch(err => {
        setError('Failed to verify payment');
        setIsVerifying(false);
      });
  }, [sessionId]);

  const handleAccessHub = () => {
    if (magicLink) {
      // Use magic link for instant authenticated access
      window.location.href = magicLink;
    } else {
      // Fallback to main site (they'll need to log in manually)
      window.location.href = 'https://success-hub-clean.vercel.app';
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#FDF9F5] to-white flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-2 border-[#5D9D61]/30">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#5D9D61]/20 to-[#E26C73]/20 mb-6">
              <Loader2 className="w-8 h-8 text-[#5D9D61] animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Verifying Your Payment...</h2>
            <p className="text-muted-foreground">Please wait while we set up your account.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#FDF9F5] to-white flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-2 border-red-300">
          <CardContent className="pt-12 text-center">
            <h2 className="text-2xl font-bold mb-2 text-red-600">Payment Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.href = '/'}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FDF9F5] to-white flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full border-2 border-[#5D9D61]/30 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#5D9D61]/20 to-[#E26C73]/20 mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-[#5D9D61]" />
          </div>
          <CardTitle className="text-4xl font-bold text-[#5D9D61] mb-3">
            Welcome to Monday Gateway! 🎉
          </CardTitle>
          <CardDescription className="text-xl">
            Your payment was successful. Your account is ready!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-[#F0F7F1] rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4 text-[#5D9D61]">What Happens Next?</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#5D9D61] text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <p className="text-muted-foreground">
                  Click the button below to access your Monday Gateway Hub (auto-login)
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#5D9D61] text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <p className="text-muted-foreground">
                  Check your email for your welcome message and calendar invites
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#5D9D61] text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <p className="text-muted-foreground">
                  Join us this Monday for your first live co-working experience!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#FCF2F3] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-6 h-6 text-[#E26C73]" />
              <h3 className="font-semibold text-lg text-[#E26C73]">Your Monday Schedule</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 9:00-10:30 AM EST: Morning GIV•EN™ Routine</li>
              <li>• 10:30-11:00 AM EST: 30-Minute Workday Workout</li>
              <li>• 11:00 AM-1:00 PM EST: Extended Hybrid Lunch</li>
              <li>• 1:00-5:00 PM EST: 4-Hour Focused CEO Workday</li>
              <li>• 9:00-10:00 PM EST: Power Down & Digital Detox</li>
            </ul>
          </div>

          <div className="text-center pt-4">
            <Button
              size="lg"
              onClick={handleAccessHub}
              className="text-xl px-12 py-6 bg-[#E26C73] hover:bg-[#E26C73]/90 text-white"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Access Your Monday Gateway Hub Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Questions? Email us at support@maketimeformore.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

