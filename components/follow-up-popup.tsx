"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ExternalLink, Clock, X, ArrowLeft, ArrowRight, FileText, Flower, Globe } from 'lucide-react'
import { useRouter } from "next/navigation"
import CherryBlossomConfetti from "./cherry-blossom-confetti"
import CountdownTimer from "./countdown-timer"
import { ButtonLink } from "./ui/button-link"

interface FollowUpPopupProps {
  onClose: () => void
}

export default function FollowUpPopup({ onClose }: FollowUpPopupProps) {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(true)
  const [isBlinking, setIsBlinking] = useState(true)

  useEffect(() => {
    // Hide confetti after 8 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 8000)

    // Set up blinking effect for the apply button
    const blinkInterval = setInterval(() => {
      setIsBlinking((prev) => !prev)
    }, 800)

    return () => {
      clearTimeout(timer)
      clearInterval(blinkInterval)
    }
  }, [])

  const goToWebsite = () => {
    window.open("https://www.maketimeformore.com", "_blank")
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto relative">
        {/* Add explicit close button at the top right */}
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Add cherry blossom confetti animation */}
        {showConfetti && <CherryBlossomConfetti duration={8} speed="fast" density="medium" />}

        <DialogHeader>
          <div className="flex justify-center mb-4 relative">
            <Image
              src="https://make-time-for-more.vercel.app/images/logo.png"
              alt="Make Time For More Logo"
              width={300}
              height={200}
              className="rounded-lg shadow-md"
            />
          </div>

          <DialogTitle className="text-xl text-center text-[#E26C73]">
            Join Us For Our Next Sunday Kick-Off Celebration!
          </DialogTitle>
        </DialogHeader>

        {/* Countdown Timer - Pink and Green Gradient Background */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-[#E26C73] to-[#5D9D61] p-4 rounded-lg text-white shadow-md">
            <CountdownTimer className="text-white" />
          </div>
        </div>

        <div className="space-y-6 py-4">
          <p className="text-center font-medium">
            <span className="font-medium">May 20, 2024 @ 9:00 AM EST</span>
          </p>

          <div className="bg-rose-50 border border-[#E26C73] rounded-md p-4 shadow-sm">
            <h3 className="font-medium text-[#E26C73] mb-2">Important Enrollment Deadline</h3>
            <p className="mb-2">
              You must complete the enrollment process by <span className="font-bold">Thursday 7:00 PM EST</span> to
              attend the Sunday Kick-Off Celebration and begin co-working on Monday.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium mt-3">
              <Clock className="h-4 w-4 text-[#E26C73]" />
              <span>Sunday Kick-Off: 1:00 PM EST | Monday Co-Working: 9:00 AM EST</span>
            </div>
          </div>

          <div className="bg-[#f5f0e6] border border-amber-300 rounded-md p-4 shadow-sm">
            <h3 className="font-medium text-amber-700 mb-2">Special BETA Opportunity</h3>
            <p className="mb-3">
              You're invited to join our exclusive BETA program at special BETA investment pricing!
            </p>
            <p className="mb-3">
              As a BETA participant, you'll receive the full premium experience at a reduced investment in exchange for:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Your valuable feedback on the experience</li>
              <li>A testimonial sharing your transformation</li>
              <li>Your insights to help shape and refine the program</li>
            </ul>
            <p className="text-sm font-medium text-amber-700">
              This special BETA pricing is available for a limited time only. Once our BETA period concludes, the
              investment will increase to reflect the premium value of this boutique experience.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={() =>
                window.open(
                  "https://docs.google.com/forms/d/e/1FAIpQLSeYa2yNmiIOXykp3Kd5Xts0jDPe96NJ4adWhFYEwi5GXZ3Ilw/viewform?usp=header",
                  "_blank",
                )
              }
              className={`${isBlinking ? "bg-[#5D9D61] animate-pulse" : "bg-[#4c8050]"} text-white relative py-6 font-bold`}
            >
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                <ArrowRight className="h-5 w-5 animate-bounce" />
              </div>
              <ExternalLink className="mr-2 h-4 w-4" />
              APPLY NOW!
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                <ArrowLeft className="h-5 w-5 animate-bounce" />
              </div>
            </Button>

            <Button
              onClick={() => {
                onClose()
                router.push("/learn-more")
              }}
              className="bg-[#E26C73] hover:bg-[#d15964] text-white"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Learn More
            </Button>

            <Button
              onClick={() => {
                onClose()
                router.push("/join-us")
              }}
              className="bg-[#E26C73] hover:bg-[#d15964] text-white"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Join Us
            </Button>

            <Button onClick={goToWebsite} className="bg-[#5D9D61] hover:bg-[#4c8050] text-white">
              <Globe className="mr-2 h-4 w-4" />
              Visit Our Website
            </Button>

            <ButtonLink
              href="https://chatgpt.com/g/g-67f5422677308191aa28a86d8ae5084e-free-work-life-balance-audit-for-women-founders"
              className="bg-[#E26C73] hover:bg-[#d15964] text-white flex items-center justify-center"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Chat with Cherry Blossom
              <Flower className="ml-2 h-4 w-4 text-pink-300 font-extrabold" />
            </ButtonLink>

            <Button
              onClick={() => {
                onClose()
                router.push("/my-results")
              }}
              className="bg-white border border-[#E26C73] text-[#E26C73] hover:bg-rose-50"
            >
              <FileText className="mr-2 h-4 w-4" />
              Back to Results
            </Button>

            <Button onClick={onClose} variant="outline" className="mt-2">
              Close
            </Button>
          </div>

          <p className="text-sm text-center text-gray-600 mt-4">
            "You didn't leave your high-stress role just to rebuild burnout inside your business."
            <br />- Thought Leader Barbara
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
