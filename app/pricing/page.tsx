"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowLeft, Sparkles, Target, Users, Calendar } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "month",
      description: "Perfect for individuals starting their work-life balance journey",
      features: [
        "Work-Life Balance Audit",
        "Basic 28-Day Plan",
        "Email Support",
        "Progress Tracking",
        "Mobile App Access",
      ],
      popular: false,
      cta: "Start Free Trial",
      color: "border-gray-200",
    },
    {
      name: "Transform",
      price: "$79",
      period: "month",
      description: "Comprehensive transformation with AI guidance and community support",
      features: [
        "Everything in Starter",
        "Cherry Blossom AI Assistant",
        "Personalized Coaching",
        "Community Access",
        "Weekly Group Sessions",
        "Advanced Analytics",
        "Priority Support",
      ],
      popular: true,
      cta: "Start Transformation",
      color: "border-[#7FB069]",
    },
    {
      name: "Mastery",
      price: "$149",
      period: "month",
      description: "Complete mastery program with 1-on-1 coaching and exclusive resources",
      features: [
        "Everything in Transform",
        "1-on-1 Coaching Sessions",
        "Custom Meal Plans",
        "Exclusive Workshops",
        "VIP Community Access",
        "Quarterly Reviews",
        "Lifetime Access to Resources",
      ],
      popular: false,
      cta: "Achieve Mastery",
      color: "border-[#E26C73]",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      content:
        "The Transform plan completely changed how I approach work-life balance. The AI assistant is like having a personal coach available 24/7.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Entrepreneur",
      content:
        "I was skeptical at first, but the personalized approach and community support made all the difference. Worth every penny.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Working Mom",
      content:
        "Finally found a program that understands the real challenges of balancing career and family. The results speak for themselves.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="inline-flex items-center text-[#7FB069] hover:text-[#6FA055] mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">Choose Your Transformation Path</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Invest in yourself with a plan designed to create lasting change in your work-life balance. Start with our
            free audit, then choose the level of support that fits your goals.
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <Badge className="bg-[#7FB069]/20 text-[#7FB069] px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              Personalized Approach
            </Badge>
            <Badge className="bg-[#E26C73]/20 text-[#E26C73] px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Community Support
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              28-Day Guarantee
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative ${plan.color} ${plan.popular ? "ring-2 ring-[#7FB069] shadow-xl scale-105" : "shadow-lg"} transition-all duration-300 hover:shadow-xl`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-[#7FB069] text-white px-6 py-2 text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7FB069] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-3 font-semibold ${
                    plan.popular
                      ? "bg-[#7FB069] hover:bg-[#6FA055] text-white"
                      : "bg-white border-2 border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069] hover:text-white"
                  } transition-all duration-300`}
                >
                  {plan.cta}
                </Button>

                {index === 0 && (
                  <p className="text-center text-xs text-gray-500">7-day free trial • No credit card required</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">What's Included</CardTitle>
            <p className="text-gray-600">Compare features across all plans</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Features</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Starter</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Transform</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Mastery</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    "Work-Life Balance Audit",
                    "28-Day Transformation Plan",
                    "Mobile App Access",
                    "Cherry Blossom AI Assistant",
                    "Community Access",
                    "Weekly Group Sessions",
                    "1-on-1 Coaching",
                    "Custom Meal Plans",
                    "VIP Community",
                  ].map((feature, index) => (
                    <tr key={feature}>
                      <td className="py-4 px-4 text-gray-700">{feature}</td>
                      <td className="text-center py-4 px-4">
                        {index < 3 ? (
                          <Check className="w-5 h-5 text-[#7FB069] mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {index < 6 ? (
                          <Check className="w-5 h-5 text-[#7FB069] mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        <Check className="w-5 h-5 text-[#7FB069] mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Our Members Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing
                    cycle.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                  <p className="text-gray-600 text-sm">
                    The Starter plan includes a 7-day free trial. No credit card required to start.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What if I'm not satisfied?</h3>
                  <p className="text-gray-600 text-sm">
                    We offer a 28-day money-back guarantee on all plans. If you're not completely satisfied, we'll
                    refund your payment.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How does the AI assistant work?</h3>
                  <p className="text-gray-600 text-sm">
                    Cherry Blossom AI learns from your audit results and provides personalized guidance, daily
                    check-ins, and answers to your questions 24/7.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Is my data secure?</h3>
                  <p className="text-gray-600 text-sm">
                    Absolutely. We use enterprise-grade security and never share your personal information with third
                    parties.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes, you can cancel your subscription at any time. You'll continue to have access until the end of
                    your current billing period.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Life?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already discovered the secret to sustainable work-life balance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white px-8 py-4 text-lg font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Audit
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069] hover:text-white px-8 py-4 text-lg font-semibold bg-transparent"
              >
                Schedule a Call
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">No commitment required • Start your transformation today</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
