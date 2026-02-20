"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import CherryBlossomConfetti from "@/components/cherry-blossom-confetti"
import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

export default function JoinUsPage() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Set your target date here (June 1, 2025 or whatever your actual target date is)
  const targetDate = new Date("June 1, 2025 00:00:00").getTime()

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        clearInterval(interval)
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Cherry Blossom Confetti */}
      <CherryBlossomConfetti duration={30} speed="fast" />

      {/* Top Navigation */}
      <div className="w-full max-w-4xl mx-auto px-4 pt-8 mb-6">
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
            <Button variant="outline" onClick={() => router.push("/learn-more")} className="">
              Learn More
            </Button>
            <Button variant="outline" onClick={() => router.push("/join-us")} className="bg-brand-tan">
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

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={130}
              height={130}
              className="rounded-full"
            />
          </div>

          <h1 className="text-3xl brand-title text-brand-pink mb-6">Make Time For More™</h1>

          <h2 className="text-2xl font-medium text-brand-green mb-6">
            Join Us for a 7-Day Reset, our 14-Day Momentum Builder or the 21-Day Habit Building Cycle + 1 Week Recovery
            Break For The Complete Transformational Work-Life Balance Experience!
          </h2>
        </div>

        {/* Hero Image with Cherry Blossoms */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Image
              src="/images/women-tea-cherry-blossoms.png"
              alt="Women enjoying tea under cherry blossoms"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-[#E26C73] to-[#5D9D61] text-white rounded-lg p-6 mb-8">
            <h2 className="text-2xl header-bold mb-4 text-center text-white">
              Counting Down to Our 28-Day Work-Life Balance Cycle In June!
            </h2>

            <div className="flex justify-center space-x-4 mb-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{timeLeft.days}</div>
                <div className="text-sm text-white">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{timeLeft.hours}</div>
                <div className="text-sm text-white">HOURS</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{timeLeft.minutes}</div>
                <div className="text-sm text-white">MINS</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{timeLeft.seconds}</div>
                <div className="text-sm text-white">SECS</div>
              </div>
            </div>

            <p className="italic text-center text-white">
              Reset Your Rhythms & Reclaim Your Time As You Make Time For More.
            </p>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-lg header-bold mb-4 text-black">
              Sunday Kick-Off Begins 1:PM ET | Monday - Thursday Co-Working Begins 9:AM ET
            </h3>
          </div>

          <div className="border border-brand-pink bg-red-50 rounded-lg p-6 text-center">
            <h3 className="text-xl text-brand-pink header-bold mb-4">Important Enrollment Deadline</h3>
            <p className="text-black">
              You must complete the enrollment process by Thursday, 10:00 PM EST to attend the Sunday Kick-Off and start
              with the group.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border border-brand-tan">
            <h3 className="text-xl header-bold text-brand-pink mb-4">What You'll Experience</h3>
            <ul className="list-disc pl-5 space-y-2 text-black">
              <li>Daily co-working sessions with accountability</li>
              <li>Weekly planning and reflection workshops</li>
              <li>Access to our private community</li>
              <li>Personalized work-life balance strategies</li>
              <li>Tools to reclaim your time and energy</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-brand-tan">
            <h3 className="text-xl header-bold text-brand-green mb-4">Who This Is For</h3>
            <ul className="list-disc pl-5 space-y-2 text-black">
              <li>Women entrepreneurs feeling overwhelmed</li>
              <li>Business owners seeking better work-life balance</li>
              <li>Professionals wanting to reclaim their time</li>
              <li>Anyone ready to transform their relationship with time</li>
              <li>Those committed to sustainable success</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/e/1FAIpQLSeYa2yNmiIOXykp3Kd5Xts0jDPe96NJ4adWhFYEwi5GXZ3Ilw/viewform?usp=header",
                "_blank",
              )
            }
            className="bg-brand-green hover:bg-green-600 text-white px-8 py-6 text-xl header-bold"
          >
            Apply Now To Join Us
          </Button>
          <p className="mt-4 text-black">Limited spots available. Application required to ensure a good fit.</p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="w-full max-w-4xl mx-auto px-4 pb-8 mb-6">
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
            <Button variant="outline" onClick={() => router.push("/learn-more")} className="">
              Learn More
            </Button>
            <Button variant="outline" onClick={() => router.push("/join-us")} className="bg-brand-tan">
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
    </div>
  )
}
