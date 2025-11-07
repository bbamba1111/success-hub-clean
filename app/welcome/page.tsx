"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="flex justify-center lg:justify-start mb-6">
                <img
                  src="/images/logo.png"
                  alt="Make Time For More Logo"
                  width={120}
                  height={120}
                  className="rounded-full shadow-lg"
                />
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Welcome to Make Time For More<sup className="text-2xl">™</sup>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  The Work-Life Balance Success Hub for ambitious women who refuse to choose between success and
                  wellbeing
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup" className="flex-1">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold text-lg py-6"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/login" className="flex-1">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069]/10 font-semibold text-lg py-6 bg-transparent"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hero-women-tea-cherry-blossoms-new.png"
                  alt="Diverse women enjoying tea together in cherry blossom garden"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Get Section */}
      <div className="bg-gradient-to-br from-[#F5F1E8] to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What You'll Experience Inside</h2>
            <p className="text-lg text-gray-600">Everything you need to transform your work-life balance</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="border-2 border-[#7FB069]/20 hover:border-[#7FB069] transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#7FB069]">Work-Life Balance Audit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Discover exactly where you stand across 15 key life areas and get personalized insights
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 border-[#E26C73]/20 hover:border-[#E26C73] transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#E26C73] to-[#7FB069] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#E26C73]">28-Day Transformation Cycles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Set powerful intentions and create your personalized 28-day transformation plan
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 border-[#7FB069]/20 hover:border-[#7FB069] transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#7FB069]">Cherry Blossom AI Co-Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  6 AI-powered co-guides for morning routines, workouts, lunch breaks, and more
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-2 border-[#E26C73]/20 hover:border-[#E26C73] transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#E26C73] to-[#7FB069] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#E26C73]">Live Co-Working Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Join Barbara and the community for non-negotiable co-working 4 days a week
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-2 border-[#7FB069]/20 hover:border-[#7FB069] transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#7FB069]">Wellness Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Monitor workout habits, sleep quality, and daily wellness practices</p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-2 border-[#E26C73]/20 hover:border-[#E26C73] transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#E26C73] to-[#7FB069] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#E26C73]">Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Connect with like-minded women on their work-life balance journey</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Make Time For More?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join women who are transforming their relationship with work and life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/auth/signup" className="flex-1">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold text-lg py-6"
              >
                Create Account
              </Button>
            </Link>
            <Link href="/auth/login" className="flex-1">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069]/10 font-semibold text-lg py-6 bg-transparent"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
