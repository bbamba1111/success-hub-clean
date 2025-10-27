"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, RotateCcw, Sparkles, Loader2 } from "lucide-react"
import { categoryLabels } from "@/components/work-life-balance-audit"

// Sample audit data for preview
const sampleAuditData = {
  overallScore: 73,
  results: [
    { category: "environmental", percentage: 45 },
    { category: "physicalSleep", percentage: 52 },
    { category: "recreational", percentage: 58 },
    { category: "social", percentage: 65 },
    { category: "emotional", percentage: 68 },
    { category: "financial", percentage: 72 },
    { category: "mental", percentage: 75 },
    { category: "personal", percentage: 78 },
    { category: "physicalMovement", percentage: 80 },
    { category: "intellectual", percentage: 82 },
    { category: "professional", percentage: 85 },
    { category: "physicalNourishment", percentage: 88 },
    { category: "relational", percentage: 90 },
    { category: "spiritual", percentage: 92 },
    { category: "charitable", percentage: 95 },
  ],
  personalizedFeedback: [],
  timestamp: Date.now(),
}

const recommendations: Record<string, string[]> = {
  environmental: ["Organize your living space", "Create a comfortable work environment", "Reduce clutter regularly"],
  physicalSleep: [
    "Maintain consistent sleep schedule",
    "Create a relaxing bedtime routine",
    "Limit screen time before bed",
  ],
  recreational: ["Plan fun activities weekly", "Try new hobbies or interests", "Make time for relaxation"],
}

// Category icons mapping
const categoryIcons: Record<string, string> = {
  environmental: "🏠",
  spiritual: "🙏",
  mental: "🧠",
  physicalMovement: "🏃",
  physicalNourishment: "🥗",
  physicalSleep: "😴",
  emotional: "❤️",
  personal: "⭐",
  intellectual: "📚",
  professional: "💼",
  financial: "💰",
  social: "👥",
  recreational: "🎯",
  relational: "👨‍👩‍👧‍👦",
  charitable: "💝",
}

export default function MyResultsPreview() {
  const [name, setName] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAiReview, setShowAiReview] = useState(false)

  const auditData = sampleAuditData

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-green-500"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 70) return "bg-green-400"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent balance"
    if (score >= 80) return "Good balance"
    if (score >= 70) return "Fair balance"
    return "Needs attention"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "🎉 Congratulations on your excellent work-life balance!"
    if (score >= 80) return "🎉 Congratulations on your excellent work-life balance!"
    if (score >= 70)
      return "🌱 You're on the right track! Your foundation is solid - let's elevate it to the next level together."
    return "💡 Great awareness! Recognizing these areas is the first step toward transformation. You're exactly where you need to be to create meaningful change."
  }

  const getTopRecommendations = () => {
    return auditData.results
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 3)
      .map((result) => ({
        category: result.category,
        name: categoryLabels[result.category],
        score: Math.round(result.percentage),
        recommendations: recommendations[result.category] || ["Focus on improvement in this area"],
        icon: categoryIcons[result.category] || "📊",
      }))
  }

  const generateAuditReview = async () => {
    if (!name.trim()) {
      alert("Please enter your name first")
      return
    }

    setIsLoading(true)
    setShowAiReview(true)

    // Simulate API call
    setTimeout(() => {
      setAiResponse(`Hello ${name}! 🌸

Based on your Work-Life Balance Audit results, I can see you have a solid foundation with an overall score of 73%. This shows you're already on a positive path toward work-life harmony!

**AREAS OF STRENGTH:**
Your highest-scoring areas show beautiful alignment:
• Charitable Giving (95%) - Your generous spirit is shining through
• Spiritual Well-being (92%) - Strong connection to your higher purpose
• Relationships (90%) - Meaningful connections with loved ones

**FOCUS AREAS FOR TRANSFORMATION:**
Your lowest-scoring areas represent your greatest opportunities for growth:

1. **Environmental Wellness (45%)** - This significantly impacts your vibrational frequency. When your physical spaces are cluttered or chaotic, it creates energetic blocks that affect your ability to think clearly and feel peaceful.

2. **Physical Sleep (52%)** - Sleep is when your body repairs and your subconscious mind processes your intentions. Poor sleep patterns disrupt your hormonal balance and make it harder to maintain high vibrational energy.

3. **Recreation & Fun (58%)** - Joy and play are not luxuries - they're essential for maintaining your creative energy and preventing burnout.

**WHY THESE AREAS MATTER FOR YOUR VIBRATIONAL FREQUENCY:**
When these foundational areas are out of balance, they create a ripple effect that impacts everything else. Your environment affects your mental clarity, your sleep affects your emotional regulation, and lack of recreation affects your creativity and joy.

**COURSE CORRECTION STRATEGIES:**
1. Start with your environment - dedicate 15 minutes daily to organizing one small area
2. Create a consistent bedtime routine to honor your body's need for restoration
3. Schedule joy into your calendar - make recreation a non-negotiable

You're ready to transform these areas through intentional co-creation with your Creator. Would you like to set powerful 28-day intentions for these focus areas?`)
      setIsLoading(false)
    }, 2000)
  }

  const topRecommendations = getTopRecommendations()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header Buttons */}
        <div className="flex justify-between items-center mb-8 pt-4">
          <Button variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <Button className="bg-[#7FB069] hover:bg-[#6FA055] text-white">
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake The Audit
          </Button>
        </div>

        {/* Main Results Card */}
        <Card className="bg-white shadow-sm border border-gray-200 mb-8">
          <CardContent className="p-8">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <img
                  src="/images/logo.png"
                  alt="Make Time For More Logo"
                  width={80}
                  height={80}
                  className="rounded-full shadow-lg"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Work-Life Balance Results</h1>
              <p className="text-gray-500">Completed on {new Date(auditData.timestamp).toLocaleDateString()}</p>
            </div>

            {/* Overall Score */}
            <div className="text-center mb-12">
              <div className="text-4xl font-bold text-gray-900 mb-2">Overall Score: {auditData.overallScore}%</div>
              <div className="text-lg text-gray-600 mb-4">{getScoreLabel(auditData.overallScore)}</div>
              <div className="text-green-600 font-medium">{getScoreMessage(auditData.overallScore)}</div>
            </div>

            {/* Category Breakdown */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">Category Breakdown</h2>
              <div className="space-y-4">
                {auditData.results
                  .sort((a, b) => a.percentage - b.percentage)
                  .map((result) => (
                    <div key={result.category} className="flex items-center gap-4">
                      <div className="flex items-center gap-3 w-64">
                        <span className="text-lg">{categoryIcons[result.category]}</span>
                        <span className="font-medium text-gray-900 text-sm">{categoryLabels[result.category]}</span>
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${getProgressColor(result.percentage)}`}
                            style={{ width: `${result.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className={`font-semibold text-sm w-12 text-right ${getScoreColor(result.percentage)}`}>
                        {Math.round(result.percentage)}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Top 3 Recommendations */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Top 3 Recommendations</h2>
              <div className="space-y-4">
                {topRecommendations.map((rec, index) => (
                  <Card key={rec.category} className="border border-red-200 bg-red-50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <span className="text-xl">{rec.icon}</span>
                        <div>
                          <h3 className="font-semibold text-red-700 text-lg">Improve Your {rec.name}</h3>
                          <p className="text-red-600 text-sm">Current score: {rec.score}%</p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {rec.recommendations.map((recommendation, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-red-600 mt-1">•</span>
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cherry Blossom AI Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="text-center mb-6">
                <div className="flex justify-center items-center gap-3 mb-4">
                  <img
                    src="/images/logo.png"
                    alt="Cherry Blossom Logo"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <h3 className="text-xl font-bold text-[#E26C73]">Get Deeper Insights from Cherry Blossom</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Understand WHY these areas matter for your vibrational frequency and work-life harmony.
                </p>
              </div>

              {!showAiReview && (
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={generateAuditReview}
                      disabled={isLoading || !name.trim()}
                      className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cherry Blossom is analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Get Your AI Audit Review
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-gradient-to-r from-[#E26C73] to-[#7FB069] text-white border-0 hover:opacity-90"
                    >
                      Chat with Cherry Blossom 🌸
                    </Button>
                  </div>
                </div>
              )}

              {showAiReview && (
                <div>
                  <h4 className="font-semibold text-[#E26C73] mb-4 text-center">
                    🌸 Cherry Blossom's Insights for You:
                  </h4>
                  <div className="bg-white p-6 rounded-lg border-2 border-[#7FB069] mb-6">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-[#7FB069]" />
                        <span className="ml-3 text-gray-600">Cherry Blossom is analyzing your results...</span>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700">{aiResponse}</div>
                      </div>
                    )}
                  </div>
                  {!isLoading && aiResponse && (
                    <div className="text-center">
                      <Button className="bg-[#7FB069] hover:bg-[#6FA055] text-white px-8 py-3">
                        Continue to Set Your 28-Day Intentions →
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
