"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AboutPage() {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gradient-to-b from-white to-rose-50">
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
            <Button variant="outline" onClick={() => router.push("/about")} className="bg-brand-tan">
              About
            </Button>
            <Button variant="outline" onClick={() => router.push("/learn-more")} className="">
              Learn More
            </Button>
            <Button variant="outline" onClick={() => router.push("/join-us")} className="">
              Join Us
            </Button>
          </div>
          <div className="flex gap-2">
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
            <Button
              variant="outline"
              onClick={() => window.open("https://www.maketimeformore.com", "_blank")}
              className=""
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Website
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl w-full">
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Make Time For More Logo"
            width={130}
            height={130}
            className="rounded-full shadow-lg"
          />
        </div>

        <h1 className="text-3xl brand-title mb-8 text-center text-[#E26C73]">About the Work-Life Balance Audit</h1>

        <div className="space-y-6 text-gray-700">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#E26C73] mb-8">
            <div className="flex items-center justify-center gap-2 mb-4 text-[#5D9D61]">
              <span className="text-2xl">🌸</span>
              <h2 className="text-xl font-bold">Your Priceless Gift That Keeps on GIV*EN</h2>
              <span className="text-2xl">🌸</span>
            </div>
            <p className="text-center mb-2">
              <span className="font-bold">Regular Value: $997</span> — Yours FREE During the BETA Season
            </p>
            <p className="text-center italic mb-4">
              "This isn't just another one-time assessment—it's your ongoing companion for work-life balance mastery."
            </p>
          </div>

          <p>
            Welcome to the Make Time For More™ Work-Life Balance Audit—the{" "}
            <span className="font-bold">Mandatory 1st Step to Achieving Your Desired Work-Lifestyle</span> and accessing
            transformative coaching programs.
          </p>

          <h2 className="text-xl font-semibold text-[#E26C73] mt-8">What Makes This Audit Priceless</h2>
          <div className="bg-white p-5 rounded-lg">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-[#5D9D61] mt-1 flex-shrink-0" />
                <span>
                  <span className="font-bold">AI-Powered Precision:</span> Unlike generic assessments, our proprietary
                  algorithm provides hyper-personalized insights tailored to your unique situation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-[#5D9D61] mt-1 flex-shrink-0" />
                <span>
                  <span className="font-bold">Unlimited Access:</span> Take the audit daily, weekly, or monthly to track
                  your progress—a gift that truly keeps on GIV*EN, unlike one-off assessment tools.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-[#5D9D61] mt-1 flex-shrink-0" />
                <span>
                  <span className="font-bold">Cherry Blossom Integration:</span> Receive ongoing AI coaching support to
                  implement your personalized recommendations.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-[#5D9D61] mt-1 flex-shrink-0" />
                <span>
                  <span className="font-bold">Proprietary Framework:</span> Based on the 13 Core Life Value Areas from
                  Barbara's exclusive Work-Life Balance Experience.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-[#5D9D61] mt-1 flex-shrink-0" />
                <span>
                  <span className="font-bold">Beta Access:</span> You're receiving complimentary access to a tool that
                  will be sold for $997 after our beta season ends.
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center my-8 bg-[#5D9D61] p-6 rounded-lg shadow-md">
            <div className="w-full md:w-1/3 flex justify-center">
              <Image
                src="/images/barbara-portrait.jpg"
                alt="Barbara, Founder of Make Time For More™"
                width={200}
                height={200}
                className="rounded-full shadow-lg"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-semibold text-white mb-3">Meet Thought Leader Barbara</h2>
              <p className="italic mb-4">
                "I created this audit as the{" "}
                <span className="font-bold">Mandatory 1st Step to Achieving Your Desired Work-Lifestyle</span>. As a
                Thought Leader who has guided countless women founders to holistic success, I know that clarity precedes
                transformation. This isn't just an assessment—it's a priceless gift that keeps on GIV*EN, allowing you
                to check in on your work-life balance whenever you need guidance."
              </p>
              <p className="font-semibold text-white">- Barbara Bamba, Founder of Make Time For More™</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-[#E26C73] mt-8">How it Works</h2>
          <p>
            The audit consists of 15 questions covering different aspects of your life, from spiritual and emotional
            well-being to professional growth and financial focus. Each question asks you to rate your consistency in
            these areas over the past 30 days.
          </p>
          <p>After completing the audit, you'll receive:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>An overall score reflecting your current work-life balance</li>
            <li>A breakdown of scores across all 15 categories</li>
            <li>Targeted recommendations for your lowest-scoring areas</li>
            <li>Personalized guidance from Cherry Blossom, your AI support companion</li>
          </ul>

          <div className="bg-[#f5f0e6] p-6 rounded-lg border border-[#E26C73] mt-8">
            <h2 className="text-xl font-semibold text-[#E26C73] mb-4">Part of Our Proprietary Tool Collection</h2>
            <p className="mb-4">
              The Work-Life Balance Audit is just one of many custom, proprietary tools in our collection that we use to
              guide clients on their journey to holistic success. After our beta season, this self-assessment tool will
              be available for purchase on our website for $997.
            </p>
            <p className="mb-4">By accessing it now for free, you're receiving a priceless gift that:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Provides ongoing value whenever you need to reassess</li>
              <li>Offers AI-powered insights customized to your unique situation</li>
              <li>Serves as the Mandatory 1st Step to Achieving Your Desired Work-Lifestyle</li>
              <li>Gives you a taste of the transformative experience that awaits</li>
            </ul>
            <div className="flex items-center justify-center gap-2 text-[#E26C73]">
              <span className="text-2xl">🌸</span>
              <p className="font-bold">A $997 Value, Yours Completely FREE During The BETA Season</p>
              <span className="text-2xl">🌸</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-[#E26C73] mt-8">Why Work-Life Balance Matters</h2>
          <p>
            For women founders and entrepreneurs, achieving work-life balance isn't just about feeling good—it's about
            sustainability and success. Research shows that balanced leaders make better decisions, experience less
            burnout, and ultimately build more successful businesses.
          </p>
          <p>
            The Make Time For More™ approach recognizes that true balance isn't about equal time in all areas, but
            rather intentional focus on what matters most to you in each season of life and business.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full max-w-3xl mb-6 mt-12">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/")} className="">
              Retake Audit
            </Button>
            <Button variant="outline" onClick={() => router.push("/my-results")} className="">
              Back to Results
            </Button>
            <Button variant="outline" onClick={() => router.push("/about")} className="bg-brand-tan">
              About
            </Button>
            <Button variant="outline" onClick={() => router.push("/learn-more")} className="">
              Learn More
            </Button>
            <Button variant="outline" onClick={() => router.push("/join-us")} className="">
              Join Us
            </Button>
          </div>
          <div className="flex gap-2">
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
            <Button
              variant="outline"
              onClick={() => window.open("https://www.maketimeformore.com", "_blank")}
              className=""
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Website
            </Button>
          </div>
        </div>
      </div>

      <footer className="bg-brand-tan py-6 text-center text-black w-full">
        <p>© 2025 Make Time For More™. All rights reserved.</p>
      </footer>
    </main>
  )
}
