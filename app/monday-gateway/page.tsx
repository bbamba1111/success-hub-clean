"use client"

// 🎯 MONDAY GATEWAY LANDING PAGE - SAMCART STYLE
// Copy this to: app/page.tsx in your new GitHub repo

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Calendar, Clock, Heart, Brain, Zap, Users, Target, TrendingUp } from "lucide-react";

export default function MondayGatewayLanding() {
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 17,
    hours: 12,
    minutes: 0,
    seconds: 0,
  });

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('2025-12-01T00:00:00');
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#FDF9F5] py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#5D9D61]">
            Make Time For More™ Monthly
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Start With Mondays
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your First Step to Experiencing a Life-First Business Rooted in Work-Life Balance, Time Freedom & Sustainable Success.
          </p>

          {/* Countdown Timer */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8 max-w-3xl mx-auto border-2 border-[#E26C73]">
            <p className="text-lg font-semibold mb-4 text-gray-700">
              Counting Down to The 1st Week of Work-Life Balance in December
            </p>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#E26C73]">{timeLeft.days}</div>
                <div className="text-sm text-gray-600">Days</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-[#E26C73]">{timeLeft.hours}</div>
                <div className="text-sm text-gray-600">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-[#E26C73]">{timeLeft.minutes}</div>
                <div className="text-sm text-gray-600">Mins</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-[#E26C73]">{timeLeft.seconds}</div>
                <div className="text-sm text-gray-600">Secs</div>
              </div>
            </div>
            <p className="text-base text-gray-700 mt-4 leading-relaxed">
              The 7-Day Work-Life Balance Reset Experience where You Reset Your Rhythms and Reclaim Your Time In One Powerful Week This Month!
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-gradient-to-br from-[#5D9D61] to-[#E26C73] text-white rounded-lg shadow-2xl p-8 max-w-2xl mx-auto mb-8">
            <p className="text-lg mb-2 line-through opacity-75">Regular Price: $2,500/month</p>
            <p className="text-3xl md:text-4xl font-bold mb-2">Founders Fee: $497/month</p>
            <p className="text-xl mb-6 font-semibold">(80% OFF • Limited to First 200 Members)</p>
            <p className="text-2xl font-semibold mb-6">Start With: Make Time For More On Mondays™</p>
            <p className="text-lg mb-6">Your easy entry into the full 28-Day Work-Life Balance Experience Cycle.</p>
            
            <Button
              size="lg"
              onClick={handleCheckout}
              disabled={isLoading}
              className="text-2xl px-12 py-8 bg-white text-[#E26C73] hover:bg-gray-100 shadow-2xl font-bold w-full md:w-auto"
              data-testid="button-join-monday-gateway-hero"
            >
              {isLoading ? 'Processing...' : 'Plug In — $497/mo'}
            </Button>
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#5D9D61]">
            Who This Is For
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-[#E26C73]/30">
              <CardContent className="pt-6">
                <div className="flex gap-3 mb-4">
                  <Check className="w-6 h-6 text-[#5D9D61] flex-shrink-0 mt-1" />
                  <p className="text-lg">Founders and entrepreneurs who left the 9-to-5 for freedom—ready to actually live it</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#5D9D61]/30">
              <CardContent className="pt-6">
                <div className="flex gap-3 mb-4">
                  <Check className="w-6 h-6 text-[#5D9D61] flex-shrink-0 mt-1" />
                  <p className="text-lg">Leaders who want balance and business success</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#E26C73]/30">
              <CardContent className="pt-6">
                <div className="flex gap-3 mb-4">
                  <Check className="w-6 h-6 text-[#5D9D61] flex-shrink-0 mt-1" />
                  <p className="text-lg">High-achievers done with burnout, ready for a life-first model</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#5D9D61]/30">
              <CardContent className="pt-6">
                <div className="flex gap-3 mb-4">
                  <Check className="w-6 h-6 text-[#5D9D61] flex-shrink-0 mt-1" />
                  <p className="text-lg">Growth-stage entrepreneurs choosing sustainable over sacrificial</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* MEET BARBARA */}
      <section className="py-16 px-6 bg-[#F0F7F1]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4 text-[#E26C73]">
                Hi, I'm Thought Leader Barbara
              </h2>
              <p className="text-lg font-semibold mb-4 text-gray-700">
                Work-Life Balance Mentor • Co-Working Guide • Accountability Partner
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                I'm here to help you reconnect to your original entrepreneurial intentions and prioritize what matters most to you — because I know…
              </p>
              <p className="text-2xl font-bold text-[#5D9D61] leading-relaxed">
                You didn't leave your high-stress role to recreate burnout in your business —
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE TRUTH */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-[#E26C73]">
            But, It's Not Your Fault...
          </h2>
          <p className="text-2xl font-bold mb-8 text-gray-900">The Truth???</p>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed text-left">
            <p>
              You left the high-stress job — but... you didn't leave hustle culture.
              <br />
              <strong>You brought it with you.</strong>
            </p>

            <p>
              You inherited a broken blueprint —
              one built for corporate survival, not entrepreneurial fulfillment.
            </p>

            <p>
              A model that rewards exhaustion, glorifies over-effort,
              and quietly demands that you sacrifice everything that makes life worth living.
            </p>

            <p>
              And those ingrained hustle habits?
              <br />
              They're still running the show — keeping you from the peace, presence, and prosperity you started your business for.
            </p>

            <p className="text-2xl font-bold text-[#5D9D61]">
              Until Now…
            </p>
          </div>
        </div>
      </section>

      {/* SPIRITUAL & SCIENTIFIC SIDE */}
      <section className="py-16 px-6 bg-[#FCF2F3]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#5D9D61]">
            Tap Into The Spiritual & Scientific Side of Life & Business Success
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Spiritual Side */}
            <Card className="border-2 border-[#5D9D61]/30">
              <CardHeader>
                <CardTitle className="text-2xl text-[#5D9D61]">The Spiritual Side</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Everything you desire — already exists in energetic form. You just have to learn how to build inside it.
                </p>
                <p>
                  At Make Time For More™, we combine spiritual alignment with scientific habit-building so you can retrain your mind, body, life and business to operate in the same frequency as the life you're calling in.
                </p>
                <p>
                  You begin by "ASKING" aka planting your spiritual seed: your 28-Day Desired Work-Lifestyle Intention — inspired by <strong>Matthew 7:7: "Ask, and it shall be GIVEN to you."</strong>
                </p>
                <p>
                  Through the <strong>GIV•EN™ Framework</strong> — Gratitude, Invitation, Vision, Embody, Nurture — you nurture that intention (spiritual seed) daily, aligning your energy, emotions, and actions with divine rhythm.
                </p>
                <p className="font-semibold">
                  This is the spiritual practice of co-creation — where faith, frequency, and focus converge to magnetize your desired reality.
                </p>
              </CardContent>
            </Card>

            {/* Scientific Side */}
            <Card className="border-2 border-[#E26C73]/30">
              <CardHeader>
                <CardTitle className="text-2xl text-[#E26C73]">The Scientific Side</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  While the spiritual work activates your higher energy, the science makes your transformation tangible.
                </p>
                <p>
                  Through neuroscience, habit science, hormonal regulation, and quantum alignment, you'll rewire the physiological patterns that fuel stress, scarcity, and survival.
                </p>
                <p>
                  Each practice in the Work-Life Balance Business Model™ and SOP is designed to regulate your nervous system, retrain your Reticular Activating System (RAS) for focus and flow, and balance your hormones for sustainable energy and clarity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6 INGRAINED HUSTLE HABITS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-[#E26C73]">
            The Six Ingrained Hustle Habits We Replace
          </h2>
          <p className="text-2xl text-center font-semibold mb-12 text-[#5D9D61]">
            Every Monday, you practice the cure.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#5D9D61] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="text-lg"><strong className="text-[#E26C73]">Waking up reactive</strong> → Morning GIV•EN™ Routine</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#5D9D61] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="text-lg"><strong className="text-[#E26C73]">Sitting all day on caffeine</strong> → 30-min movement window</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#5D9D61] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="text-lg"><strong className="text-[#E26C73]">Skipping lunch</strong> → Extended Healthy Hybrid Lunch</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#5D9D61] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="text-lg"><strong className="text-[#E26C73]">Working endlessly</strong> → 4-hour Focused CEO Workday (stop at 5 PM)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#5D9D61] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                5
              </div>
              <div>
                <p className="text-lg"><strong className="text-[#E26C73]">Delaying joy</strong> → Quality of Lifestyle Experiences</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#5D9D61] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                6
              </div>
              <div>
                <p className="text-lg"><strong className="text-[#E26C73]">Pushing through exhaustion</strong> → Power Down & Unplug</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - CONTINUED IN PART 2 due to length */}
    </div>
  );
}

