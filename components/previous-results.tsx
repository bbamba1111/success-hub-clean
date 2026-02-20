"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getAuditResults, type StoredAuditData } from "@/utils/audit-storage"
import { useRouter } from "next/navigation"
import { ArrowLeft, RefreshCw, Heart, Home, Briefcase, Sparkles, Brain, Leaf, Utensils, BookOpen, DollarSign, Users, Palette, HeartHandshake, Moon, ExternalLink, Flower } from 'lucide-react'
import { Check, Copy, Info, User } from 'lucide-react'
import Image from "next/image"
import BetaInvitation from "./beta-invitation"
import ResultsConfetti from "./results-confetti"
import { categoryLabels } from "./work-life-balance-audit"
import { ButtonLink } from "@/components/ui/button-link"
import { Input } from "@/components/ui/input"

export default function PreviousResults() {
  const [auditData, setAuditData] = useState<StoredAuditData | null>(null)
  const [showBetaInvite, setShowBetaInvite] = useState(false)
  const [name, setName] = useState("")
  const [isCherryPromptCopied, setIsCherryPromptCopied] = useState(false)
  const cherryBlossomPromptRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  useEffect(() => {
    const data = getAuditResults()
    setAuditData(data)
    if (data) {
      setName(data.name || "")
    }
  }, [])

  const goToWebsite = () => {
    window.open("https://www.maketimeformore.com", "_blank")
  }

  if (!auditData) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 text-center">
        <h2 className="text-xl font-bold mb-4">No Previous Audit Results Found</h2>
        <p className="mb-4">You haven't completed the Work-Life Balance Audit yet.</p>
        <Button onClick={() => router.push("/")} className="bg-[#E26C73] hover:bg-[#d15964]">
          Take the Audit Now
        </Button>
      </div>
    )
  }

  const { overallScore, results, personalizedFeedback } = auditData

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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  // Map of category icons
  const categoryIcons = {
    spiritual: <Leaf className="h-5 w-5 flex-shrink-0" />,
    mental: <Brain className="h-5 w-5 flex-shrink-0" />,
    physicalMovement: <Briefcase className="h-5 w-5 flex-shrink-0" />,
    physicalNourishment: <Utensils className="h-5 w-5 flex-shrink-0" />,
    physicalSleep: <Moon className="h-5 w-5 flex-shrink-0" />,
    emotional: <Heart className="h-5 w-5 flex-shrink-0" />,
    personal: <Sparkles className="h-5 w-5 flex-shrink-0" />,
    intellectual: <BookOpen className="h-5 w-5 flex-shrink-0" />,
    professional: <Briefcase className="h-5 w-5 flex-shrink-0" />,
    financial: <DollarSign className="h-5 w-5 flex-shrink-0" />,
    environmental: <Home className="h-5 w-5 flex-shrink-0" />,
    relational: <Users className="h-5 w-5 flex-shrink-0" />,
    social: <Users className="h-5 w-5 flex-shrink-0" />,
    recreational: <Palette className="h-5 w-5 flex-shrink-0" />,
    charitable: <HeartHandshake className="h-5 w-5 flex-shrink-0" />,
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
    if (!auditData) return ""

    let prompt = `Hello Cherry Blossom! I just completed the Work-Lifestyle Balance Audit. Here are my results:

`
    prompt += `Name: ${name || auditData.name}
`
    prompt += `Overall Score: ${auditData.overallScore}%

`

    const isExcellentScore = auditData.overallScore >= 80

    if (isExcellentScore) {
      prompt += `I'm doing well with my work-lifestyle balance, scoring ${auditData.overallScore}% overall!

`
      prompt += `My category scores (from lowest to highest):
`
      auditData.results.forEach((result) => {
        prompt += `- ${categoryLabels[result.category]}: ${Math.round(result.percentage)}%
`
      })

      prompt += `
I'd like your guidance on maintaining my excellent work-lifestyle balance. What specific strategies would you recommend to help me continue this success?`
    } else {
      prompt += `My category scores (from lowest to highest):
`
      auditData.results.forEach((result) => {
        prompt += `- ${categoryLabels[result.category]}: ${Math.round(result.percentage)}%
`
      })

      prompt += `
My lowest scoring areas are:
`
      auditData.personalizedFeedback.forEach((item) => {
        prompt += `- ${categoryLabels[item.category]}
`
      })

      prompt += `
I'd like your guidance on improving these areas. What specific strategies would you recommend for my situation?`
    }

    return prompt
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 p-4 relative box-border">
      {/* Add confetti effect */}
      <ResultsConfetti score={overallScore} speed="fast" />

      {!showBetaInvite ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4">
            <Button variant="outline" onClick={() => router.push("/")} className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full sm:w-auto bg-[#5D9D61] hover:bg-[#4c8050] text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake The Audit
            </Button>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/logo.png"
                alt="Make Time For More Logo"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
            <h2 className="text-xl font-bold">Your Previous Audit Results</h2>
            <p className="text-gray-500">
              Completed on {auditData.timestamp ? formatDate(auditData.timestamp) : "Unknown date"}
            </p>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold">Overall Score: {overallScore}%</h3>
            <p className={`${getScoreColor(overallScore)} font-medium`}>{getScoreDescription(overallScore)}</p>
          </div>

          <div className="space-y-4 w-full">
            <h4 className="font-medium">Category Breakdown</h4>
            {results.map((result) => (
              <div key={result.category} className="space-y-1 w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {categoryIcons[result.category]}
                    <span className="truncate">{categoryLabels[result.category]}</span>
                  </div>
                  <span className={`${getScoreColor(result.percentage)} flex-shrink-0`}>{Math.round(result.percentage)}%</span>
                </div>
                <Progress value={result.percentage} className="h-2 w-full" />
              </div>
            ))}
          </div>

          <div className="space-y-4 mt-6 w-full">
            <h4 className="font-medium">Top 3 Recommendations</h4>
            {results.slice(0, 3).map((result, index) => (
              <Card key={index} className="border-[#E26C73] w-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {categoryIcons[result.category]}
                    <CardTitle className="text-base">
                      {overallScore >= 80
                        ? `Maintain Your ${categoryLabels[result.category]}`
                        : `Improve Your ${categoryLabels[result.category]}`}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {personalizedFeedback
                      .filter((item) => item.category === result.category)
                      .map((item, idx) => (
                        <li key={idx} className="text-sm break-words">
                          {item.feedback}
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-[#E26C73] bg-[#f5f0e6] shadow-md mt-6 w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#E26C73] flex items-center gap-2">
                <Image src="/images/logo.png" alt="Cherry Blossom" width={24} height={24} className="rounded-full flex-shrink-0" />
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
                  <li className="break-words">Cherry Blossom will provide personalized guidance based on your results</li>
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
        </>
      ) : (
        <BetaInvitation
          onBack={() => setShowBetaInvite(false)}
          overallScore={overallScore}
          name={name}
          results={results}
          personalizedFeedback={personalizedFeedback}
        />
      )}
    </div>
  )
}
