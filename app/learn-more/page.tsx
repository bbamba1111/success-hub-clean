"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LearnMorePage() {
  const router = useRouter()
  const goToJoinUs = () => {
    router.push("/join-us")
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gradient-to-b from-white to-rose-50">
      {/* Top Navigation */}
      <div className="w-full max-w-3xl mb-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/")} className="">
              Retake Audit
            </Button>
            <Button variant="outline" onClick={() => router.push("/my-results")} className="">
              Back to Results
            </Button>
            <Button variant="outline" onClick={() => router.push("/about")} className="">
              About
            </Button>
            <Button variant="outline" onClick={() => router.push("/learn-more")} className="bg-brand-tan">
              Learn More
            </Button>
            <Button variant="outline" onClick={() => router.push("/join-us")} className="">
              Join Us
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open("https://www.maketimeformore.com", "_blank")}
              className=""
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Website
            </Button>
            <Button
              onClick={() =>
                window.open(
                  "https://docs.google.com/forms/d/e/1FAIpQLSeYa2yNmiIOXykp3Kd5Xts0jDPe96NJ4adWhFYEwi5GXZ3Ilw/viewform?usp=header",
                  "_blank",
                )
              }
              className="bg-brand-green text-white hover:bg-green-600"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              APPLY NOW!
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl w-full space-y-6 mb-16">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={130}
              height={130}
              className="rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-3xl brand-title mb-2 text-brand-pink">Make Time For More™</h1>
          <h2 className="text-2xl brand-subtitle mb-2 text-black">The Spiritual Foundation of Work-Life Balance</h2>
        </div>

        <div className="text-center mb-6"></div>

        <Card className="border-[#E26C73] bg-rose-50">
          <CardContent className="space-y-4 pt-6">
            <p className="font-medium">
              <strong>Make Time For More™</strong> isn't just another productivity system—it's a spiritual
              transformation disguised as a business model.
            </p>

            <p>
              We help high-achieving women entrepreneurs shift from <strong>matter-to-matter over-efforting</strong> to{" "}
              <strong>spiritual co-creation</strong> of their ideal work-lifestyle.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#E26C73]">Our Unique Approach</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              While others focus solely on schedules and strategies, we begin with something more powerful:{" "}
              <strong>your direct connection to Creator</strong>—whether you call that Jesus, Allah, Buddha, Jehovah,
              Higher Self, Source, Holy Spirit, or Universe.
            </p>

            <p className="mb-3">This spiritual foundation is what makes our approach revolutionary. We help you:</p>

            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Set Your Desired Work-Lifestyle Intention</strong> - A sacred 28-day ask that becomes the
                foundation of your new life and leadership
              </li>
              <li>
                <strong>Align Your Energy Before Your Actions</strong> - Tap into manifestation principles that make
                transformation effortless
              </li>
              <li>
                <strong>Install New Patterns Through Structure</strong> - Use our proven framework to break hustle
                habits permanently
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* First Join Us button */}
        <Button onClick={goToJoinUs} className="w-full bg-[#E26C73] hover:bg-[#d15964] text-white py-6 text-lg">
          Join Us
        </Button>

        {/* Harmony Image */}
        <div className="w-full rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/images/harmony-family.png"
            alt="Make Time For More Harmony - Mother enjoying quality time with children in a cherry blossom garden"
            width={800}
            height={800}
            className="w-full h-auto"
          />
        </div>

        {/* Live Case-Study Installation Section */}
        <Card className="border-[#5D9D61] bg-green-50">
          <CardHeader>
            <CardTitle className="text-[#5D9D61]">This Is a Live Case-Study Installation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The <strong>Work-Life Balance Business Model &amp; SOP</strong> has already been architected as a harmony-first operating system for women in entrepreneurship.
            </p>
            <p>
              The <strong>Monday Reset</strong> is where you experience it in real time.
            </p>
            <p>
              We are currently running live case-study installations validating the structural impact of the Parallel Lane.
            </p>
            <p className="font-medium">This is not about motivation.</p>
            <p className="mb-3">{"It's about measuring:"}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>What shifts when work is intentionally contained</li>
              <li>What happens when energy precedes execution</li>
              <li>How a 4-Hour Focused CEO Workday affects output and clarity</li>
              <li>What 20 hours of protected time freedom does to leadership</li>
              <li>How rhythm changes nervous system chemistry</li>
            </ul>
            <div className="mt-6 p-4 bg-white rounded-lg border border-[#5D9D61]">
              <p className="font-medium text-[#5D9D61] text-center text-lg">You are not a beta tester.</p>
              <p className="text-center text-lg mt-2">
                You are a <strong>founding participant</strong>.
              </p>
              <p className="text-center text-lg">
                A <strong>pioneer</strong>. A <strong>contributor</strong>. A <strong>lane-builder</strong>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why This Matters Section */}
        <Card className="border-[#E26C73] bg-rose-50">
          <CardHeader>
            <CardTitle className="text-[#E26C73]">Why This Matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>The data and lived experience from these installations inform:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>{"Women's associations"}</li>
              <li>Founder communities</li>
              <li>Entrepreneurial ecosystems</li>
              <li>Conference and panel conversations</li>
              <li>Wellness-focused workplace design in the AI Age</li>
            </ul>
            <div className="mt-4 p-4 bg-white rounded-lg border border-[#E26C73]">
              <p className="font-medium text-[#E26C73] text-center text-lg">This is operating system architecture.</p>
              <p className="text-center text-lg mt-2">Not productivity advice.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#E26C73]">The Complete System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h5 className="font-bold text-black mb-2">Step 1: The Work-Life Balance Audit</h5>
              <p>
                Discover where you stand across 13 Core Life Value Areas and receive personalized guidance from Cherry
                Blossom, your AI Work-Life Balance Guide.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-black mb-2">Step 2: Choose Your Path</h5>
              <p className="mb-3">Select the experience that matches your readiness:</p>

              <div className="mb-4">
                <h6 className="font-semibold text-[#E26C73]">The Experience (One-time reset):</h6>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>7-Day Reset ($2,500)</li>
                  <li>14-Day Momentum Builder ($5,000)</li>
                  <li>21-Day Habit Builder + Recovery Week ($7,500)</li>
                </ul>
              </div>

              <div>
                <h6 className="font-semibold text-[#E26C73]">The Installation (Complete transformation):</h6>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>7-Day Installation - 3 consecutive cycles ($7,500)</li>
                  <li>14-Day Installation - 3 consecutive cycles ($15,000)</li>
                  <li>21-Day Installation - 3 consecutive cycles ($22,500)</li>
                </ul>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-black mb-2">Step 3: Access Your Success Hub</h5>
              <p className="mb-2">Immediately plug into our comprehensive digital ecosystem with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Day-by-day implementation guides</li>
                <li>Cherry Blossom AI tools for each component</li>
                <li>Video tutorials and templates</li>
                <li>Community connection points</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-black mb-2">Step 4: Live the New Model</h5>
              <p className="mb-2">Experience the daily rhythm that breaks hustle habits:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Morning GIV•EN™ Routine (9-10:30 AM)</li>
                <li>30-Minute Workday Workout (10:30-11 AM)</li>
                <li>Extended Healthy Hybrid Lunch (11 AM-1 PM)</li>
                <li>4-Hour Focused CEO Workday (1-5 PM)</li>
                <li>Quality Lifestyle Experiences</li>
                <li>Power Down & Unplug Ritual</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-black mb-2">Step 5: Ongoing Support</h5>
              <p className="mb-2">After your installation (14 or 21-day), maintain your transformation with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Affordable maintenance options</li>
                <li>Continued access to the community</li>
                <li>Refresher sessions as needed</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Second Join Us button */}
        <Button onClick={goToJoinUs} className="w-full bg-[#E26C73] hover:bg-[#d15964] text-white py-6 text-lg">
          Join Us
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#E26C73]">The Training Wheels Approach</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We don't just teach concepts—we ride alongside you. Like training wheels on a bicycle, we provide the
              structure and support until the new way of working becomes second nature.
            </p>
            <p>
              Most women need about 3 months to fully integrate this new operating system. Once it's installed, you'll
              never go back to hustle mode again.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#E26C73]">The Science + Spirit Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="mb-3">Our approach uniquely combines:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Neuroscience</strong> - Rewiring your brain's reward pathways
              </li>
              <li>
                <strong>Quantum Physics</strong> - Energy alignment principles
              </li>
              <li>
                <strong>Epigenetics</strong> - Breaking generational hustle patterns
              </li>
              <li>
                <strong>Hormone Science</strong> - Supporting your body's natural rhythms
              </li>
              <li>
                <strong>Spiritual Co-Creation</strong> - Partnering with higher power
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#E26C73]">The Results You'll Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              <li>152 hours of weekly time freedom</li>
              <li>A 4-day workweek with 3-day weekends</li>
              <li>Focused 4-hour CEO workdays</li>
              <li>Balanced hormones and reduced stress</li>
              <li>Deeper spiritual connection</li>
              <li>Sustainable business growth without burnout</li>
              <li>Alignment across all 13 Core Life Value Areas</li>
            </ul>
          </CardContent>
        </Card>

        {/* New BETA Opportunity Card */}
        <Card className="border-[#E26C73] bg-[#f5f0e6]">
          <CardHeader>
            <CardTitle className="text-amber-700">Ready to Transform?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The Make Time For More™ Work-Life Balance Experience isn't just about doing less—it's about becoming more.
              More present. More intentional. More aligned with your highest purpose and deepest desires.
            </p>
            <p className="font-medium">
              This is your invitation to stop hustling for your worth and start co-creating the work-lifestyle you truly
              desire—with divine support, proven structure, and a community of women walking the same path.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4 mt-6">
          {/* Third Join Us button */}
          <Button onClick={goToJoinUs} className="w-full bg-[#E26C73] hover:bg-[#d15964] text-white py-3 text-lg">
            Join Us
          </Button>

          <Button
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/e/1FAIpQLSeYa2yNmiIOXykp3Kd5Xts0jDPe96NJ4adWhFYEwi5GXZ3Ilw/viewform?usp=header",
                "_blank",
              )
            }
            className="w-full bg-[#5D9D61] hover:bg-[#4c8050] text-white py-3 text-lg font-bold"
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            APPLY NOW!
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full max-w-3xl mb-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/")} className="">
              Retake Audit
            </Button>
            <Button variant="outline" onClick={() => router.push("/my-results")} className="">
              Back to Results
            </Button>
            <Button variant="outline" onClick={() => router.push("/about")} className="">
              About
            </Button>
            <Button variant="outline" onClick={() => router.push("/learn-more")} className="bg-brand-tan">
              Learn More
            </Button>
            <Button variant="outline" onClick={() => router.push("/join-us")} className="">
              Join Us
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open("https://www.maketimeformore.com", "_blank")}
              className=""
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Website
            </Button>
            <Button
              onClick={() =>
                window.open(
                  "https://docs.google.com/forms/d/e/1FAIpQLSeYa2yNmiIOXykp3Kd5Xts0jDPe96NJ4adWhFYEwi5GXZ3Ilw/viewform?usp=header",
                  "_blank",
                )
              }
              className="bg-brand-green text-white hover:bg-green-600"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              APPLY NOW!
            </Button>
          </div>
        </div>
      </div>

      <footer className="bg-brand-tan py-6 text-center text-black">
        <p>© 2025 Make Time For More™. All rights reserved.</p>
      </footer>
    </main>
  )
}
