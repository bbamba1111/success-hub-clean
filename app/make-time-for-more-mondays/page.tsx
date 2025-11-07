"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"
import CountdownTimer from "@/components/countdown-timer"
import Link from "next/link"
import Image from "next/image"

export default function MakeTimeForMoreMondaysPage() {
  const [targetDate, setTargetDate] = useState<Date>()

  // Set target date to next Monday at 9 AM EST
  useEffect(() => {
    const getNextMonday = () => {
      const now = new Date()
      const nextMonday = new Date()
      const daysUntilMonday = (1 + 7 - now.getDay()) % 7 || 7
      nextMonday.setDate(now.getDate() + daysUntilMonday)
      nextMonday.setHours(9, 0, 0, 0) // 9 AM
      return nextMonday
    }

    setTargetDate(getNextMonday())
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={120}
              height={120}
              className="rounded-full shadow-lg"
            />
          </div>
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Calendar className="mr-2 h-4 w-4" />
            Weekly Community Call
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Make Time For More Mondays</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our weekly community call every Monday at 9 AM EST for intention setting, accountability, and
            connection with like-minded individuals on their work-life balance journey.
          </p>

          {/* Large centered people image under subtitle */}
          <div className="mb-12">
            <Image
              src="/images/sunday-shift-people-celebration.png"
              alt="Diverse group of people celebrating and making the Sunday shift"
              width={800}
              height={500}
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mb-12">
          <CountdownTimer targetDate={targetDate} />
        </div>

        {/* What to Expect */}
        <Card className="mb-12 max-w-4xl mx-auto border-2 border-purple-200 bg-white/90">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-800 mb-4">What to Expect</CardTitle>
            <CardDescription className="text-lg">
              Every Monday, we come together to start the week with intention and purpose
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Weekly Intention Setting</h4>
                    <p className="text-gray-600">
                      Set clear, actionable intentions for the week ahead using proven frameworks
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Community Connection</h4>
                    <p className="text-gray-600">
                      Connect with others who are committed to improving their work-life balance
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Accountability Check-ins</h4>
                    <p className="text-gray-600">Share wins, challenges, and get support from the community</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-pink-100 rounded-full">
                    <Clock className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Time Management Tips</h4>
                    <p className="text-gray-600">Learn practical strategies for making time for what matters most</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Sparkles className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Mindfulness Moments</h4>
                    <p className="text-gray-600">Start your week with grounding exercises and mindful reflection</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <ArrowRight className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Action Planning</h4>
                    <p className="text-gray-600">Leave with concrete steps to implement throughout your week</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call Details */}
        <Card className="mb-12 max-w-2xl mx-auto border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-800 mb-4">Call Details</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Every Monday</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">9:00 AM EST</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">60 minutes</span>
            </div>
            <Badge variant="outline" className="mt-4 px-4 py-2 text-base">
              Free for Community Members
            </Badge>
          </CardContent>
        </Card>

        {/* CTA Section with Image */}
        <div className="text-center mb-12">
          <Card className="max-w-4xl mx-auto border-2 border-[#E26C73] bg-gradient-to-r from-pink-50 to-purple-50">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Us Live</h2>
                  <p className="text-gray-600 mb-6">
                    Ready to make the Sunday shift? Join our supportive community and start your week with intention,
                    connection, and purpose.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>No more grinding into the week</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Ease into Monday with harmony and intention</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Connect with like-minded entrepreneurs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Start your week fully aligned with your values</span>
                    </li>
                  </ul>
                  <Button
                    size="lg"
                    className="bg-[#E26C73] hover:bg-[#D55A60] text-white px-8 py-4 text-lg font-semibold w-full sm:w-auto"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Join Next Monday's Call
                  </Button>
                  <div className="text-sm text-gray-500 mt-4">Registration link will be sent via email</div>
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/images/sunday-shift-no-grinding.png"
                    alt="No more grinding into the week - ease into it harmonized, intentional, and fully aligned"
                    width={400}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/">
            <Button variant="outline" className="text-gray-600 hover:text-gray-800 bg-transparent">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Make Time For More On Mondays</h1>
        <h2 className="text-xl md:text-2xl text-gray-700 mb-8">
          Start Your Week In Harmony, Instead of Dread & Hustle Energy
        </h2>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Counting Down to The 1st Week of Work-Life Balance in September
          </h3>
          <CountdownTimer targetDate={targetDate} />
        </div>

        <p className="text-lg mb-8 max-w-4xl mx-auto">
          The 7-Day Work-Life Balance Reset Experience where You Reset Your Rhythms and Reclaim Your Time In One
          Powerful Week This Month!
        </p>

        <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 text-lg">
          Enroll Today $197/Month
        </Button>
      </div>

      {/* Introduction Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">
              Join the First Ever Work-Life Balance Co-Working Membership For Women Entrepreneurs Ready to DISRUPT THE
              HUSTLE & Start "Living" Your Desired Work-Lifestyle
            </h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              <Image
                src="/images/barbara-portrait.jpg"
                alt="Barbara Portrait"
                width={200}
                height={200}
                className="rounded-full"
              />
              <div className="text-left max-w-2xl">
                <p className="text-lg">
                  Hi, I am Thought Leader Barbara: Your Work-Life Balance Mentor, Co-Working Guide and Accountability
                  Partner for This Journey. I am here to help you, personally and collectively reconnect to your
                  original entrepreneurial intentions, because I know...
                </p>
              </div>
            </div>
          </div>

          <Card className="max-w-4xl mx-auto mb-12">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6">
                You Didn't Leave Your High-Stress Role to Recreate Burnout In Your Business —
              </h3>
              <p className="text-lg text-center mb-6">
                You left for work-life balance, time-freedom and success on your terms. But, somewhere along the way,
                those unhealthy hustle habits crept in —
              </p>
              <h4 className="text-xl font-semibold text-center mb-4">But, It's Not Your Fault...</h4>
            </CardContent>
          </Card>

          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6">The Truth???</h3>
            <div className="text-left space-y-4 mb-8">
              <p>You left the high-stress job... BUT,</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You didn't leave hustle culture.</li>
                <li>You brought it with you.</li>
                <li>
                  You inherited a broken blueprint that was designed for corporate survival, not entrepreneurial
                  fulfillment.
                </li>
                <li>
                  You adopted a business model that requires you to sacrifice everything that makes life worth living.
                </li>
              </ul>
              <p className="font-semibold">And those ingrained hustle habits...???</p>
              <p>
                They're keeping you from enjoying the work-life balance, time-freedom & the success you started your
                business for.
              </p>
              <p>
                You like many ambitious women who leave corporate, "were never taught" how to set up your business in a
                way that honors your time, energy, values and freedom.
              </p>
              <p className="text-xl font-bold">-- UNTIL NOW...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monday Focus Section */}
      <div className="bg-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Why We Start With Mondays: The Gateway to Work-Life Balance</h2>
            <p className="text-lg max-w-4xl mx-auto mb-8">
              Monday is where your work-life balance journey begins. It's the day that sets the tone for your entire
              week. Instead of Sunday scaries and Monday dread, you'll experience Sunday excitement and Monday magic.
              <strong> This is where we start everyone on their work-life balance transformation.</strong>
            </p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-8">
                Introducing the Make Time For More On Mondays Membership
              </h3>

              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-4">
                  Your Monthly Monday Cycle: What Happens on Each of the 3 Mondays
                </h4>

                <div className="space-y-6">
                  <div className="border-l-4 border-pink-500 pl-6">
                    <h5 className="font-bold text-lg mb-2">
                      Monday #1: Foundation Monday - "Setting Your Weekly Intention"
                    </h5>
                    <p className="mb-2">
                      Start your cycle by establishing your work-life balance foundation for the week ahead.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Morning GIV•EN™ Routine (9:00-10:30 AM)</li>
                      <li>30-Minute Workday Workout (10:30-11:00 AM)</li>
                      <li>Extended Healthy Hybrid Lunch Break (11:00 AM-1:00 PM)</li>
                      <li>4-Hour Focused CEO Workday (1:00-5:00 PM)</li>
                      <li>Evening Power Down & Unplug Digital Detox (9:00-10:00 PM)</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-pink-500 pl-6">
                    <h5 className="font-bold text-lg mb-2">Monday #2: Momentum Monday - "Deepening Your Practice"</h5>
                    <p className="mb-2">Build on your foundation and deepen your work-life balance practices.</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Refined Morning GIV•EN™ Routine with community accountability</li>
                      <li>Personalized workout window based on your energy patterns</li>
                      <li>Mindful lunch break with intention-setting for the afternoon</li>
                      <li>Strategic CEO work focused on your highest-impact tasks</li>
                      <li>Reflection and planning during evening wind-down</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-pink-500 pl-6">
                    <h5 className="font-bold text-lg mb-2">Monday #3: Mastery Monday - "Integration & Preparation"</h5>
                    <p className="mb-2">Master your new rhythm and prepare for your upcoming vacation week.</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Confident execution of your personalized morning routine</li>
                      <li>Self-directed workout and wellness practices</li>
                      <li>Strategic lunch planning for sustainable energy</li>
                      <li>High-level CEO work with clear boundaries</li>
                      <li>Preparation for your week of rest and renewal</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-gray-400 pl-6">
                    <h5 className="font-bold text-lg mb-2">Week #4: Integration & Renewal Week</h5>
                    <p className="mb-2">
                      No Monday sessions - time for complete rest, reflection, and planning your next cycle.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Reflect on your 3-Monday transformation</li>
                      <li>Provide feedback on your experience</li>
                      <li>Plan your next 28-day cycle</li>
                      <li>Decide if you want to upgrade to 1-week, 2-week, or 3-week experiences</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-pink-100 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-4">
                  Our Work-Life Balance Co-Working Experience is intentionally structured with:
                </h4>
                <ul className="space-y-2">
                  <li>✓ Start your week in harmony instead of hustle energy</li>
                  <li>✓ Work a 4-hour focused workday instead of an endless 12-hour marathon</li>
                  <li>✓ 152-hours of weekly time freedom when you join us weekly</li>
                  <li>✓ 15-Core Life Value Areas to harmonize work & life</li>
                  <li>✓ A Morning success routine instead of reactive phone-checking</li>
                  <li>✓ A Workout window to help you move your body instead of being sedentary all day</li>
                  <li>✓ An Extended healthy hybrid lunch break instead of skipping meals</li>
                  <li>✓ Immersing yourself in Quality of Lifestyle Experiences instead of waiting for "someday"</li>
                  <li>✓ An evening wind-down routine to help you get 8 hours of sleep</li>
                  <li>✓ Built-in boundaries that protect your personal time</li>
                  <li>✓ Clear start/stop times that model healthy habits</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Onboarding Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How To Start Your Journey?</h2>

          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Complete Your 2-Part (Mandatory) Onboarding Experience</h3>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Part 1: Take Your FREE Work-Life Balance Audit</h4>
                    <p className="text-sm text-gray-600 mb-4">Monday OR Wednesday | 6:00 to 8:30 PM ET</p>
                    <p className="mb-4">
                      Discover exactly where you stand across 15 Core Life Value Areas with our comprehensive
                      assessment. Get personalized insights, identify your work-life imbalances and your biggest
                      opportunities for growth.
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>A comprehensive 15-question assessment</li>
                      <li>Assess your work-life balance over the past 30 days</li>
                      <li>Instant baseline and personalized scores in all 15 areas</li>
                      <li>Quick course correction tips you can apply starting today!</li>
                      <li>
                        For deeper insights, review your audit results with Cherry Blossom our AI Powered Work-Life
                        Balance Co-Guide
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold mb-4">
                      Part 2: Set Your 28-Day Desired Work-Lifestyle Intention
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Tuesday OR Thursday | 6:00 to 8:30 PM ET</p>
                    <p className="mb-4">This is where everything shifts.</p>
                    <p className="mb-4">
                      The missing piece in your business isn't another strategy—it's spiritual alignment. Instead of
                      forcing outcomes through hustle and grind, you'll partner with YOUR CREATOR and "Tap Into The
                      Spiritual Side of Life & Business" using our proprietary GIV*EN Framework - a "spirit-to-reality"
                      success creation routine inspired by Matthew 7:7 and Dr. Joe Dispenza's quantum physics research.
                    </p>
                    <p className="mb-4">In this onboarding session you will:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Transform your Audit insights into a powerful, actionable intention.</li>
                      <li>Choose 1-3 of your low scoring focus areas</li>
                      <li>
                        Let Cherry Blossom guide you through creating your personalized 28-day desired work-lifestyle
                        intention.
                      </li>
                      <li>Ground your intention in collective unison with the group</li>
                    </ul>
                    <p className="mt-4 font-semibold">
                      The GIV*EN Framework becomes your repeatable rhythm for maintaining a high vibrational frequency.
                      It replaces reactive habits, overworking, burnout loops, and survival-mode thinking.
                    </p>
                    <p className="font-semibold">This is co-creation in action.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Then... Join The Sunday Kick-Off Celebration @ 1:PM ET</h3>
                <p className="text-lg mb-4">Your 1-Hour Community Connection to Celebrate The Week Ahead</p>
                <p className="mb-4">
                  Every Sunday, we gather for one focused hour to connect as a community and celebrate your desired
                  work-lifestyle for the upcoming week.
                </p>
                <h4 className="font-semibold mb-2">What Happens During Your Sunday Kick-Off:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Meet Your Cohort Members - Connect with other women entrepreneurs on the same journey</li>
                  <li>Review Your Schedule - Go over the week ahead for your 1-Day or 1-Week Experience</li>
                  <li>Recite the weekly affirmation for the week</li>
                  <li>Last-Minute Housekeeping - Handle any logistics before Monday co-working begins</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Daily Schedule Section */}
      <div className="bg-pink-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            ...and FINALLY on the 1st, 2nd, & 3rd Monday...
            <br />
            Start Co-Working Your NEW 9-to-5 & Night Time Non-Negotiables with Me
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src="/images/cherry.png"
                  alt="Prayer hands with cherry blossom"
                  width={80}
                  height={80}
                  className="mx-auto mb-4"
                />
                <h3 className="font-bold mb-2">Morning GIV•EN™ Routine</h3>
                <p className="text-sm text-gray-600">Monday - Thursday 9:00 AM to 10:30 AM EST</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src="/images/cherry.png"
                  alt="Woman doing yoga with cherry blossoms"
                  width={80}
                  height={80}
                  className="mx-auto mb-4"
                />
                <h3 className="font-bold mb-2">30-Minute Workday Workout Window</h3>
                <p className="text-sm text-gray-600">Monday - Thursday 10:30 AM to 11:00 AM EST</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src="/images/cherry.png"
                  alt="Healthy salad bowl with cherry blossom"
                  width={80}
                  height={80}
                  className="mx-auto mb-4"
                />
                <h3 className="font-bold mb-2">Extended Healthy Hybrid Lunch Break</h3>
                <p className="text-sm text-gray-600">Monday - Thursday 11:00 AM to 1:00 PM EST</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src="/images/cherry.png"
                  alt="Woman presenting on laptop with cherry blossom"
                  width={80}
                  height={80}
                  className="mx-auto mb-4"
                />
                <h3 className="font-bold mb-2">4-Hour Focused CEO Workday</h3>
                <p className="text-sm text-gray-600">Monday - Thursday 1:00 PM to 5:00 PM EST</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src="/images/cherry.png"
                  alt="Family vacation with palm tree and cherry blossom"
                  width={80}
                  height={80}
                  className="mx-auto mb-4"
                />
                <h3 className="font-bold mb-2">Quality of Life Experiences</h3>
                <p className="text-sm text-gray-600">Evenings and Weekends</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src="/images/cherry.png"
                  alt="Moon and stars with cherry blossom"
                  width={80}
                  height={80}
                  className="mx-auto mb-4"
                />
                <h3 className="font-bold mb-2">Power Down & Unplug Digital Detox</h3>
                <p className="text-sm text-gray-600">Monday - Thursday 9:00 PM to 10:00 PM EST</p>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-4xl mx-auto mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6">
                Our 9-to-5 & Night Time Non-Negotiables Co-Working Schedule
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold">9:00 AM - 10:30 AM</span>
                  <span>Morning GIV•EN™ Routine</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold">10:30 AM - 11:00 AM</span>
                  <span>30-Minute Workday Workout</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold">11:00 AM - 1:00 PM</span>
                  <span>Extended Healthy Hybrid Lunch Break</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold">1:00 PM - 5:00 PM</span>
                  <span>4-Hour Focused CEO Workday</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold">Evenings & Weekends</span>
                  <span>12 Curated Quality of Lifestyle Experiences</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">9:00 PM - 10:00 PM</span>
                  <span>Power Down & Unplug Digital Detox</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg mb-6">
              Most co-working spaces keep their 'rooms' open around the clock - encouraging members to work at 2 AM,
              sacrifice sleep, and stay 'always on.' This creates a false sense of productivity while actually enabling
              the very workaholic patterns you left corporate to escape.
            </p>
            <p className="text-lg mb-8">
              At Make Time For More™, our Non-Negotiable Co-Working Sessions are foundational to transforming your
              work-life balance.
            </p>

            <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 text-lg">
              Enroll Today $197/Month
            </Button>
          </div>
        </div>
      </div>

      {/* Habits We're Breaking Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">The Unhealthy Hustle Habits We'll Be Breaking</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Waking up reactive: Phone in hand before feet hit the floor</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Being sedentary: All day at computer, hunched over in pain</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Being A Stranger to Your Family: Missing out on precious moments</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>The Sleep-Deprivation: Up until 2 AM, surviving on 3-5 hours sleep</span>
              </li>
            </ul>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Feeling Irritable & Reactive with your family and team members</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Living in Entrepreneurial Isolation: Working alone, carrying all decisions solo</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Neglecting Your Health: Ignoring symptoms, treating your body like a machine</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>The House of Cards You've Built: Can't vacation - everything falls apart without you</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Daily Practices Section */}
      <div className="bg-pink-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            If You're Ready to Disrupt The Hustle...
            <br />
            Here's Exactly What We'll Be Doing Together
          </h2>

          <p className="text-xl text-center mb-12 max-w-4xl mx-auto">
            The Top 5%'s Proven Daily Practices That Break Hustle Habits
            <br />— Backed By Science + Designed For Your Well-Being & Sustainability
          </p>

          <div className="space-y-12 max-w-4xl mx-auto">
            {/* Morning Routine */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Start You Day with Our Morning GIV•EN™ Routine | 9 -10:30 AM
                </h3>
                <div className="space-y-4">
                  <p>
                    <strong>The Experience:</strong> Ground in gratitude, visualization, and intention-setting to shift
                    from survival mode to creation mode.
                  </p>
                  <p>
                    <strong>Habit We're Breaking:</strong> Waking up reactive and jumping straight into work & "Go Mode"
                  </p>
                  <p>
                    <strong>The Science:</strong> Neuroscience + Physiology Train your brain to create from clarity —
                    not stress.
                  </p>
                  <p>
                    <strong>The Hormonal Benefits:</strong> Regulates morning cortisol spikes, reducing overwhelm and
                    anxiety.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Workout */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Get Moving In Our 30-Min Workday Workout Window | 10:30 - 11:AM
                </h3>
                <div className="space-y-4">
                  <p>
                    <strong>The Experience:</strong> Move your body to reset your energy, boost focus, and support
                    hormonal health.
                  </p>
                  <p>
                    <strong>Habit We're Breaking:</strong> Sitting all day and relying on caffeine for energy.
                  </p>
                  <p>
                    <strong>The Science:</strong> Hormone Support + Energy Activation Short bursts of movement enhance
                    focus, reduce fatigue, and reset your energy.
                  </p>
                  <p>
                    <strong>The Hormonal Benefits:</strong> Regulates morning cortisol spikes, reducing overwhelm and
                    anxiety.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Lunch Break */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Take An Extended Healthy Hybrid Lunch Break | 11:AM - 1:PM</h3>
                <div className="space-y-4">
                  <p>
                    <strong>The Experience:</strong> Pause to nourish yourself and break generational burnout patterns.
                  </p>
                  <p>
                    <strong>Habit We're Breaking:</strong> Skipping meals, working through lunch, or eating mindlessly.
                  </p>
                  <p>
                    <strong>The Science:</strong> Epigenetics + Hormone Nourishment Your habits shape your health — and
                    your legacy.
                  </p>
                  <p>
                    <strong>The Hormonal Benefits:</strong> Stabilizes blood sugar, supports digestion, and reduces
                    cortisol-driven cravings.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CEO Workday */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Work A 4-Hour Focused CEO Workday | 1 - 5:PM</h3>
                <div className="space-y-4">
                  <p>
                    <strong>The Experience:</strong> Work on your business — not just in it — by focusing on
                    high-impact, needle-moving tasks.
                  </p>
                  <p>
                    <strong>Habit We're Breaking:</strong> Staying "busy" without making real progress and over-working
                    in your business.
                  </p>
                  <p>
                    <strong>The Science:</strong> Productivity Science + Quantum Physics Do less — but do it with focus,
                    intention, and elevated energy.
                  </p>
                  <p>
                    <strong>The Hormonal Benefits:</strong> Prevents adrenal fatigue by working in intentional sprints —
                    not all-day output.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quality of Life */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Immerse Yourself In Quality of Lifestyle Experiences</h3>
                <div className="space-y-4">
                  <p>
                    <strong>The Experience:</strong> Immerse yourself in joy, creativity, and connection — this is the
                    real wealth.
                  </p>
                  <p>
                    <strong>Habit We're Breaking:</strong> Waiting for "someday" to enjoy life.
                  </p>
                  <p>
                    <strong>The Science:</strong> Co-Creation + Feminine Flow Practices Joy, rest, and play elevate your
                    frequency and well-being.
                  </p>
                  <p>
                    <strong>The Hormonal Benefits:</strong> Boosts oxytocin (the connection hormone), reduces stress,
                    and increases joy.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Wind Down */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Wind-Down with Our Power Down & Unplug Digital Detox | 9-10:PM
                </h3>
                <div className="space-y-4">
                  <p>
                    <strong>The Experience:</strong> Create a healthy evening wind-down routine and end your day with
                    screen-free reflection and relaxation.
                  </p>
                  <p>
                    <strong>Habit We're Breaking:</strong> Pushing through exhaustion, staying "on" 24/7 — up all night
                    working or scrolling, thinking sleep is something you can sacrifice.
                  </p>
                  <p>
                    <strong>The Science:</strong> Nervous System Regulation + Melatonin Support Calm your nervous system
                    to prepare for restorative sleep.
                  </p>
                  <p>
                    <strong>The Hormonal Benefits:</strong> Supports melatonin production for deep sleep and overnight
                    hormone repair.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Give Us Your Feedback & Testimonials During Your Vacation Week
                </h3>
                <div className="space-y-4">
                  <p>
                    <strong>What We Do:</strong> Reflect on progress, celebrate wins, and plan next steps.
                  </p>
                  <p>
                    <strong>Why We Do It:</strong> Measure your transformation and solidify lasting change.
                  </p>
                  <p>
                    <strong>Habit We're Breaking:</strong> Moving on without celebrating or learning from the journey
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Real-Time Support to Guide Your Experience</h2>
          <p className="text-xl text-center mb-12 max-w-4xl mx-auto">
            You're not navigating this transformation alone—you're supported by a community, structured systems, and
            expert mentorship every step of the way.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-4">AI-Powered Guidance:</h3>
                <p>
                  Utilize Cherry Blossom, your personalized Work-Life Balance AI Powered Co-Guide, for daily alignment
                  and planning.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-4">Private Facebook Community:</h3>
                <p>
                  Connect with like-minded women for support, progress sharing, and to combat entrepreneurial isolation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-4">Success Hub Access:</h3>
                <p>
                  Navigate your journey with ease using the centralized Make Time For More™ Success Hub, housing all
                  essential resources.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Investment Section */}
      <div className="bg-pink-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            All You Have to Do is Plug Your Workday Into Our Work-Life Balance Co-Working Schedule
          </h2>
          <p className="text-xl text-center mb-12 max-w-4xl mx-auto">
            That's it. Choose Your Level of Commitment - No Contract Required. Just show up to our structured co-working
            sessions and let the rhythm transform your life.
          </p>

          <Card className="max-w-4xl mx-auto mb-12">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6">Your Investment</h3>
              <p className="text-lg mb-6">
                Make Time For More is the culmination of my life experience. The value and the RESULTS you are capable
                of obtaining in it is PRICELESS.
              </p>
              <p className="text-lg mb-6">
                In fact because it is SO important to me that you break free from hustle culture and reconnect with your
                original entrepreneurial intentions, I have chosen to make your decision to work with me easy.
              </p>
              <p className="text-lg mb-6">
                FYI: I can't promise that this price will not go up substantially after BETA season. However, I can
                guarantee that if you become a founding member at any point during our BETA season, you will be
                grandfathered into that investment after BETA season.
              </p>

              <div className="bg-pink-100 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-4">
                  What We Ask in Return: During your vacation weeks, we'll ask for:
                </h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>Your honest feedback on the experience</li>
                  <li>A testimonial about your transformation</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">3-Day Monthly Disrupt The Hustle MEMBERSHIP</h3>
              <div className="text-3xl font-bold text-pink-600 mb-6">$200/Month</div>
              <p className="text-lg mb-6">
                Perfect for the Woman (or Man) who need a weekly reprieve from hustle culture
              </p>

              <h4 className="font-bold text-lg mb-4">Your Personal 28-Day Experience Includes:</h4>
              <ul className="text-left space-y-2 mb-8">
                <li>- A Monthly Work-Life Balance Audit (retake once per month)</li>
                <li>- Personalized 28-Day Intention Setting</li>
                <li>- Sunday Kick-Off Celebrations</li>
                <li>- 3 Monday Co-Working Sessions per month (during our 3 habit-building weeks)</li>
                <li>- Evening Power Down & Unplug sessions on your co-working days</li>
                <li>- 1-week vacation break each cycle for complete rest and renewal</li>
              </ul>

              <Button size="lg" className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                Ready to Break The Habit?
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Final Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">How Deeply Will You Root Your New Work-Life Balance Blueprint?</h2>
          <p className="text-xl mb-6 max-w-4xl mx-auto">
            Inside Make Time For More™, you aren't just learning about work-life balance. You're installing it — step by
            step, layer by layer — until it becomes your new Sustainable Operating Procedure (SOP) for life, business,
            and leadership.
          </p>
          <p className="text-xl mb-12 max-w-4xl mx-auto">
            You choose the installation level based on the rhythm you're ready to adopt:
          </p>

          <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 text-lg">
            Start Your Monday Transformation Today
          </Button>
        </div>
      </div>
    </div>
  )
}
