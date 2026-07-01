import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, ClipboardCheck, MessageCircleHeart, Sparkles } from "lucide-react"
import { RitualTimeline } from "@/components/begin/ritual-timeline"

export const metadata: Metadata = {
  title: "Welcome to Your Work-Life Balance Business Week™ | Make Time For More™",
  description:
    "Every Work-Life Balance Business Week™ begins with one simple ritual — the Weekly Reality Check™. Take 5–7 minutes to understand where you are today.",
}

const JOURNEY_CARDS = [
  {
    icon: ClipboardCheck,
    title: "Weekly Reality Check™",
    body: "Take a 5–7 minute snapshot of your current reality across the areas that matter most. Cherry Blossom will use this to personalize your entire week.",
  },
  {
    icon: MessageCircleHeart,
    title: "Cherry Blossom Review™",
    body: "The moment your Reality Check is complete, Cherry Blossom reviews your results with you. No copying. No pasting. She already knows your scores and remembers your previous weeks.",
  },
  {
    icon: Sparkles,
    title: "Begin Your Business Week™",
    body: "Choose your 1–3 Priority Focus Areas and set one simple Weekly Intention Declaration that Cherry Blossom will coach you around all week long.",
  },
]

export default function BeginPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F0]">
      {/* Hero — full-width panoramic lifestyle image with a soft light wash */}
      <section className="relative isolate overflow-hidden">
        <img
          src="/images/business-day-hero-bg.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Gentle cream overlay keeps typography readable without hiding the scene */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F0]/70 via-[#F5F5F0]/35 to-[#F5F5F0]/85" />

        <div className="relative flex min-h-[80vh] items-center justify-center px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/50 bg-white/45 px-6 py-12 text-center shadow-xl backdrop-blur-md sm:px-10 sm:py-14">
            <div className="mb-6 flex justify-center">
              <img
                src="/images/logo.png"
                alt="Make Time For More logo"
                width={80}
                height={80}
                className="rounded-full border-4 border-white/70 shadow-lg"
              />
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#E26C73]">
              Make Time For More™
            </p>
            <h1 className="font-playfair text-balance text-4xl font-bold leading-tight text-[#5A4A52] sm:text-5xl">
              Welcome to Your Work-Life Balance Business Week™
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-[#5A4A52]/85">
              Every Work-Life Balance Business Week™ begins with one simple ritual. Before we build your week,
              let&apos;s understand where you are today.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3">
              <Link href="/audit">
                <Button
                  size="lg"
                  className="bg-[#E26C73] px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all hover:bg-[#D55A60] hover:shadow-xl"
                >
                  Begin My Weekly Reality Check™
                </Button>
              </Link>
              <span className="flex items-center gap-2 text-sm text-[#5A4A52]/70">
                <Clock className="h-4 w-4" />
                5–7 minutes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Journey cards */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <h2 className="mb-10 text-center font-playfair text-3xl font-bold text-[#5A4A52] text-balance">
          What Your Week Ahead Holds
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {JOURNEY_CARDS.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="rounded-2xl border-[#E26C73]/15 bg-white shadow-sm">
              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#7FB069]/15">
                  <Icon className="h-6 w-6 text-[#7FB069]" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#5A4A52] text-balance">{title}</h3>
                <p className="text-pretty leading-relaxed text-[#5A4A52]/75">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-[#E26C73]/10 sm:p-10">
          <h2 className="mb-8 text-center font-playfair text-2xl font-bold text-[#5A4A52] text-balance">
            Your Weekly Ritual, Start to Finish
          </h2>
          <RitualTimeline />
          <div className="mt-10 text-center">
            <Link href="/audit">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#E26C73] to-[#7FB069] px-8 py-6 text-lg font-semibold text-white shadow-md transition-all hover:from-[#D55A60] hover:to-[#6FA055] hover:shadow-lg"
              >
                Begin My Weekly Reality Check™
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
