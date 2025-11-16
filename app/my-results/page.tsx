"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import SimpleChatModal from "@/components/simple-chat-modal"
import {
  ArrowLeft,
  RotateCcw,
  Target,
  Heart,
  Brain,
  Dumbbell,
  Apple,
  Moon,
  Smile,
  User,
  BookOpen,
  Briefcase,
  DollarSign,
  TreePine,
  Users,
  Gamepad2,
  Users2,
  Gift,
  Copy,
  Check,
} from "lucide-react"
import Link from "next/link"
import { getAuditResults } from "@/utils/audit-storage"

interface AuditResult {
  category: string
  percentage: number
  label: string
}

interface AuditData {
  overallScore: number
  results: AuditResult[]
  timestamp: number
}

const categoryLabels = {
  spiritual: "Spiritual Well-being",
  mental: "Mental Health",
  physicalMovement: "Physical Movement",
  physicalNourishment: "Physical Nourishment",
  physicalSleep: "Physical Sleep",
  emotional: "Emotional Health",
  personal: "Personal Growth",
  intellectual: "Intellectual Development",
  professional: "Professional Life",
  financial: "Financial Health",
  environmental: "Environmental Wellness",
  relational: "Relationships",
  social: "Social Connections",
  recreational: "Recreation & Fun",
  charitable: "Charitable Giving",
}

const categoryIcons = {
  spiritual: Heart,
  mental: Brain,
  physicalMovement: Dumbbell,
  physicalNourishment: Apple,
  physicalSleep: Moon,
  emotional: Smile,
  personal: User,
  intellectual: BookOpen,
  professional: Briefcase,
  financial: DollarSign,
  environmental: TreePine,
  relational: Users2,
  social: Users,
  recreational: Gamepad2,
  charitable: Gift,
}

export default function MyResultsPage() {
  const [auditData, setAuditData] = useState<AuditData | null>(null)
  const [userName, setUserName] = useState("")
  const [copied, setCopied] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatContext, setChatContext] = useState("")
  const [chatTitle, setChatTitle] = useState("")

  useEffect(() => {
    const data = getAuditResults()
    console.log("Retrieved audit data:", data)
    setAuditData(data)
  }, [])

  if (!auditData) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Results Found</h1>
            <p className="text-gray-600 mb-8">Please take the audit first to see your results.</p>
            <Link href="/audit">
              <Button className="bg-[#7FB069] hover:bg-[#6FA055] text-white">Take Audit</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Sort results by percentage (highest first)
  const sortedResults = [...auditData.results].sort((a, b) => b.percentage - a.percentage)

  // Get top 3 recommendations (lowest scoring areas)
  const recommendations = [...auditData.results]
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3)
    .map((result) => ({
      ...result,
      name: categoryLabels[result.category as keyof typeof categoryLabels],
      icon: categoryIcons[result.category as keyof typeof categoryIcons],
    }))

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Excellent balance"
    if (score >= 70) return "Good balance"
    if (score >= 60) return "Fair balance"
    return "Needs attention"
  }

  const handleCopyResults = async () => {
    const namePrefix = userName.trim() ? `Hi Cherry Blossom! My name is ${userName.trim()}.\n\n` : ""
    const auditSummary = `${namePrefix}My Work-Life Balance Audit Results:

Overall Score: ${auditData.overallScore}%
Completed: ${new Date(auditData.timestamp).toLocaleDateString()}

Category Breakdown:
${sortedResults
  .map((result) => {
    const categoryName = categoryLabels[result.category as keyof typeof categoryLabels]
    return `• ${categoryName}: ${result.percentage}%`
  })
  .join("\n")}

Top 3 Areas for Improvement:
${recommendations
  .map((rec, index) => {
    const categoryName = categoryLabels[rec.category as keyof typeof categoryLabels]
    return `${index + 1}. ${categoryName}: ${rec.percentage}%`
  })
  .join("\n")}

Please provide personalized insights and recommendations based on these results.`

    try {
      await navigator.clipboard.writeText(auditSummary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const openChat = (context: string, title: string) => {
    setChatContext(context)
    setChatTitle(title)
    setIsChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/audit">
            <Button className="bg-[#7FB069] hover:bg-[#6FA055] text-white flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Retake The Audit
            </Button>
          </Link>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mx-auto mb-4">
            <img src="/images/logo.png" alt="Logo" className="w-36 h-36 rounded-full" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Work-Life Balance Results</h1>
          <p className="text-gray-600">Completed on {new Date(auditData.timestamp).toLocaleDateString()}</p>
        </div>

        {/* Overall Score */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-gray-900 mb-2">Overall Score: {auditData.overallScore}%</div>
          <p className="text-lg text-gray-600 mb-2">{getScoreMessage(auditData.overallScore)}</p>
        </div>

        {/* Category Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Breakdown</h2>
          <div className="space-y-4">
            {sortedResults.map((result) => {
              const IconComponent = categoryIcons[result.category as keyof typeof categoryIcons]
              const categoryName = categoryLabels[result.category as keyof typeof categoryLabels]

              return (
                <div key={result.category} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{categoryName}</span>
                      <span className="font-bold text-gray-900">{result.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-[#E26C73] to-[#7FB069]"
                        style={{ width: `${result.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top 3 Recommendations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top 3 Recommendations</h2>
          <div className="space-y-6">
            {recommendations.map((rec, index) => {
              const IconComponent = rec.icon
              return (
                <Card key={rec.category} className="border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-[#7FB069]">
                      <IconComponent className="w-6 h-6" />
                      Maintain Your {rec.name}
                    </CardTitle>
                    <p className="text-[#E26C73]">Current score: {rec.percentage}%</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {rec.category === "environmental" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Organize your living space</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Create a comfortable work environment</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Reduce clutter regularly</span>
                          </li>
                        </>
                      )}
                      {rec.category === "spiritual" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Start a daily 5-minute meditation practice</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Reduce clutter regularly</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Practice gratitude journaling</span>
                          </li>
                        </>
                      )}
                      {rec.category === "mental" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Practice stress management techniques</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Set healthy boundaries with work</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Take regular mental health breaks</span>
                          </li>
                        </>
                      )}
                      {rec.category === "physicalMovement" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Add 30 minutes of daily movement</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Take walking breaks during work</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Try a new physical activity weekly</span>
                          </li>
                        </>
                      )}
                      {rec.category === "physicalNourishment" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Plan healthy meals in advance</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Stay hydrated throughout the day</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Eat mindfully without distractions</span>
                          </li>
                        </>
                      )}
                      {rec.category === "physicalSleep" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Establish a consistent bedtime routine</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Limit screen time before bed</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Create a comfortable sleep environment</span>
                          </li>
                        </>
                      )}
                      {rec.category === "emotional" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Practice emotional awareness daily</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Express feelings in healthy ways</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Seek support when needed</span>
                          </li>
                        </>
                      )}
                      {rec.category === "personal" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Set personal development goals</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Dedicate time to hobbies and interests</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Reflect on personal values regularly</span>
                          </li>
                        </>
                      )}
                      {rec.category === "intellectual" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Read for 20 minutes daily</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Learn a new skill monthly</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Engage in stimulating conversations</span>
                          </li>
                        </>
                      )}
                      {rec.category === "professional" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Set clear work-life boundaries</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Pursue professional development</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Communicate effectively with colleagues</span>
                          </li>
                        </>
                      )}
                      {rec.category === "financial" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Create and stick to a budget</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Build an emergency fund</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Review financial goals monthly</span>
                          </li>
                        </>
                      )}
                      {rec.category === "social" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Schedule regular social activities</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Reach out to friends and family</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Join community groups or clubs</span>
                          </li>
                        </>
                      )}
                      {rec.category === "recreational" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Schedule regular fun activities</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Try new hobbies and experiences</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Make time for play and relaxation</span>
                          </li>
                        </>
                      )}
                      {rec.category === "relational" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Invest quality time in relationships</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Practice active listening</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Express appreciation regularly</span>
                          </li>
                        </>
                      )}
                      {rec.category === "charitable" && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Volunteer for causes you care about</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Make regular charitable donations</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069]">•</span>
                            <span>Help others in your community</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/focus-areas">
            <Button className="bg-[#7FB069] hover:bg-[#6FA055] text-white px-8 py-3">
              Set Your Focus Areas
              <Target className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Cherry Blossom Audit Review Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/images/logo.png" alt="Cherry Blossom Logo" className="w-12 h-12 rounded-full" />
              <h2 className="text-2xl font-bold text-gray-900">Get Deeper Insights with Cherry Blossom AI</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Share your audit results with Cherry Blossom AI for personalized insights and recommendations
            </p>
          </div>

          <Card className="border-2 border-[#E26C73]/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Name Input */}
                <div className="mb-6">
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name (Optional)
                  </label>
                  <Input
                    id="userName"
                    type="text"
                    placeholder="Enter your name for personalized chat"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full border-[#E26C73]/30 focus:border-[#E26C73] focus:ring-[#E26C73]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Adding your name will personalize your conversation with Cherry Blossom AI
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-[#E26C73]">Your Audit Summary:</h4>
                  <Button
                    onClick={handleCopyResults}
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 bg-transparent border-[#E26C73] transition-all duration-200 ${
                      copied
                        ? "text-green-600 border-green-600 hover:bg-green-50"
                        : "text-[#E26C73] hover:bg-[#E26C73] hover:text-white"
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy Results"}
                  </Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                  <div className="text-sm text-gray-700 space-y-2">
                    {userName.trim() && (
                      <div className="font-medium text-[#E26C73] mb-2">
                        Hi Cherry Blossom! My name is {userName.trim()}.
                      </div>
                    )}
                    <div className="font-semibold">Overall Score: {auditData.overallScore}%</div>
                    <div className="text-xs text-gray-500">
                      Completed: {new Date(auditData.timestamp).toLocaleDateString()}
                    </div>

                    <div className="mt-4">
                      <div className="font-medium mb-2">Category Breakdown:</div>
                      <div className="space-y-1">
                        {sortedResults.slice(0, 5).map((result) => {
                          const categoryName = categoryLabels[result.category as keyof typeof categoryLabels]
                          return (
                            <div key={result.category} className="flex justify-between">
                              <span>• {categoryName}</span>
                              <span>{result.percentage}%</span>
                            </div>
                          )
                        })}
                        {sortedResults.length > 5 && (
                          <div className="text-xs text-gray-500 italic">
                            ...and {sortedResults.length - 5} more categories
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="font-medium mb-2">Top Areas for Improvement:</div>
                      <div className="space-y-1">
                        {recommendations.map((rec, index) => {
                          const categoryName = categoryLabels[rec.category as keyof typeof categoryLabels]
                          return (
                            <div key={rec.category} className="flex justify-between">
                              <span>
                                {index + 1}. {categoryName}
                              </span>
                              <span>{rec.percentage}%</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#E26C73] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <p className="text-gray-700">Enter your name above (optional) and copy your audit results</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#E26C73] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="text-gray-700">Click "Review Your Audit" to open Cherry Blossom AI</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#E26C73] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <p className="text-gray-700">Paste your results and get personalized insights</p>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    onClick={() => openChat("audit-review", "Review Your Audit with Cherry Blossom")}
                    className="bg-gradient-to-r from-[#E26C73] to-[#7FB069] hover:from-[#D55A60] hover:to-[#6FA055] text-white px-8 py-3"
                  >
                    Review Your Audit with Cherry Blossom
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <SimpleChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={chatContext}
        title={chatTitle}
      />
    </div>
  )
}
