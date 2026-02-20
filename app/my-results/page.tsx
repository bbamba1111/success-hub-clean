"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import {
  Sparkles,
  Leaf,
  Brain,
  Briefcase,
  Utensils,
  Moon,
  Heart,
  BookOpen,
  DollarSign,
  Users,
  Palette,
  HeartHandshake,
  Home,
  Check,
  Copy,
  Info,
  User,
  ExternalLink,
  Flower,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSavedAuditResults } from "@/utils/audit-storage"
import { categoryLabels, recommendations } from "@/components/work-life-balance-audit"
import { Input } from "@/components/ui/input"
import { ButtonLink } from "@/components/ui/button-link"
import CherryBlossomConfetti from "@/components/cherry-blossom-confetti"
import { useRouter } from "next/navigation"

// Define the category icons directly in this file to avoid the import error
const categoryIcons: Record<string, React.ReactNode> = {
  spiritual: <Leaf className="h-5 w-5" />,
  mental: <Brain className="h-5 w-5" />,
  physicalMovement: <Briefcase className="h-5 w-5" />,
  physicalNourishment: <Utensils className="h-5 w-5" />,
  physicalSleep: <Moon className="h-5 w-5" />,
  emotional: <Heart className="h-5 w-5" />,
  personal: <Sparkles className="h-5 w-5" />,
  intellectual: <BookOpen className="h-5 w-5" />,
  professional: <Briefcase className="h-5 w-5" />,
  financial: <DollarSign className="h-5 w-5" />,
  environmental: <Home className="h-5 w-5" />,
  relational: <Users className="h-5 w-5" />,
  social: <Users className="h-5 w-5" />,
  recreational: <Palette className="h-5 w-5" />,
  charitable: <HeartHandshake className="h-5 w-5" />,
}

export default function MyResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [isCherryPromptCopied, setIsCherryPromptCopied] = useState(false)
  const cherryBlossomPromptRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    try {
      // Get saved results from localStorage
      const savedResults = getSavedAuditResults()
      setResults(savedResults)
      if (savedResults) {
        setName(savedResults.name || "")
      }
    } catch (error) {
      console.error("Error loading saved results:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const getScoreColor = (percentage: number) => {
    if (percentage < 40) return "text-red-500"
    if (percentage < 70) return "text-amber-500"
    return "text-emerald-500"
  }

  const getScoreDescription = (percentage: number) => {
    if (percentage < 40) return "Needs significant improvement"
    if (percentage < 70) return "Room for improvement"
    if (percentage < 90) return "Good balance"
    return "Excellent balance"
  }

  // Function to copy Cherry Blossom prompt to clipboard
  const copyCherryBlossomPrompt = async () => {
    if (cherryBlossomPromptRef.current) {
      try {
        await navigator.clipboard.writeText(cherryBlossomPromptRef.current.value)
        setIsCherryPromptCopied(true)
        setTimeout(() => setIsCherryPromptCopied(false), 2000)
      } catch (error) {
        console.error("Error copying Cherry Blossom prompt:", error)
      }
    }
  }

  // Generate Cherry Blossom prompt
  const generateCherryBlossomPrompt = () => {
    if (!results) return ""

    let prompt = `Hello Cherry Blossom! I just completed the Work-Lifestyle Balance Audit. Here are my results:

`
    prompt += `Name: ${name || results.name}
`
    prompt += `Overall Score: ${results.overallScore}%

`

    const isExcellentScore = results.overallScore >= 80

    if (isExcellentScore) {
      prompt += `I'm doing well with my work-lifestyle balance, scoring ${results.overallScore}% overall!

`
      prompt += `My category scores (from lowest to highest):
`
      results.results.forEach((result: any) => {
        prompt += `- ${categoryLabels[result.category]}: ${Math.round(result.percentage)}%
`
      })

      prompt += `
I'd like your guidance on maintaining my excellent work-lifestyle balance. What specific strategies would you recommend to help me continue this success?`
    } else {
      prompt += `My category scores (from lowest to highest):
`
      results.results.forEach((result: any) => {
        prompt += `- ${categoryLabels[result.category]}: ${Math.round(result.percentage)}%
`
      })

      prompt += `
My lowest scoring areas are:
`
      results.results.slice(0, 3).forEach((result: any) => {
        prompt += `- ${categoryLabels[result.category]}
`
      })

      prompt += `
I'd like your guidance on improving these areas. What specific strategies would you recommend for my situation?`
    }

    return prompt
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-white to-brand-tan">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-pink mx-auto mb-4"></div>
          <p className="text-black">Loading your results...</p>
        </div>
      </main>
    )
  }

  if (!results) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-white to-brand-tan">
        <div className="max-w-md text-center">
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
          <h2 className="text-2xl brand-subtitle mb-6 text-black">No Results Found</h2>
          <p className="text-black mb-8 text-lg">
            You haven't completed the Work-Life Balance Audit yet. Take the audit to see your personalized results.
          </p>
          <Link href="/">
            <Button className="bg-brand-green hover:bg-green-600 text-white px-8 py-4 text-lg">
              Take the Audit Now
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 pt-4 md:pt-8 bg-gradient-to-b from-white to-brand-tan">
      <CherryBlossomConfetti duration={6} speed="normal" density="medium" />

      {/* Top Navigation */}
      <div className="w-full max-w-4xl mb-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/")} className="">
              Retake Audit
            </Button>
            <Button variant="outline" onClick={() => router.push("/my-results")} className="bg-brand-tan">
              Back to Results
            </Button>
            <Button variant="outline" onClick={() => router.push("/about")} className="">
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

      <div className="max-w-4xl w-full">
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Make Time For More Logo"
            width={130}
            height={130}
            className="rounded-full shadow-lg"
          />
        </div>

        <h1 className="text-3xl brand-title mb-2 text-brand-pink text-center">Make Time For More™</h1>
        <h2 className="text-2xl brand-subtitle mb-4 text-black text-center">
          Your Work-Life Balance Results Are In...
        </h2>

        {results.name && <p className="text-center text-black mb-6 text-lg">Results for: {results.name}</p>}

        <div className="space-y-10">
          <div className="text-center mb-6">
            <h3 className="text-2xl header-bold mb-4">Overall Score: {results.overallScore}%</h3>
            <p className={`${getScoreColor(results.overallScore)} header-bold text-xl`}>
              {getScoreDescription(results.overallScore)}
            </p>

            {results.overallScore === 100 && (
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-md">
                <p className="text-emerald-700 header-bold text-lg">
                  Congratulations! You've achieved perfect balance across all areas of your life. This is truly
                  remarkable and reflects your dedication to holistic well-being.
                </p>
              </div>
            )}

            {results.overallScore < 100 && results.overallScore >= 80 && (
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-md">
                <p className="text-emerald-700 header-bold text-lg">
                  Congratulations! Your excellent score shows you've developed strong work-lifestyle balance habits.
                  You're already implementing many effective strategies in your daily life.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h4 className="header-bold text-xl text-black">Category Breakdown</h4>
            {results.results &&
              results.results.map((result: any) => {
                const percentage = Math.round(result.percentage)
                const color = percentage < 40 ? "#dc3545" : percentage < 70 ? "#ffc107" : "#28a745"

                return (
                  <div key={result.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center">
                          {categoryIcons[result.category]}
                        </span>
                        <span className="text-lg text-black">{categoryLabels[result.category]}</span>
                      </div>
                      <span style={{ color: color }} className="text-lg header-bold">
                        {percentage}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                  </div>
                )
              })}
          </div>

          <div className="space-y-6">
            <h4 className="header-bold text-xl text-black">
              {results.overallScore >= 80 ? "Top Recommendations to Maintain Your Balance" : "Top Recommendations"}
            </h4>
            <div className="grid gap-6">
              {results.results &&
                results.results.slice(0, 3).map((result: any) => (
                  <Card key={result.category} className="border-brand-tan">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center">
                          {categoryIcons[result.category]}
                        </span>
                        <CardTitle className="text-lg text-black">
                          {results.overallScore >= 80
                            ? `Maintain Your ${categoryLabels[result.category]}`
                            : `Improve Your ${categoryLabels[result.category]}`}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        Current score: {Math.round(result.percentage)}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-6 space-y-2">
                        {recommendations[result.category] &&
                          recommendations[result.category].slice(0, 3).map((rec: string, index: number) => (
                            <li key={index} className="text-base text-black">
                              {rec}
                            </li>
                          ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          <Card className="border-[#E26C73] bg-[#f5f0e6] shadow-md mt-6 w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#E26C73] flex items-center gap-2">
                <Image
                  src="/images/logo.png"
                  alt="Cherry Blossom"
                  width={24}
                  height={24}
                  className="rounded-full flex-shrink-0"
                />
                <span className="break-words">Get Ongoing Support From Cherry Blossom</span>
              </CardTitle>
              <CardDescription className="break-words">
                This FREE audit, created by Thought Leader Barbara is her gift to you that keeps on GIV*EN. Cherry
                Blossom can help you maintain your work-lifestyle balance and continue your success journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-3 rounded-md border border-rose-100">
                <h5 className="font-medium text-black font-bold mb-2">
                  How to Get Deeper Insights from Cherry Blossom:
                </h5>

                {/* Name field */}
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>

                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li className="break-words">
                    <strong>Copy your results</strong> using the button below
                  </li>
                  <li className="break-words">Click the "Chat with Cherry Blossom" button to open ChatGPT</li>
                  <li className="break-words">Create a free OpenAI account if you don't have one</li>
                  <li className="break-words">Paste your results into the Cherry Blossom chat box</li>
                  <li className="break-words">
                    Cherry Blossom will provide personalized guidance based on your results
                  </li>
                </ol>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">
                    A free OpenAI account is required to access Cherry Blossom. Sign up at{" "}
                    <a
                      href="https://chat.openai.com/auth/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E26C73] underline"
                    >
                      chat.openai.com
                    </a>
                  </span>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <div className="bg-white p-4 rounded-md border-2 border-[#E26C73] shadow-md">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                    <label className="text-base font-bold text-[#E26C73]">Your Results for Cherry Blossom:</label>
                    <Button
                      onClick={copyCherryBlossomPrompt}
                      variant="outline"
                      className="bg-[#5D9D61] hover:bg-[#4c8050] text-white w-full sm:w-auto"
                      size="sm"
                    >
                      {isCherryPromptCopied ? (
                        <>
                          <Check className="mr-1 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="relative w-full">
                    <textarea
                      ref={cherryBlossomPromptRef}
                      className="w-full h-40 p-3 text-base bg-gray-50 text-gray-800 border border-gray-300 rounded-md font-medium resize-none focus:outline-none focus:ring-2 focus:ring-[#E26C73] focus:border-transparent"
                      value={generateCherryBlossomPrompt()}
                      readOnly
                      onClick={(e) => e.currentTarget.select()}
                    />
                    {!isCherryPromptCopied && (
                      <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded text-xs text-gray-600 pointer-events-none">
                        Click to select all
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={copyCherryBlossomPrompt}
                  className="w-full bg-[#5D9D61] hover:bg-[#4c8050] text-white py-3 text-base font-bold"
                >
                  {isCherryPromptCopied ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Copied Successfully!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-5 w-5" />
                      Copy Your Results For Cherry Blossom
                    </>
                  )}
                </Button>
              </div>

              <ButtonLink
                href="https://chatgpt.com/g/g-67f5422677308191aa28a86d8ae5084e-free-work-life-balance-audit-for-women-founders"
                className="bg-[#E26C73] hover:bg-[#d15964] text-white flex items-center justify-center w-full"
              >
                <ExternalLink className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="break-words">Click Here to Paste Your Results & Chat with Cherry Blossom</span>
                <Flower className="ml-2 h-4 w-4 text-pink-300 font-extrabold flex-shrink-0" />
              </ButtonLink>
            </CardContent>
          </Card>

          {/* Bottom Navigation - moved up with reduced spacing */}
          <div className="w-full max-w-4xl mt-8 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push("/")} className="">
                  Retake Audit
                </Button>
                <Button variant="outline" onClick={() => router.push("/my-results")} className="bg-brand-tan">
                  Back to Results
                </Button>
                <Button variant="outline" onClick={() => router.push("/about")} className="">
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

          {/* Footer */}
          <footer className="bg-brand-tan py-6 text-center text-black rounded-lg">
            <p>© 2025 Make Time For More™. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </main>
  )
}
