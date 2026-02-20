"use client"

import { useState, useEffect, useRef } from "react"
import { saveAuditResults } from "@/utils/audit-storage"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Home,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Brain,
  Leaf,
  Utensils,
  BookOpen,
  DollarSign,
  Users,
  Palette,
  HeartHandshake,
  Moon,
  X,
} from "lucide-react"
import Image from "next/image"
import CherryBlossomConfetti from "./cherry-blossom-confetti"
import type { ReactNode } from "react"
import { useRouter } from "next/navigation"

interface WorkLifeBalanceAuditProps {
  onClose: () => void
  onComplete?: () => void
}

export type Category =
  | "spiritual"
  | "mental"
  | "physicalMovement"
  | "physicalNourishment"
  | "physicalSleep"
  | "emotional"
  | "personal"
  | "intellectual"
  | "professional"
  | "financial"
  | "environmental"
  | "relational"
  | "social"
  | "recreational"
  | "charitable"

type Answer = 1 | 2 | 3 | 4 | 5

interface Question {
  id: string
  number: number
  title: string
  text: string
  category: Category
}

export interface Result {
  category: Category
  score: number
  maxScore: number
  percentage: number
}

const questions: Question[] = [
  {
    id: "q1",
    number: 1,
    title: "Spiritual",
    text: "In the past 30 days, how often have you connected to your spiritual life through prayer, meditation, or nature?",
    category: "spiritual",
  },
  {
    id: "q2",
    number: 2,
    title: "Mental",
    text: "In the past 30 days, how often have you felt focused and clear in your thinking?",
    category: "mental",
  },
  {
    id: "q3",
    number: 3,
    title: "Physical Movement",
    text: "In the past 30 days, how often have you engaged in intentional movement or exercise?",
    category: "physicalMovement",
  },
  {
    id: "q4",
    number: 4,
    title: "Physical Nourishment",
    text: "In the past 30 days, how often have you nourished your body with hydration and healthy meals?",
    category: "physicalNourishment",
  },
  {
    id: "q5",
    number: 5,
    title: "Physical Sleep",
    text: "In the past 30 days, how often have you gone to bed on time and gotten 8 hours of restorative sleep?",
    category: "physicalSleep",
  },
  {
    id: "q6",
    number: 6,
    title: "Emotional",
    text: "In the past 30 days, how often have you felt balanced, peaceful, and joyful emotionally?",
    category: "emotional",
  },
  {
    id: "q7",
    number: 7,
    title: "Personal",
    text: "In the past 30 days, how often have you made time for self-care and personal growth?",
    category: "personal",
  },
  {
    id: "q8",
    number: 8,
    title: "Intellectual",
    text: "In the past 30 days, how often have you engaged in learning or skill-building activities?",
    category: "intellectual",
  },
  {
    id: "q9",
    number: 9,
    title: "Professional Visibility",
    text: "In the past 30 days, how often have you shared your expertise or expanded your professional visibility?",
    category: "professional",
  },
  {
    id: "q10",
    number: 10,
    title: "Financial",
    text: "In the past 30 days, how often have you focused intentionally on income generation and financial planning?",
    category: "financial",
  },
  {
    id: "q11",
    number: 11,
    title: "Environmental",
    text: "In the past 30 days, how often have you made effort to create beauty, balance, or order in your environment?",
    category: "environmental",
  },
  {
    id: "q12",
    number: 12,
    title: "Relational",
    text: "In the past 30 days, how often have you been attentive and present in your closest relationships?",
    category: "relational",
  },
  {
    id: "q13",
    number: 13,
    title: "Social",
    text: "In the past 30 days, how often have you engaged with supportive, like-minded communities?",
    category: "social",
  },
  {
    id: "q14",
    number: 14,
    title: "Recreational",
    text: "In the past 30 days, how often have you created space for joy, creativity, or play?",
    category: "recreational",
  },
  {
    id: "q15",
    number: 15,
    title: "Charitable",
    text: "In the past 30 days, how often have you contributed to supporting or inspiring others?",
    category: "charitable",
  },
]

const answerLabels = ["Never (1)", "Rarely (2)", "Sometimes (3)", "Often (4)", "Consistently (5)"]

export const categoryLabels: Record<Category, string> = {
  spiritual: "Spiritual Life",
  mental: "Mental Clarity",
  physicalMovement: "Physical Movement",
  physicalNourishment: "Physical Nourishment",
  physicalSleep: "Physical Sleep",
  emotional: "Emotional Balance",
  personal: "Personal Growth",
  intellectual: "Intellectual Growth",
  professional: "Professional Visibility",
  financial: "Financial Focus",
  environmental: "Environmental Balance",
  relational: "Relational Presence",
  social: "Social Connection",
  recreational: "Recreational Joy",
  charitable: "Charitable Contribution",
}

const categoryIcons: Record<Category, ReactNode> = {
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

export const recommendations: Record<Category, string[]> = {
  spiritual: [
    "Set aside 10 minutes each morning for meditation or prayer",
    "Connect with nature daily, even if just for a brief walk",
    "Journal about your spiritual insights and growth",
    "Create a sacred space in your home for reflection",
    "Explore spiritual texts or teachings that resonate with you",
  ],
  mental: [
    "Practice mindfulness to improve focus and mental clarity",
    "Take regular breaks during work to reset your mind",
    "Limit multitasking and focus on one task at a time",
    "Use tools like journaling to organize thoughts",
    "Consider a digital detox to reduce mental clutter",
  ],
  physicalMovement: [
    "Schedule movement breaks throughout your workday",
    "Find physical activities you enjoy rather than forcing yourself to exercise",
    "Start with just 10 minutes of intentional movement daily",
    "Try different forms of movement to find what energizes you",
    "Consider walking meetings or standing desks for more movement",
  ],
  physicalNourishment: [
    "Prepare healthy meals and snacks in advance",
    "Set reminders to stay hydrated throughout the day",
    "Eat mindfully, away from screens and work",
    "Focus on adding nutritious foods rather than restricting",
    "Listen to your body's hunger and fullness cues",
  ],
  physicalSleep: [
    "Create a consistent sleep schedule, even on weekends",
    "Develop a calming bedtime routine",
    "Make your bedroom a sleep sanctuary (dark, quiet, cool)",
    "Avoid screens at least 30 minutes before bed",
    "Consider sleep tracking to understand your patterns",
  ],
  emotional: [
    "Practice naming your emotions without judgment",
    "Schedule time for activities that bring you joy",
    "Create healthy boundaries to protect your emotional energy",
    "Consider working with a therapist or coach",
    "Use breathing techniques to manage stress in the moment",
  ],
  personal: [
    "Block non-negotiable time for self-care in your calendar",
    "Start a personal growth practice like journaling or reading",
    "Identify your core values and align your actions with them",
    "Practice saying no to commitments that drain you",
    "Celebrate your wins, no matter how small",
  ],
  intellectual: [
    "Set aside time for learning something new each week",
    "Join communities or groups related to your interests",
    "Read books or listen to podcasts that expand your thinking",
    "Take online courses or attend workshops",
    "Engage in meaningful conversations with diverse perspectives",
  ],
  professional: [
    "Share your expertise through content creation or speaking",
    "Update your professional profiles and portfolio regularly",
    "Network intentionally with peers and potential collaborators",
    "Seek opportunities to showcase your unique skills",
    "Collect and share testimonials from satisfied clients",
  ],
  financial: [
    "Schedule weekly money dates to review finances",
    "Create clear financial goals aligned with your values",
    "Track your income and expenses consistently",
    "Identify and focus on your most profitable activities",
    "Consider working with a financial advisor",
  ],
  environmental: [
    "Declutter one small area of your home or office each week",
    "Create a dedicated workspace that inspires productivity",
    "Add elements of beauty to your environment (plants, art, etc.)",
    "Establish systems to maintain order in your space",
    "Consider how your environment affects your energy and mood",
  ],
  relational: [
    "Create tech-free zones or times for deeper connection",
    "Practice active listening without planning your response",
    "Schedule quality time with loved ones in your calendar",
    "Express appreciation and gratitude regularly",
    "Be fully present during interactions with others",
  ],
  social: [
    "Join communities aligned with your values and interests",
    "Schedule regular check-ins with friends and colleagues",
    "Attend events or gatherings that energize rather than drain you",
    "Set boundaries around social media consumption",
    "Nurture relationships that support your growth",
  ],
  recreational: [
    "Schedule time for play and creativity with no productive purpose",
    "Explore new hobbies or revisit ones you've enjoyed in the past",
    "Take breaks throughout your day for small moments of joy",
    "Plan regular outings or activities that bring you pleasure",
    "Allow yourself to fully engage in recreational activities without guilt",
  ],
  charitable: [
    "Identify ways to share your expertise that energize rather than drain you",
    "Set clear boundaries around your giving to prevent burnout",
    "Find causes aligned with your values and strengths",
    "Consider how you can make the most impact with your unique gifts",
    "Schedule regular reflection on how your contributions affect you and others",
  ],
}

export const cherryBlossomFeedback: Record<Category, string> = {
  spiritual: "Take 5-10 minutes each morning to ground yourself through deep breathing or gratitude journaling.",
  mental: "Clear mental fog with a quick brain dump of lingering thoughts at the start or end of your day.",
  physicalMovement: "Incorporate 10-minute movement breaks between meetings to energize your body and mind.",
  physicalNourishment:
    "Prepare a water bottle and healthy snacks the night before to support your nutrition throughout the day.",
  physicalSleep: "Implement a digital detox 30 minutes before bed to support restful sleep.",
  emotional: "Reconnect with your heart space by placing a hand over your chest and breathing deeply for 5 minutes.",
  personal: "Schedule non-negotiable self-care blocks in your calendar with the same priority as client meetings.",
  intellectual: "Dedicate 15 minutes daily to reading or learning something new that expands your thinking.",
  professional: "Share one key insight with your audience today to increase your visibility.",
  financial: "Set aside 30 minutes weekly to review your finances and align your spending with your priorities.",
  environmental: "Create one small beauty spot in your workspace that brings you joy when you see it.",
  relational: "Establish tech-free zones or times to be fully present with your loved ones.",
  social: "Reach out to one supportive colleague or friend weekly for connection and mutual support.",
  recreational: "Block time for one activity weekly that brings you pure joy with no productive purpose.",
  charitable: "Identify one way to share your expertise that supports others without depleting your energy.",
}

export default function WorkLifeBalanceAudit({ onClose, onComplete }: WorkLifeBalanceAuditProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [results, setResults] = useState<Result[]>([])
  const [overallScore, setOverallScore] = useState(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isCherryPromptCopied, setIsCherryPromptCopied] = useState(false)
  const [personalizedFeedback, setPersonalizedFeedback] = useState<{ category: Category; feedback: string }[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const cherryBlossomPromptRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  const totalSteps = questions.length
  const progress = (currentStep / totalSteps) * 100
  const isLastQuestion = currentStep === totalSteps - 1
  const isResultsPage = currentStep === totalSteps
  const isPerfectScore = overallScore === 100
  const isExcellentScore = overallScore >= 80

  useEffect(() => {
    // Send message to parent window if in iframe when audit is completed
    if (isResultsPage && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "audit_completed",
          nextStep: "results",
        },
        "*",
      )
    }

    // Show confetti if on results page and score is good
    if (isResultsPage && overallScore >= 70) {
      setShowConfetti(true)

      // Hide confetti after 8 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 8000)

      return () => clearTimeout(timer)
    }
  }, [isResultsPage, overallScore])

  const handleAnswer = (value: string) => {
    const currentQuestion = questions[currentStep]
    setAnswers({
      ...answers,
      [currentQuestion.id]: Number.parseInt(value) as Answer,
    })
  }

  const handleNext = () => {
    if (isLastQuestion) {
      calculateResults()

      // Mark the audit as completed when user reaches results page
      if (onComplete) {
        onComplete()
      }
    }
    setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setAnswers({})
    setResults([])
    // Clear the "don't show again" setting and redirect to home
    localStorage.removeItem("dontShowAuditWelcome")
    router.push("/")
  }

  const calculateResults = () => {
    const categoryScores: Record<Category, { score: number; count: number }> = {
      spiritual: { score: 0, count: 0 },
      mental: { score: 0, count: 0 },
      physicalMovement: { score: 0, count: 0 },
      physicalNourishment: { score: 0, count: 0 },
      physicalSleep: { score: 0, count: 0 },
      emotional: { score: 0, count: 0 },
      personal: { score: 0, count: 0 },
      intellectual: { score: 0, count: 0 },
      professional: { score: 0, count: 0 },
      financial: { score: 0, count: 0 },
      environmental: { score: 0, count: 0 },
      relational: { score: 0, count: 0 },
      social: { score: 0, count: 0 },
      recreational: { score: 0, count: 0 },
      charitable: { score: 0, count: 0 },
    }

    questions.forEach((question) => {
      const answer = answers[question.id] || 0
      categoryScores[question.category].score += answer
      categoryScores[question.category].count += 1
    })

    const calculatedResults: Result[] = Object.entries(categoryScores).map(([category, data]) => {
      const maxScore = data.count * 5
      const percentage = (data.score / maxScore) * 100

      return {
        category: category as Category,
        score: data.score,
        maxScore,
        percentage,
      }
    })

    // Sort results by percentage (lowest to highest)
    calculatedResults.sort((a, b) => a.percentage - b.percentage)

    // Calculate overall score
    const totalScore = calculatedResults.reduce((sum, result) => sum + result.score, 0)
    const totalMaxScore = calculatedResults.reduce((sum, result) => sum + result.maxScore, 0)
    const overallPercentage = Math.round((totalScore / totalMaxScore) * 100)

    // Get personalized feedback for the 3-5 lowest scoring categories
    const lowestCategories = calculatedResults.slice(0, Math.min(5, calculatedResults.length))
    const feedback = lowestCategories.map((result) => ({
      category: result.category,
      feedback: cherryBlossomFeedback[result.category],
    }))

    setResults(calculatedResults)
    setOverallScore(overallPercentage)
    setPersonalizedFeedback(feedback)

    // Save results to localStorage
    saveAuditResults(name, email, overallPercentage, calculatedResults, feedback)

    // Navigate to results page after completing audit
    setTimeout(() => {
      router.push("/my-results")
    }, 1000)
  }

  const currentQuestion = questions[currentStep]

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center p-2">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-[600px] w-full h-[98vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Add confetti effect for good scores on results page */}
        {showConfetti && <CherryBlossomConfetti duration={8} speed="fast" />}

        <div className="p-6 flex flex-col h-full">
          {!isResultsPage && (
            <div className="mb-4 flex-shrink-0">
              {/* Minimal top spacing */}
              <div className="h-2"></div>

              <div className="flex justify-center mb-4">
                <Image
                  src="/images/logo.png"
                  alt="Make Time For More Logo"
                  width={118}
                  height={118}
                  className="rounded-full"
                />
              </div>
              <h2 className="text-2xl brand-title text-center text-brand-pink mb-1">Make Time For More™</h2>
              <h3 className="text-xl brand-subtitle text-center text-black mb-4">Work-Life Balance Audit</h3>
              <p className="text-gray-600 text-center text-sm">
                Based on the 13 Core Life Value Areas from the Make Time For More™ Work-Life Balance Experience
              </p>
            </div>
          )}

          {isResultsPage && (
            <div className="mb-6">
              {/* 1 inch whitespace + 25% more = 120px */}
              <div className="h-40"></div>

              <div className="flex justify-center mb-4">
                <Image
                  src="/images/logo.png"
                  alt="Make Time For More Logo"
                  width={94}
                  height={94}
                  className="rounded-full"
                />
              </div>
              <h2 className="text-xl brand-title text-center text-brand-pink mb-1">Make Time For More™</h2>
              <h3 className="text-lg text-center text-black mb-4">Your Work-Life Balance Results Are In</h3>
              <p className="text-center text-gray-600 text-sm">Redirecting to your results page...</p>
            </div>
          )}

          {!isResultsPage && (
            <div className="mb-3 flex-shrink-0">
              <div className="flex justify-between text-sm mb-2">
                <span>
                  Question {currentStep + 1} of {totalSteps}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {!isResultsPage && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-2">
                    On a scale from 1 to 5, where 1 = Never and 5 = Consistently:
                  </p>
                </div>
                <h3 className="text-lg header-bold mb-2">
                  <span className="inline-block bg-brand-pink text-white rounded-full w-7 h-7 text-center leading-7 mr-2 text-sm">
                    {currentQuestion.number}
                  </span>
                  {currentQuestion.title}
                </h3>
                <p className="mb-4 text-black leading-relaxed">{currentQuestion.text}</p>
                <RadioGroup
                  value={answers[currentQuestion.id]?.toString() || ""}
                  onValueChange={handleAnswer}
                  className="space-y-2"
                >
                  {answerLabels.map((label, index) => (
                    <div key={index} className="flex items-center space-x-3 border p-2 rounded-md hover:bg-gray-50">
                      <RadioGroupItem value={(index + 1).toString()} id={`answer-${index}`} />
                      <Label htmlFor={`answer-${index}`} className="flex-1 cursor-pointer text-sm">
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between pt-4 border-t mt-4 flex-shrink-0">
                {currentStep > 0 ? (
                  <Button variant="outline" onClick={handlePrevious} className="px-4 py-2">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}

                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion?.id]}
                  className="bg-brand-pink hover:bg-brand-green active:bg-green-700 text-white px-4 py-2 transition-colors"
                >
                  {isLastQuestion ? "See Results" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
