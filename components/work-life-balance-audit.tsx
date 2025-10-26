"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { CheckCircle, ArrowRight } from 'lucide-react'

interface Question {
  id: string
  category: string
  text: string
}

interface AuditResults {
  results: Array<{
    category: string
    score: number
    total: number
    percentage: number
  }>
  overallScore: number
  date: string
}

const questions: Question[] = [
  { id: "spiritual", category: "spiritual", text: "I regularly engage in spiritual practices (prayer, meditation, reflection)" },
  { id: "mental", category: "mental", text: "I take time for mental wellness and manage stress effectively" },
  { id: "physicalMovement", category: "physicalMovement", text: "I engage in regular physical activity and movement" },
  { id: "physicalNourishment", category: "physicalNourishment", text: "I eat nutritious meals and maintain healthy eating habits" },
  { id: "physicalSleep", category: "physicalSleep", text: "I get adequate, quality sleep consistently" },
  { id: "emotional", category: "emotional", text: "I am aware of and manage my emotions effectively" },
  { id: "personal", category: "personal", text: "I dedicate time to personal interests and self-development" },
  { id: "intellectual", category: "intellectual", text: "I engage in learning and intellectual growth" },
  { id: "professional", category: "professional", text: "I maintain healthy work boundaries and find satisfaction in my work" },
  { id: "financial", category: "financial", text: "I feel secure about my financial situation and planning" },
  { id: "environmental", category: "environmental", text: "My living and working spaces support my wellbeing" },
  { id: "relational", category: "relational", text: "I nurture meaningful relationships with family and close ones" },
  { id: "social", category: "social", text: "I maintain satisfying social connections and friendships" },
  { id: "recreational", category: "recreational", text: "I regularly engage in fun and recreational activities" },
  { id: "charitable", category: "charitable", text: "I contribute to my community through giving or volunteering" },
]

export const categoryLabels: Record<string, string> = {
  spiritual: "Spiritual Wellness",
  mental: "Mental Wellness", 
  physicalMovement: "Physical Movement",
  physicalNourishment: "Physical Nourishment",
  physicalSleep: "Sleep Quality",
  emotional: "Emotional Wellness",
  personal: "Personal Development",
  intellectual: "Intellectual Growth",
  professional: "Professional Balance",
  financial: "Financial Wellness",
  environmental: "Environmental Wellness",
  relational: "Family Relationships",
  social: "Social Connections",
  recreational: "Recreation & Fun",
  charitable: "Community Contribution",
}

export default function WorkLifeBalanceAudit() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<AuditResults | null>(null)

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults(newAnswers)
    }
  }

  const calculateResults = (finalAnswers: Record<string, number>) => {
    const categoryScores: Record<string, { score: number; total: number }> = {}

    questions.forEach((question) => {
      const score = finalAnswers[question.id] || 0
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { score: 0, total: 0 }
      }
      categoryScores[question.category].score += score
      categoryScores[question.category].total += 5
    })

    const categoryResults = Object.entries(categoryScores).map(([category, { score, total }]) => ({
      category,
      score,
      total,
      percentage: Math.round((score / total) * 100),
    }))

    const totalScore = categoryResults.reduce((sum, cat) => sum + cat.score, 0)
    const totalPossible = categoryResults.reduce((sum, cat) => sum + cat.total, 0)
    const overallScore = Math.round((totalScore / totalPossible) * 100)

    const auditResults: AuditResults = {
      results: categoryResults,
      overallScore,
      date: new Date().toISOString(),
    }

    setResults(auditResults)
    localStorage.setItem("auditResults", JSON.stringify(auditResults))
    setShowResults(true)
  }

  const progress = ((currentQuestion + (answers[questions[currentQuestion]?.id] ? 1 : 0)) / questions.length) * 100

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                M
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Work-Life Balance Audit Results</h1>
            <p className="text-xl text-gray-600">Overall Score: {results.overallScore}%</p>
          </div>

          <Card className="mb-8 border-2 border-[#7FB069]">
            <CardHeader>
              <CardTitle className="text-2xl text-[#7FB069]">Your Life Balance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.results
                  .sort((a, b) => a.percentage - b.percentage)
                  .map((result) => (
                    <div key={result.category}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{categoryLabels[result.category]}</span>
                        <span className="text-sm font-semibold text-gray-600">{result.percentage}%</span>
                      </div>
                      <Progress value={result.percentage} className="h-2" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Link href="/focus-areas">
              <Button size="lg" className="w-full bg-[#7FB069] hover:bg-[#E26C73] text-white">
                Choose Your Focus Areas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              M
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Work-Life Balance Audit</h1>
          <p className="text-lg text-gray-600 mb-6">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <Progress value={progress} className="h-3 mb-4" />
        </div>

        <Card className="border-2 border-[#7FB069]">
          <CardHeader>
            <Badge className="w-fit mb-4 bg-[#7FB069]">{categoryLabels[questions[currentQuestion].category]}</Badge>
            <CardTitle className="text-2xl">{questions[currentQuestion].text}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup onValueChange={(value) => handleAnswer(Number.parseInt(value))}>
              <div className="space-y-4">
                {[
                  { value: 5, label: "Strongly Agree", color: "bg-[#7FB069]" },
                  { value: 4, label: "Agree", color: "bg-[#7FB069]/70" },
                  { value: 3, label: "Neutral", color: "bg-gray-400" },
                  { value: 2, label: "Disagree", color: "bg-[#E26C73]/70" },
                  { value: 1, label: "Strongly Disagree", color: "bg-[#E26C73]" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-[#7FB069] transition-all cursor-pointer"
                    onClick={() => handleAnswer(option.value)}
                  >
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <Label
                      htmlFor={`option-${option.value}`}
                      className="flex-1 cursor-pointer text-lg font-medium"
                    >
                      {option.label}
                    </Label>
                    <div className={`w-12 h-3 rounded ${option.color}`} />
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {currentQuestion > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => setCurrentQuestion(currentQuestion - 1)}>
              Previous Question
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}