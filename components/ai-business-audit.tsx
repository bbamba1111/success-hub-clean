"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, ArrowLeft, CheckCircle, Loader2, Sparkles } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

interface AssessmentData {
  // Part 1: Foundation (Who You Are)
  passion: string
  purpose: string
  values: string[]
  zoneOfGenius: string
  lifestylePreference: string
  workHoursPreference: string

  // Part 2: Vision (Where You Want To Go)
  revenueGoal: string
  businessSizeVision: string
  teamPreference: string

  // Part 3: Current State (Where You Are)
  startingStatus: string
  businessType: string
  industry: string
  currentRevenue?: string
  teamSize?: string
  dailyTasks: string[]
  workingTasks: string[]
  hatingTasks: string[]
  notWorkingTasks: string[]
  painPoints: string[]

  // Part 4: AI & Implementation
  aiExperience: string
  currentAiTools: string[]
  desiredHoursBack: string
  goals: string[]

  // Part 5: Plan Selection
  planDuration: string

  // Part 6: Life Values Assessment
  lifeValuePriorities?: string[]
}

const PASSIONS = [
  "Teaching & Coaching",
  "Creating Content",
  "Building Communities",
  "Problem Solving",
  "Strategic Thinking",
  "Creative Expression",
  "Helping Others Transform",
  "Innovation & Technology",
]

const VALUES = [
  "Freedom & Flexibility",
  "Family First",
  "Impact & Purpose",
  "Financial Security",
  "Creativity & Innovation",
  "Authenticity",
  "Community & Connection",
  "Continuous Growth",
  "Work-Life Balance",
  "Legacy Building",
]

const LIFESTYLE_PREFERENCES = [
  { value: "digital-nomad", label: "Digital Nomad - Work from anywhere, travel often" },
  { value: "home-based", label: "Home-Based - Stable location, home office" },
  { value: "hybrid", label: "Hybrid - Mix of home and co-working/office" },
  { value: "location-dependent", label: "Location Dependent - In-person business model" },
]

const WORK_HOURS = [
  { value: "4-hours", label: "4 hours/day (20 hours/week) - Maximum freedom model" },
  { value: "6-hours", label: "6 hours/day (30 hours/week) - Balanced approach" },
  { value: "8-hours", label: "8 hours/day (40 hours/week) - Traditional but sustainable" },
  { value: "flexible", label: "Flexible - Varies by season/project" },
]

const REVENUE_GOALS = [
  { value: "100k", label: "$100K/year - Sustainable solo freedom" },
  { value: "250k", label: "$250K/year - Comfortable lifestyle business" },
  { value: "500k", label: "$500K/year - Small team, strong impact" },
  { value: "1m", label: "$1M/year - Scalable business model" },
  { value: "5m", label: "$5M/year - Growing company" },
  { value: "10m", label: "$10M/year - Established enterprise" },
  { value: "50m", label: "$50M/year - Major industry player" },
  { value: "100m+", label: "$100M+ - Large-scale operation" },
  { value: "1b+", label: "$1B+ - Unicorn vision" },
]

const BUSINESS_SIZE_VISION = [
  { value: "boutique-solo", label: "Boutique Solo - Just me + AI, maximum freedom" },
  { value: "small-team", label: "Small Team - 2-5 people + AI systems" },
  { value: "mid-size", label: "Mid-Size - 10-50 people, scalable systems" },
  { value: "enterprise", label: "Enterprise - 50+ people, multiple departments" },
]

const TEAM_PREFERENCE = [
  { value: "solo-ai", label: "Solo + AI - No human team, fully automated" },
  { value: "contractors", label: "Contractors + AI - Project-based humans, AI for operations" },
  { value: "small-team", label: "Small Core Team + AI - Key people, AI for scale" },
  { value: "full-team", label: "Full Team + AI - Traditional structure, AI-enhanced" },
]

const BUSINESS_TYPES = [
  "Coach/Consultant",
  "Course Creator/Educator",
  "Service Provider",
  "E-commerce/Product Business",
  "Content Creator/Influencer",
  "Agency Owner",
  "Software/SaaS",
  "Community/Membership",
  "Freelancer/Specialist",
  "Hybrid Business Model",
]

const DAILY_TASKS = [
  "Email management",
  "Social media posting",
  "Customer service/support",
  "Content creation",
  "Scheduling/calendar management",
  "Data entry",
  "Marketing campaigns",
  "Administrative tasks",
  "Bookkeeping/invoicing",
  "Sales calls/follow-ups",
  "Team management",
  "Client onboarding",
]

const PAIN_POINTS = [
  "Too much time on repetitive tasks",
  "Difficulty scaling my business",
  "Overwhelmed by admin work",
  "No time for strategy/growth",
  "Inconsistent client communication",
  "Manual processes taking too long",
  "Struggling to delegate effectively",
  "Working too many hours",
  "Can't take time off without business suffering",
]

const AI_TOOLS = [
  "ChatGPT/Claude/AI Assistants",
  "Automated email responses",
  "Social media schedulers",
  "AI writing assistants",
  "Customer service chatbots",
  "AI design tools (Canva AI, Midjourney)",
  "Project management automation",
  "AI video/audio editing",
  "None yet",
]

const GOALS = [
  "Work 4-hour workdays",
  "Achieve 4-day work weeks",
  "Scale revenue without more hours",
  "Free up time for family/life",
  "Focus on strategy, not operations",
  "Build systems that run without me",
  "Transition from doing to leading",
  "Create passive income streams",
]

const LIFE_VALUE_AREAS = [
  { value: "spiritual", label: "Spiritual", description: "Gratitude and purposeful living" },
  { value: "mental", label: "Mental", description: "Strengthening focus and clarity" },
  { value: "physical", label: "Physical", description: "Prioritizing movement, hydration, and health" },
  { value: "emotional", label: "Emotional", description: "Cultivating joy and inner peace" },
  { value: "personal", label: "Personal", description: "Self-care and personal growth" },
  { value: "intellectual", label: "Intellectual", description: "Expanding knowledge and skills" },
  { value: "financial", label: "Financial", description: "Income-generating focus and intentional planning" },
  { value: "environmental", label: "Environmental", description: "Creating balance in your surroundings" },
  { value: "relational", label: "Relational", description: "Strengthening meaningful connections" },
  { value: "social", label: "Social", description: "Building supportive communities" },
  { value: "recreational", label: "Recreational", description: "Embracing creativity and leisure" },
  { value: "charitable", label: "Charitable", description: "Giving back and inspiring others" },
]

export function AIBusinessAudit() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [data, setData] = useState<AssessmentData>({
    passion: "",
    purpose: "",
    values: [],
    zoneOfGenius: "",
    lifestylePreference: "",
    workHoursPreference: "",
    revenueGoal: "",
    businessSizeVision: "",
    teamPreference: "",
    startingStatus: "",
    businessType: "",
    industry: "",
    dailyTasks: [],
    workingTasks: [],
    hatingTasks: [],
    notWorkingTasks: [],
    painPoints: [],
    aiExperience: "",
    currentAiTools: [],
    desiredHoursBack: "",
    goals: [],
    planDuration: "",
    lifeValuePriorities: [],
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleNext = () => {
    if (step < 8) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert("Please log in to save your assessment")
        return
      }

      // Save comprehensive assessment to database
      const { error } = await supabase.from("assessments").insert({
        user_id: user.id,
        business_type: data.businessType,
        industry: data.industry,
        entrepreneurial_status: data.startingStatus,
        ai_readiness_level: data.aiExperience,
        goals: data.goals,
        completed_date: new Date().toISOString(),
        life_value_priorities: data.lifeValuePriorities,
      })

      if (error) throw error

      setIsComplete(true)
    } catch (error) {
      console.error("Error saving assessment:", error)
      alert("There was an error saving your assessment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item)
    }
    return [...array, item]
  }

  if (isComplete) {
    return (
      <Card className="border-2 border-[#7FB069] bg-gradient-to-br from-white to-[#7FB069]/5">
        <CardContent className="p-12 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[#7FB069] flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-[#7FB069]">Assessment Complete!</h3>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Based on your passion, purpose, and vision, we're generating your personalized AI-First Business Roadmap.
            Your custom {data.planDuration}-month plan will show you exactly which tools to implement, which human
            skills to develop, and how to build your business around your zone of genius.
          </p>
          <div className="flex justify-center gap-4 pt-6">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              View Your AI-First Roadmap
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-[#7FB069]/30 bg-white">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-2xl font-bold text-[#7FB069]">AI-First Business Blueprint</CardTitle>
          <span className="text-sm text-gray-500">Step {step} of 8</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 8) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Foundation - Passion & Purpose */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Part 1: Who You Are</h3>
              <p className="text-gray-600 mb-6">
                Let's start with your passion and purpose - the foundation of your AI-First business
              </p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="passion" className="text-base font-semibold text-gray-700 mb-2">
                    What are you most passionate about? What lights you up?
                  </Label>
                  <Textarea
                    id="passion"
                    placeholder="Describe what you love doing, what energizes you, what you could talk about for hours..."
                    value={data.passion}
                    onChange={(e) => setData({ ...data, passion: e.target.value })}
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="purpose" className="text-base font-semibold text-gray-700 mb-2">
                    What's your purpose? Why does your business exist?
                  </Label>
                  <Textarea
                    id="purpose"
                    placeholder="Beyond making money, what impact do you want to have? Who do you want to serve and transform?"
                    value={data.purpose}
                    onChange={(e) => setData({ ...data, purpose: e.target.value })}
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3">
                    What are your core values? (Select all that resonate)
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {VALUES.map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={value}
                          checked={data.values.includes(value)}
                          onCheckedChange={() => setData({ ...data, values: toggleArrayItem(data.values, value) })}
                        />
                        <Label htmlFor={value} className="font-normal cursor-pointer text-sm">
                          {value}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="zoneOfGenius" className="text-base font-semibold text-gray-700 mb-2">
                    What's your authentic zone of genius? What are you uniquely great at?
                  </Label>
                  <Textarea
                    id="zoneOfGenius"
                    placeholder="What do people always come to you for? What feels easy to you but hard for others? What's your superpower?"
                    value={data.zoneOfGenius}
                    onChange={(e) => setData({ ...data, zoneOfGenius: e.target.value })}
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Lifestyle Design */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Design Your Ideal Lifestyle</h3>
              <p className="text-gray-600 mb-6">Your business should support your life, not consume it</p>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3">
                    What's your ideal lifestyle preference?
                  </Label>
                  <RadioGroup
                    value={data.lifestylePreference}
                    onValueChange={(value) => setData({ ...data, lifestylePreference: value })}
                  >
                    {LIFESTYLE_PREFERENCES.map((pref) => (
                      <div key={pref.value} className="flex items-start space-x-2 py-2">
                        <RadioGroupItem value={pref.value} id={pref.value} className="mt-1" />
                        <Label htmlFor={pref.value} className="font-normal cursor-pointer leading-relaxed">
                          {pref.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3">
                    How many hours do you WANT to work per day?
                  </Label>
                  <RadioGroup
                    value={data.workHoursPreference}
                    onValueChange={(value) => setData({ ...data, workHoursPreference: value })}
                  >
                    {WORK_HOURS.map((hours) => (
                      <div key={hours.value} className="flex items-start space-x-2 py-2">
                        <RadioGroupItem value={hours.value} id={hours.value} className="mt-1" />
                        <Label htmlFor={hours.value} className="font-normal cursor-pointer leading-relaxed">
                          {hours.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Vision - Revenue & Business Size */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your Business Vision</h3>
              <p className="text-gray-600 mb-6">Where do you want to go?</p>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3">What's your revenue goal?</Label>
                  <RadioGroup
                    value={data.revenueGoal}
                    onValueChange={(value) => setData({ ...data, revenueGoal: value })}
                  >
                    {REVENUE_GOALS.map((goal) => (
                      <div key={goal.value} className="flex items-start space-x-2 py-2">
                        <RadioGroupItem value={goal.value} id={goal.value} className="mt-1" />
                        <Label htmlFor={goal.value} className="font-normal cursor-pointer leading-relaxed">
                          {goal.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3">What's your ideal business size?</Label>
                  <RadioGroup
                    value={data.businessSizeVision}
                    onValueChange={(value) => setData({ ...data, businessSizeVision: value })}
                  >
                    {BUSINESS_SIZE_VISION.map((size) => (
                      <div key={size.value} className="flex items-start space-x-2 py-2">
                        <RadioGroupItem value={size.value} id={size.value} className="mt-1" />
                        <Label htmlFor={size.value} className="font-normal cursor-pointer leading-relaxed">
                          {size.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3">
                    Team preference - How do you want to work?
                  </Label>
                  <RadioGroup
                    value={data.teamPreference}
                    onValueChange={(value) => setData({ ...data, teamPreference: value })}
                  >
                    {TEAM_PREFERENCE.map((team) => (
                      <div key={team.value} className="flex items-start space-x-2 py-2">
                        <RadioGroupItem value={team.value} id={team.value} className="mt-1" />
                        <Label htmlFor={team.value} className="font-normal cursor-pointer leading-relaxed">
                          {team.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Current State - Starting vs Existing */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Where You Are Now</h3>
              <p className="text-gray-600 mb-6">Tell us about your current business situation</p>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3">
                    Are you starting from scratch or transforming an existing business?
                  </Label>
                  <RadioGroup
                    value={data.startingStatus}
                    onValueChange={(value) => setData({ ...data, startingStatus: value })}
                  >
                    <div className="flex items-start space-x-2 py-2">
                      <RadioGroupItem value="from-scratch" id="from-scratch" className="mt-1" />
                      <Label htmlFor="from-scratch" className="font-normal cursor-pointer leading-relaxed">
                        Starting from scratch - Building an AI-First business from day one
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2 py-2">
                      <RadioGroupItem value="existing-transform" id="existing-transform" className="mt-1" />
                      <Label htmlFor="existing-transform" className="font-normal cursor-pointer leading-relaxed">
                        Existing business - Want to transform and automate with AI
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3">
                    What type of business? (or will it be?)
                  </Label>
                  <RadioGroup
                    value={data.businessType}
                    onValueChange={(value) => setData({ ...data, businessType: value })}
                  >
                    {BUSINESS_TYPES.map((type) => (
                      <div key={type} className="flex items-center space-x-2 py-1">
                        <RadioGroupItem value={type} id={type} />
                        <Label htmlFor={type} className="font-normal cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="industry" className="text-base font-semibold text-gray-700 mb-2">
                    Industry or niche
                  </Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Health & Wellness, Marketing, Tech, Finance, Education"
                    value={data.industry}
                    onChange={(e) => setData({ ...data, industry: e.target.value })}
                    className="mt-2"
                  />
                </div>

                {data.startingStatus === "existing-transform" && (
                  <>
                    <div>
                      <Label htmlFor="currentRevenue" className="text-base font-semibold text-gray-700 mb-2">
                        Current annual revenue (approximate)
                      </Label>
                      <Input
                        id="currentRevenue"
                        placeholder="e.g., $50K, $200K, $1M"
                        value={data.currentRevenue || ""}
                        onChange={(e) => setData({ ...data, currentRevenue: e.target.value })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="teamSize" className="text-base font-semibold text-gray-700 mb-2">
                        Current team size
                      </Label>
                      <Input
                        id="teamSize"
                        placeholder="e.g., Just me, 3 people, 10 people"
                        value={data.teamSize || ""}
                        onChange={(e) => setData({ ...data, teamSize: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Task Audit (for existing businesses) or Skills Assessment (for new) */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {data.startingStatus === "existing-transform"
                  ? "What's your current workload?"
                  : "What tasks will you need to handle?"}
              </h3>
              <p className="text-gray-600 mb-6">
                {data.startingStatus === "existing-transform"
                  ? "Let's identify what's working, what's not, and what you hate doing"
                  : "Select the tasks your business will require"}
              </p>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3">
                    {data.startingStatus === "existing-transform"
                      ? "Daily/weekly tasks you currently do:"
                      : "Tasks your business will require:"}
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {DAILY_TASKS.map((task) => (
                      <div key={task} className="flex items-center space-x-2">
                        <Checkbox
                          id={task}
                          checked={data.dailyTasks.includes(task)}
                          onCheckedChange={() =>
                            setData({ ...data, dailyTasks: toggleArrayItem(data.dailyTasks, task) })
                          }
                        />
                        <Label htmlFor={task} className="font-normal cursor-pointer text-sm">
                          {task}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {data.startingStatus === "existing-transform" && (
                  <>
                    <div>
                      <Label htmlFor="workingTasks" className="text-base font-semibold text-gray-700 mb-2">
                        What's working well? (Tasks you LOVE doing that move the needle)
                      </Label>
                      <Textarea
                        id="workingTasks"
                        placeholder="List the tasks that energize you and produce results..."
                        value={data.workingTasks.join("\n")}
                        onChange={(e) => setData({ ...data, workingTasks: e.target.value.split("\n") })}
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="hatingTasks" className="text-base font-semibold text-gray-700 mb-2">
                        What do you HATE doing? (Prime candidates for AI automation)
                      </Label>
                      <Textarea
                        id="hatingTasks"
                        placeholder="List the soul-draining tasks that waste your genius..."
                        value={data.hatingTasks.join("\n")}
                        onChange={(e) => setData({ ...data, hatingTasks: e.target.value.split("\n") })}
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="notWorkingTasks" className="text-base font-semibold text-gray-700 mb-2">
                        What's NOT working? (Things to kill or transform)
                      </Label>
                      <Textarea
                        id="notWorkingTasks"
                        placeholder="Systems, processes, or tasks that need to be eliminated or completely redone..."
                        value={data.notWorkingTasks.join("\n")}
                        onChange={(e) => setData({ ...data, notWorkingTasks: e.target.value.split("\n") })}
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3">Biggest challenges/pain points:</Label>
                  <div className="space-y-2">
                    {PAIN_POINTS.map((pain) => (
                      <div key={pain} className="flex items-center space-x-2">
                        <Checkbox
                          id={pain}
                          checked={data.painPoints.includes(pain)}
                          onCheckedChange={() =>
                            setData({ ...data, painPoints: toggleArrayItem(data.painPoints, pain) })
                          }
                        />
                        <Label htmlFor={pain} className="font-normal cursor-pointer text-sm">
                          {pain}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: AI Experience & Goals */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Experience & Goals</h3>
              <p className="text-gray-600 mb-6">Help us tailor your roadmap to your current AI adoption level</p>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3">Current AI adoption level:</Label>
                  <RadioGroup
                    value={data.aiExperience}
                    onValueChange={(value) => setData({ ...data, aiExperience: value })}
                  >
                    <div className="flex items-start space-x-2 py-2">
                      <RadioGroupItem value="none" id="none" className="mt-1" />
                      <Label htmlFor="none" className="font-normal cursor-pointer leading-relaxed">
                        Not using AI yet - Want to build AI-First from the start
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2 py-2">
                      <RadioGroupItem value="beginner" id="beginner" className="mt-1" />
                      <Label htmlFor="beginner" className="font-normal cursor-pointer leading-relaxed">
                        Beginner - Tried ChatGPT, not consistent or systematic
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2 py-2">
                      <RadioGroupItem value="intermediate" id="intermediate" className="mt-1" />
                      <Label htmlFor="intermediate" className="font-normal cursor-pointer leading-relaxed">
                        Intermediate - Using some AI tools regularly
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2 py-2">
                      <RadioGroupItem value="advanced" id="advanced" className="mt-1" />
                      <Label htmlFor="advanced" className="font-normal cursor-pointer leading-relaxed">
                        Advanced - AI integrated into workflow, want to optimize further
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3">
                    Current AI tools in use: (if any)
                  </Label>
                  <div className="space-y-2">
                    {AI_TOOLS.map((tool) => (
                      <div key={tool} className="flex items-center space-x-2">
                        <Checkbox
                          id={tool}
                          checked={data.currentAiTools.includes(tool)}
                          onCheckedChange={() =>
                            setData({ ...data, currentAiTools: toggleArrayItem(data.currentAiTools, tool) })
                          }
                        />
                        <Label htmlFor={tool} className="font-normal cursor-pointer text-sm">
                          {tool}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3">
                    How many hours per week do you want to reclaim?
                  </Label>
                  <RadioGroup
                    value={data.desiredHoursBack}
                    onValueChange={(value) => setData({ ...data, desiredHoursBack: value })}
                  >
                    <div className="flex items-center space-x-2 py-1">
                      <RadioGroupItem value="5-10" id="5-10" />
                      <Label htmlFor="5-10" className="font-normal cursor-pointer">
                        5-10 hours/week
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 py-1">
                      <RadioGroupItem value="10-20" id="10-20" />
                      <Label htmlFor="10-20" className="font-normal cursor-pointer">
                        10-20 hours/week
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 py-1">
                      <RadioGroupItem value="20-30" id="20-30" />
                      <Label htmlFor="20-30" className="font-normal cursor-pointer">
                        20-30 hours/week
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 py-1">
                      <RadioGroupItem value="30+" id="30+" />
                      <Label htmlFor="30+" className="font-normal cursor-pointer">
                        30+ hours/week (Ready for the 4-hour workday!)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3">
                    Your AI-First transformation goals:
                  </Label>
                  <div className="space-y-2">
                    {GOALS.map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={goal}
                          checked={data.goals.includes(goal)}
                          onCheckedChange={() => setData({ ...data, goals: toggleArrayItem(data.goals, goal) })}
                        />
                        <Label htmlFor={goal} className="font-normal cursor-pointer text-sm">
                          {goal}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Plan Selection */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Implementation Timeline</h3>
              <p className="text-gray-600 mb-6">Select the pace that works for your business transformation</p>

              <div className="space-y-4">
                <Label className="text-base font-semibold text-gray-700 mb-3">Implementation plan duration:</Label>
                <RadioGroup
                  value={data.planDuration}
                  onValueChange={(value) => setData({ ...data, planDuration: value })}
                >
                  <Card className="border-2 hover:border-[#7FB069] transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="3" id="3-month" className="mt-1" />
                        <div>
                          <Label htmlFor="3-month" className="text-lg font-semibold cursor-pointer text-gray-900">
                            3-Month Accelerated Plan
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Fast-track implementation. Layer by layer, system by system. Perfect for entrepreneurs ready
                            to move quickly and commit focused time each week.
                          </p>
                          <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4 list-disc">
                            <li>Month 1: Foundation & Core AI Systems</li>
                            <li>Month 2: Automation & Human Skills Development</li>
                            <li>Month 3: Optimization & 4-Hour Workday Launch</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:border-[#7FB069] transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="6" id="6-month" className="mt-1" />
                        <div>
                          <Label htmlFor="6-month" className="text-lg font-semibold cursor-pointer text-gray-900">
                            6-Month Sustainable Installation
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Steady, sustainable pace. Build correctly with time to test, adjust, and master each system.
                            Ideal for businesses that can't pause operations during transformation.
                          </p>
                          <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4 list-disc">
                            <li>Months 1-2: Business audit, AI foundation, quick wins</li>
                            <li>Months 3-4: Core automation systems, team training</li>
                            <li>Months 5-6: Advanced integration, human skills mastery, SOP creation</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </RadioGroup>

                <div className="bg-[#7FB069]/10 border border-[#7FB069] rounded-lg p-4 mt-6">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> Both plans result in the same comprehensive AI-First Business Model. The
                    difference is pacing. Choose based on your available time commitment and how quickly you need
                    transformation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Balance Your Whole Life</h3>
              <p className="text-gray-600 mb-6">
                AI isn't just for business automation - it's for reclaiming time to balance ALL areas of your life.
                Select the life value areas where you want to grow, improve, or reclaim time.
              </p>

              <div className="bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 border border-[#7FB069]/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Why this matters:</strong> Your AI-First roadmap will include tools and strategies not just
                  for business, but for the 12 Core Life Value Areas. True work-life balance means thriving in all
                  aspects of life - left brain (business) AND right brain (life fulfillment).
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold text-gray-700 mb-3">
                  Select the areas where you need the most support or want to expand (select at least 3):
                </Label>
                <div className="grid gap-3">
                  {LIFE_VALUE_AREAS.map((area) => (
                    <Card
                      key={area.value}
                      className={`border-2 transition-all cursor-pointer ${
                        data.lifeValuePriorities?.includes(area.value)
                          ? "border-[#7FB069] bg-[#7FB069]/5"
                          : "border-gray-200 hover:border-[#7FB069]/50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id={area.value}
                            checked={data.lifeValuePriorities?.includes(area.value)}
                            onCheckedChange={() =>
                              setData({
                                ...data,
                                lifeValuePriorities: toggleArrayItem(data.lifeValuePriorities || [], area.value),
                              })
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={area.value}
                              className="text-base font-semibold cursor-pointer text-gray-900"
                            >
                              {area.label}
                            </Label>
                            <p className="text-sm text-gray-600 mt-0.5">{area.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="bg-[#E26C73]/10 border border-[#E26C73]/30 rounded-lg p-4 mt-6">
                <p className="text-sm text-gray-700">
                  <strong>What you'll get:</strong> Based on your selections, we'll recommend AI tools and strategies to
                  improve each area - from meditation apps and fitness trackers to relationship management and
                  charitable giving platforms. This creates holistic balance between your business success and life
                  fulfillment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069]/10 bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {step < 8 ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !data.planDuration || (data.lifeValuePriorities?.length || 0) < 3}
              className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Your AI-First Roadmap...
                </>
              ) : (
                <>
                  Generate My Roadmap
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
