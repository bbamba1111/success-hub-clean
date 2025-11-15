"use client"

import { Sparkles, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CherryBlossomGPTSuite from "@/components/cherry-blossom-gpt-suite"
import MyResultsPreview from "@/components/my-results-preview"
import { CoPilotTraining } from "@/components/co-pilot-training"
import TwentyEightDayIntentionSetter from "@/components/28-day-intention-setter"

export default function HubPage() {
  return (
    <div className="min-h-screen bg-[#F9EFE3]">
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Welcome Header */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Your Success Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master your 4-Hour Workday with AI-powered guidance, human-only skills, and daily support
          </p>
        </section>

        {/* AI-First Business Model & Human Skills Development */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5D9D61]">
              AI-First Business Model & Human Skills
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Build your AI-powered business while mastering the 8 irreplaceable human-only skills
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Human Zone of Genius Card */}
            <Link href="/human-zone-of-genius">
              <Card className="h-full cursor-pointer transition-all hover:shadow-xl bg-gradient-to-br from-[#E26C73]/10 via-[#F9EFE3] to-[#5D9D61]/10 border-2 border-[#E26C73]/20">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E26C73] to-[#5D9D61] flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-[#E26C73] to-[#5D9D61] bg-clip-text text-transparent">
                    Human Zone of Genius
                  </CardTitle>
                  <CardDescription className="text-base">
                    Discover your unique human capabilities that AI can never replace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Take the comprehensive assessment to identify your 2-3 core human-only skills from 8 categories using the 80/20 Pareto Principle
                  </p>
                  <Button className="w-full bg-gradient-to-r from-[#E26C73] to-[#5D9D61] hover:from-[#E26C73]/90 hover:to-[#5D9D61]/90 text-white">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* AI Executive Team Card */}
            <Link href="/ai-executive-team">
              <Card className="h-full cursor-pointer transition-all hover:shadow-xl border-2 border-[#5D9D61]/20">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5D9D61] to-[#E26C73] flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-[#5D9D61]">Build Your AI Executive Team</CardTitle>
                  <CardDescription className="text-base">
                    Meet your 15 specialized AI executives ready to handle 80% of operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    From COO to CMO, Sales Director to PR Executive - your complete virtual executive team is ready to work
                  </p>
                  <Button className="w-full bg-[#5D9D61] hover:bg-[#5D9D61]/90 text-white">
                    <Users className="mr-2 h-4 w-4" />
                    Meet Your Team
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Cherry Blossom AI Suite - 7 Daily Non-Negotiables */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E26C73]">
              Cherry Blossom AI Suite
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your 7 Daily Non-Negotiables for sustainable success
            </p>
          </div>
          <CherryBlossomGPTSuite />
        </section>

        {/* Training & Education */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5D9D61]">
              Training & Education
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Learn the systems that power your AI-first business
            </p>
          </div>
          <CoPilotTraining />
        </section>

        {/* 28-Day Intention Setter */}
        <section className="space-y-8">
          <TwentyEightDayIntentionSetter />
        </section>

        {/* My Results */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5D9D61]">
              My Results
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Track your progress and celebrate your wins
            </p>
          </div>
          <MyResultsPreview />
        </section>
      </div>
    </div>
  )
}
