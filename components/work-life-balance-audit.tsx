"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, RotateCcw } from "lucide-react"
import { saveAuditResults } from "@/utils/audit-storage"
import { useRouter } from "next/navigation"

export const categoryLabels = {
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

const questions = [
  {
    id: 1,
    category: "spiritual",
    question:
      "In the past 30 days, how often have you connected to your spiritual life through prayer, study, fellowship, praise, music, meditation, nature, etc...?",
  },
  {
    id: 2,
    category: "mental",
    question:
      "In the past 30 days, how often have you effectively managed stress, made clear decisions, and maintained good mental health?",
  },
  {
    id: 3,
    category: "physicalMovement",
    question: "In the past 30 days, how often have you engaged in intentional movement or exercise?",
  },
  {
    id: 4,
    category: "physicalNourishment",
    question: "In the past 30 days, how often have you nourished your body with adequate hydration and healthy meals?",
  },
  {
    id: 5,
    category: "physicalSleep",
    question: "In the past 30 days, how often have you gone to bed on time and gotten 8 hours of restorative sleep?",
  },
  {
    id: 6,
    category: "emotional",
    question: "In the past 30 days, how often have you felt happy, balanced, peaceful, and joyful emotionally?",
  },
  {
    id: 7,
    category: "personal",
    question: "In the past 30 days, how often have you made time for self-care and personal growth activities?",
  },
  {
    id: 8,
    category: "intellectual",
    question: "In the past 30 days, how often have you engaged in learning something new or a skill-building activity?",
  },
  {
    id: 9,
    category: "professional",
    question:
      "In the past 30 days, how often have you shared your expertise through partnerships, collaboration, public speaking or publishing and/or expanded your professional visibility through media, podcast interviews or publicity?",
  },
  {
    id: 10,
    category: "financial",
    question:
      "In the past 30 days, how often have you focused intentionally on income/revenue generation, financial planning, retirement planning, business valuation and/or exit planning?",
  },
  {
    id: 11,
    category: "environmental",
    question:
      "In the past 30 days, how often have you made effort to create beauty, balance, or order in your home or office environment?",
  },
  {
    id: 12,
    category: "relational",
    question:
      "In the past 30 days, how often have you been attentive and present with your loved ones and in your closest relationships?",
  },
  {
    id: 13,
    category: "social",
    question:
      "In the past 30 days, how often have you engaged with your friends or supportive, like-minded individuals?",
  },
  {
    id: 14,
    category: "recreational",
    question: "In the past 30 days, how often have you created space for joy, creativity, vacation, travel or play?",
  },
  {
    id: 15,
    category: "charitable",
    question:
      "In the past 30 days, how often have you contributed to supporting or inspiring others through donating, charity, volunteering or other philanthropic endeavors?",
  },
]

export default function WorkLifeBalanceAudit() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [results, setResults] = useState<any>(null)
  const router = useRouter()

  const handleAnswer = (questionId: number, score: number) => {
    const newAnswers = { ...answers, [questionId]: score }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults(newAnswers)
    }
  }

  const calculateResults = (finalAnswers: Record<number, number>) => {
    const categoryScores: Record<string, number[]> = {}

    // Group scores by category
    questions.forEach((question) => {
      const score = finalAnswers[question.id] || 0
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = []
      }
      categoryScores[question.category].push(score)
    })

    // Calculate average for each category
    const categoryResults = Object.entries(categoryScores).map(([category, scores]) => {
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
      const percentage = (average / 5) * 100
      return {
        category,
        percentage: Math.round(percentage),
        label: categoryLabels[category as keyof typeof categoryLabels],
      }
    })

    // Calculate overall score
    const overallScore = Math.round(
      categoryResults.reduce((sum, result) => sum + result.percentage, 0) / categoryResults.length,
    )

    const auditResults = {
      overallScore,
      results: categoryResults,
      timestamp: Date.now(),
    }

    setResults(auditResults)
    setIsComplete(true)

    // Save to localStorage
    saveAuditResults(auditResults)
  }

  const restartAudit = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsComplete(false)
    setResults(null)
  }

  const goToResults = () => {
    router.push("/my-results")
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (isComplete && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <div className="flex justify-center mb-6">
              <img
                src="/images/logo.png"
                alt="Make Time For More Logo"
                width={80}
                height={80}
                className="rounded-full shadow-lg"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Audit Complete!</h1>
            <p className="text-lg text-gray-600">Your work-life balance assessment is ready</p>
          </div>

          {/* Results Summary Card */}
          <Card className="bg-white shadow-lg border-2 border-[#7FB069]/20 mb-8">
            <CardHeader className="text-center bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10">
              <CardTitle className="text-2xl font-bold text-gray-900">Your Overall Score</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-[#7FB069] mb-4">{results.overallScore}%</div>
                <Badge variant="secondary" className="bg-[#7FB069]/20 text-[#7FB069] text-lg px-4 py-2 font-semibold">
                  {results.overallScore >= 80
                    ? "Excellent Balance"
                    : results.overallScore >= 70
                      ? "Good Balance"
                      : results.overallScore >= 60
                        ? "Fair Balance"
                        : "Needs Attention"}
                </Badge>
              </div>

              <div className="text-center mb-8">
                <p className="text-lg text-gray-700 mb-4">
                  {results.overallScore >= 80
                    ? "🎉 Congratulations on your excellent work-life balance!"
                    : results.overallScore >= 70
                      ? "🌱 You're on the right track! Your foundation is solid - let's elevate it to the next level together."
                      : "💡 Great awareness! Recognizing these areas is the first step toward transformation. You're exactly where you need to be to create meaningful change."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={goToResults}
                  size="lg"
                  className="bg-[#7FB069] hover:bg-[#6FA055] text-white px-8 py-3"
                >
                  View Detailed Results
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={restartAudit}
                  variant="outline"
                  size="lg"
                  className="border-[#E26C73] text-[#E26C73] hover:bg-[#E26C73] hover:text-white px-8 py-3 bg-transparent"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake Audit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex justify-center mb-6">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Work-Life Balance Audit</h1>
          <p className="text-lg text-gray-600">Discover your current balance across 15 key life areas</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-[#7FB069]">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <Card className="bg-white shadow-lg border-2 border-[#7FB069]/20 mb-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-[#7FB069]/20 text-[#7FB069] text-xl font-bold px-4 py-2">
                {categoryLabels[currentQ.category as keyof typeof categoryLabels]}
              </Badge>
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 leading-relaxed">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-600 mb-6">On a scale from 1 to 5 (1 being never and 5 being always)</p>

              {/* Answer Options */}
              <div className="grid gap-3">
                {[
                  { value: 5, label: "Always", color: "bg-[#2D5016] hover:bg-[#3A6B1E]" },
                  { value: 4, label: "Often", color: "bg-[#4A7C2C] hover:bg-[#5A8F3A]" },
                  { value: 3, label: "Sometimes", color: "bg-[#7FB069] hover:bg-[#8FC279]" },
                  { value: 2, label: "Rarely", color: "bg-[#A8D08D] hover:bg-[#B8E09D]" },
                  { value: 1, label: "Never", color: "bg-[#8FBE73] hover:bg-[#9FCE83]" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => handleAnswer(currentQ.id, option.value)}
                    className={`${option.color} text-white font-medium py-4 text-left justify-start transition-all duration-200 hover:scale-105`}
                    size="lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="font-bold">{option.value}</span>
                      </div>
                      <span>{option.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentQuestion > 0 && (
          <div className="text-center">
            <Button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Previous Question
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
