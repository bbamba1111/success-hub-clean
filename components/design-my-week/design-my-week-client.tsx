"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Clock, Info } from "lucide-react"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"

/* ── Segments ──────────────────────────────────────────────────────────── */
const SEGMENTS = [
  {
    id: "early-entry",
    title: "Early Entry / Flex Time™",
    time: "7:00 AM – 9:00 AM",
    type: "flex" as const,
    description:
      "A protected 2-hour flexibility buffer at the start of every day — designed to absorb life's unavoidable demands without ever touching your CEO Workday™.",
    examples: [
      "School drop-off",
      "Breakfast meeting",
      "Doctor appointment",
      "Morning walk",
      "Coffee networking",
      "Personal errands",
    ],
    flexNote: {
      default: "2 hours available by default.",
      borrow: [
        { from: "Morning GIV\u2022EN\u2122", max: "up to 1 hour" },
        { from: "Healthy Hybrid Lunch\u2122", max: "up to 1 hour" },
      ],
      max: "4 hours maximum when both are borrowed.",
      rule: "Borrowing is reserved for genuine life demands — not a daily habit. Your 4-Hour CEO Workday\u2122 (1:00\u2009PM\u2013\u20095:00\u2009PM) is never borrowed from and never shortened.",
    },
  },
  {
    id: "morning-given",
    title: "Morning GIV\u2022EN\u2122",
    time: "9:00 AM – 10:00 AM",
    type: "life" as const,
    description:
      "Your morning ritual — the intentional practice that grounds your mind, raises your energy, and sets the tone for everything that follows.",
    examples: [
      "Gratitude practice",
      "Prayer",
      "Visualization",
      "Reading",
      "Journaling",
      "Meditation",
    ],
    borrowNote: "Up to 1 hour of this segment may be temporarily reallocated to Flex Time\u2122 when life requires it.",
  },
  {
    id: "workout",
    title: "Workout Window\u2122",
    time: "10:00 AM – 11:00 AM",
    type: "life" as const,
    description:
      "Your dedicated movement practice — non-negotiable for your sustained energy, mental clarity, and long-term health.",
    examples: [
      "Strength training",
      "Yoga",
      "Stretching",
      "Walking",
      "Dance",
      "Cycling",
    ],
  },
  {
    id: "healthy-lunch",
    title: "Healthy Hybrid Lunch\u2122",
    time: "11:00 AM – 1:00 PM",
    type: "life" as const,
    description:
      "A nourishing midday pause that refuels your body, creates a natural rhythm break, and prepares you for your most important work.",
    examples: [
      "Eat away from my desk",
      "Outdoor walk",
      "Lunch with a friend",
      "Meal prep",
      "Hydrate",
      "Midday reset",
    ],
    borrowNote: "Up to 1 hour of this segment may be temporarily reallocated to Flex Time\u2122 when life requires it.",
  },
  {
    id: "ceo-workday",
    title: "4-Hour CEO Workday\u2122",
    time: "1:00 PM – 5:00 PM",
    type: "business" as const,
    description:
      "Your protected, high-leverage CEO execution window. Four focused hours dedicated exclusively to the most important work that moves your business forward.",
    examples: [
      "Meetings require an agenda, owner, and decision",
      "AI drafts first; I review and approve",
      "Every recurring process becomes an SOP after the third repetition",
      "Client proposals are sent within 24 hours",
      "Every CEO Workday begins by reviewing my Executive Brief\u2122",
      "One leveraged sales conversation per day",
    ],
  },
  {
    id: "time-freedom",
    title: "Time Freedom\u2122",
    time: "5:00 PM – 8:30 PM",
    type: "life" as const,
    description:
      "The protected life your business exists to support. This is your time — fully present, fully free, fully yours.",
    examples: [
      "Attend my child\u2019s soccer game",
      "Read for pleasure",
      "Date night",
      "Gardening",
      "Volunteer",
      "Family movie night",
    ],
  },
  {
    id: "power-down",
    title: "Power Down & Unplug\u2122",
    time: "8:30 PM – Sleep",
    type: "life" as const,
    description:
      "A clear, intentional close to every business day — so your rest is deep, restorative, and truly your own.",
    examples: [
      "Devices off by 9 PM",
      "Evening reflection",
      "Read a book",
      "Stretch",
      "Prepare for tomorrow",
      "Lights out by 10 PM",
    ],
  },
]

/* ── Intention Declaration generator ───────────────────────────────────── */
function elevateDeclaration(segmentId: string, rawInput: string): string {
  const input = rawInput.trim()
  if (!input) return ""

  // Strip leading "I am committed to " if the founder typed the full phrase
  const clean = input
    .replace(/^I am committed to\s+/i, "")
    .replace(/\.$/, "")
    .trim()

  const lower = clean.toLowerCase()

  // Segment-aware elevation patterns
  switch (segmentId) {
    case "early-entry":
      if (/school|drop.?off|kids|children/i.test(clean))
        return `I honor my family responsibilities by making school drop-off a protected part of my morning, knowing my CEO Workday\u2122 begins on time at 1:00\u2009PM.`
      if (/doctor|appointment|medical/i.test(clean))
        return `I take care of my health and personal needs during Flex Time\u2122, protecting my 4-Hour CEO Workday\u2122 and everything that matters most.`
      if (/network|coffee|breakfast|meeting/i.test(clean))
        return `I invest in meaningful connections and relationships during my Flex Time\u2122 window, keeping my CEO Workday\u2122 fully protected.`
      return `I use my Flex Time\u2122 intentionally for ${lower}, so that nothing interrupts my 4-Hour CEO Workday\u2122 from 1:00\u2009PM to 5:00\u2009PM.`

    case "morning-given":
      if (/gratitude|thank/i.test(clean))
        return `I begin every morning by cultivating gratitude, setting the tone for a focused, intentional, and high-performing day.`
      if (/prayer|faith|spiritual/i.test(clean))
        return `I begin every morning grounded in prayer, entering each day with clarity of purpose and strength of spirit.`
      if (/journal/i.test(clean))
        return `I begin every morning by journaling my intentions and insights, creating clarity and focus before the day begins.`
      if (/meditat/i.test(clean))
        return `I begin every morning with meditation, cultivating the stillness and mental clarity that makes everything else possible.`
      if (/visuali/i.test(clean))
        return `I begin every morning visualizing the day I intend to create, aligning my mind and energy before I take a single action.`
      if (/read/i.test(clean))
        return `I begin every morning with purposeful reading, feeding my mind with wisdom that compounds into extraordinary results over time.`
      return `I begin every morning with ${lower}, creating the intentional foundation from which my most productive and fulfilling days are built.`

    case "workout":
      if (/walk/i.test(clean))
        return `I strengthen my body and renew my energy through a daily walk, honoring my health as the non-negotiable foundation of everything I build.`
      if (/yoga/i.test(clean))
        return `I restore my body and center my mind through a daily yoga practice, arriving at each day flexible, grounded, and energized.`
      if (/strength|lift|weight/i.test(clean))
        return `I build physical strength daily, knowing that a strong body creates the sustained energy and resilience my vision requires.`
      if (/danc/i.test(clean))
        return `I move my body joyfully through dance, celebrating the energy and vitality that fuels everything I create.`
      if (/cycl|bike/i.test(clean))
        return `I build endurance and mental clarity through cycling, arriving at every CEO Workday\u2122 with energy to execute at my highest level.`
      if (/stretch/i.test(clean))
        return `I honor my body with a daily stretching practice, maintaining the flexibility and recovery that high performance demands.`
      return `I protect my body through ${lower}, treating my physical health as the irreplaceable engine that powers everything I am building.`

    case "healthy-lunch":
      if (/away.*(desk|screen|computer)/i.test(clean) || /desk/i.test(clean))
        return `I nourish my body and reset my mind each day by stepping completely away from my desk at lunch — honoring the pause that makes the afternoon possible.`
      if (/outdoor|outside|walk|fresh air/i.test(clean))
        return `I refresh my mind and body at midday with an outdoor break, arriving at my CEO Workday\u2122 energized and ready to lead.`
      if (/friend|family/i.test(clean))
        return `I invest in meaningful relationships at lunch, knowing that connection nourishes both the life and the business I am building.`
      if (/meal prep|cook/i.test(clean))
        return `I fuel my afternoon with intentional nutrition by preparing a healthy meal, treating my body as the high-performance asset it is.`
      if (/hydrat/i.test(clean))
        return `I make hydration a conscious midday practice, knowing that clarity of mind and sustained energy begin with how I fuel my body.`
      return `I nourish my body at midday with ${lower}, honoring the reset that prepares me for my most important CEO work of the day.`

    case "ceo-workday":
      if (/keynote|present/i.test(clean))
        return `I protect my 4-Hour CEO Workday\u2122 as dedicated time for high-value creation — and this week, I complete my keynote presentation with full focus and creative excellence.`
      if (/podcast|record/i.test(clean))
        return `I use my CEO Workday\u2122 to create content that compounds — recording the podcast episode that builds my authority and impact.`
      if (/proposal|client/i.test(clean))
        return `I protect my CEO Workday\u2122 for the high-leverage client work that drives revenue and builds lasting business relationships.`
      if (/sales|conversation|call/i.test(clean))
        return `I use my CEO Workday\u2122 to lead high-quality sales conversations that convert with integrity and create genuine client value.`
      if (/AI|delegation|delegate|SOP/i.test(clean))
        return `I use my CEO Workday\u2122 to build the systems and delegation frameworks that give me leverage — so I can work fewer hours and produce greater results.`
      if (/webinar|course|program/i.test(clean))
        return `I protect my CEO Workday\u2122 for building the programs and content that scale my impact beyond the hours I work.`
      return `I protect my 4-Hour CEO Workday\u2122 from 1:00\u2009PM to 5:00\u2009PM as sacred time for ${lower} — the high-leverage work that builds my business and my future.`

    case "time-freedom":
      if (/child|kid|son|daughter|family/i.test(clean))
        return `I protect my family time as fiercely as I protect my CEO Workday\u2122 — being fully present with the people I am building this business for.`
      if (/date|partner|spouse|husband|wife/i.test(clean))
        return `I invest in my relationship by creating protected, phone-free time with my partner — because the most important business I run is my life.`
      if (/read|book/i.test(clean))
        return `I restore my mind and feed my imagination through reading during Time Freedom\u2122 — knowing that the best leaders never stop learning.`
      if (/garden/i.test(clean))
        return `I reconnect with nature and find peace through gardening during my Time Freedom\u2122 — restoring the energy I invest in everything I build.`
      if (/volunteer|community/i.test(clean))
        return `I give my time and energy to my community during Time Freedom\u2122, fulfilling the deeper purpose that makes my work meaningful.`
      return `I protect my Time Freedom\u2122 as the sacred, non-negotiable reward for doing disciplined, high-value work during my CEO Workday\u2122 — so I can be fully present for ${lower}.`

    case "power-down":
      if (/phone|device|screen|9\s*pm|10\s*pm/i.test(clean))
        return `I end each business day by unplugging completely, creating the space for deep, restorative rest that makes tomorrow's performance possible.`
      if (/reflect|journal/i.test(clean))
        return `I close each day with intentional reflection, acknowledging what I accomplished, what I learned, and what I am grateful for.`
      if (/read|book/i.test(clean))
        return `I transition into rest each evening through reading, stepping away from screens and allowing my mind to decompress and restore.`
      if (/stretch|yoga|meditat/i.test(clean))
        return `I prepare my body and mind for deep rest each evening through movement and stillness, honoring the recovery that high performance requires.`
      if (/prepare|tomorrow|plan/i.test(clean))
        return `I close each day with calm preparation for tomorrow — reviewing my intentions, organizing my space, and entering rest with a clear and peaceful mind.`
      return `I create a clear and intentional end to every business day by ${lower}, protecting the rest that makes tomorrow's focus, energy, and leadership possible.`

    default:
      return `I am committed to ${lower}.`
  }
}

/* ── Types ──────────────────────────────────────────────────────────────── */
type InstallState = {
  input: string
  declaration: string | null
  confirmed: boolean
}

const TYPE_LABEL: Record<string, string> = {
  flex: "Flex Time™",
  life: "Daily Non-Negotiable™",
  business: "Business Operating Rule™",
}

const TYPE_INPUT_LABEL: Record<string, string> = {
  flex: "My Flex Time™ Commitment",
  life: "My Daily Non-Negotiable™",
  business: "My Operating Rule™",
}

const TYPE_DECLARATION_LABEL: Record<string, string> = {
  flex: "Your Flex Time™ Declaration",
  life: "Your Daily Non-Negotiable™",
  business: "Your Operating Rule™",
}

const TYPE_COLOR: Record<string, string> = {
  flex: "text-brand-coral",
  life: "text-brand-green",
  business: "text-[#5B835F]",
}

const TYPE_CHIP_COLOR: Record<string, string> = {
  flex: "bg-brand-coral/10 text-brand-coral",
  life: "bg-brand-green/10 text-brand-green",
  business: "bg-[#5B835F]/10 text-[#5B835F]",
}

const TYPE_COLOR: Record<string, string> = {
  flex: "text-brand-coral",
  life: "text-brand-green",
  business: "text-[#5B835F]",
}

/* ── Component ──────────────────────────────────────────────────────────── */
export function DesignMyWeekClient() {
  const [step, setStep] = useState(0)
  const [states, setStates] = useState<Record<string, InstallState>>(
    Object.fromEntries(
      SEGMENTS.map((s) => [s.id, { input: "", declaration: null, confirmed: false }])
    )
  )
  const [showFlexInfo, setShowFlexInfo] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const completionRef = useRef<HTMLDivElement>(null)

  const current = SEGMENTS[step]
  const state = states[current.id]
  const confirmedCount = SEGMENTS.filter((s) => states[s.id].confirmed).length
  const allConfirmed = confirmedCount === SEGMENTS.length

  // Auto-scroll to completion card after final install
  useEffect(() => {
    if (allConfirmed && completionRef.current) {
      setTimeout(() => {
        completionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 120)
    }
  }, [allConfirmed])

  function scrollToCard() {
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleGenerate() {
    if (!state.input.trim()) return
    const declaration = elevateDeclaration(current.id, state.input)
    setStates((prev) => ({
      ...prev,
      [current.id]: { ...prev[current.id], declaration },
    }))
  }

  function handleConfirm() {
    // 1. Mark confirmed immediately so chips refresh
    setStates((prev) => ({
      ...prev,
      [current.id]: { ...prev[current.id], confirmed: true },
    }))
    // 2. Advance step (unless last)
    if (step < SEGMENTS.length - 1) {
      setStep((s) => s + 1)
      setTimeout(() => scrollToCard(), 80)
    }
    // allConfirmed useEffect handles scroll to completion
  }

  function handleEdit() {
    setStates((prev) => ({
      ...prev,
      [current.id]: { ...prev[current.id], declaration: null },
    }))
  }

  const isFlex = current.type === "flex"
  const flexSegment = SEGMENTS.find((s) => s.id === "early-entry")!

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Scene header */}
      <CherryBlossomScene variant="pond" minHeight="min-h-[55vh]">
        <CherryBlossomSceneCard title="Design My Week™" time="Approx. 10 mins">
          <p>
            Now we install your seven <strong>Operating Segments™</strong> — the daily structure
            that protects your life <em>and</em> builds your business simultaneously.
          </p>
          <p>
            For each segment, complete the commitment. I will transform it into an{" "}
            <strong>Intention Declaration™</strong> you will live from, starting today.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      {/* Installation card */}
      <div className="w-full max-w-4xl mx-auto px-4 py-10" ref={cardRef}>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green">
              Operating Segments™
            </span>
            <span className="font-sans text-xs font-medium text-brand-ink-soft">
              {confirmedCount} of {SEGMENTS.length} installed
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-brand-green/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-green transition-all duration-500"
              style={{ width: `${(confirmedCount / SEGMENTS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Installed segment chips — all confirmed segments always shown */}
        {confirmedCount > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {SEGMENTS.filter((s) => states[s.id].confirmed).map((s) => (
              <span
                key={s.id}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-xs font-semibold ${TYPE_CHIP_COLOR[s.type]}`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                {s.title}
                <span className="ml-0.5 opacity-60">· {TYPE_LABEL[s.type]}</span>
              </span>
            ))}
          </div>
        )}

        {/* Active segment card */}
        {!allConfirmed && (
          <div className="rounded-3xl bg-white border border-brand-blush shadow-lg overflow-hidden">
            <div className="px-8 py-10 sm:px-10">

              {/* Segment meta */}
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <span className={`font-sans text-xs font-bold uppercase tracking-[0.22em] ${TYPE_COLOR[current.type]}`}>
                  {TYPE_LABEL[current.type]}
                </span>
                <span className="flex items-center gap-1 font-sans text-xs font-medium text-brand-ink-soft">
                  <Clock className="h-3 w-3" aria-hidden />
                  {current.time}
                </span>
              </div>

              <h2 className="font-playfair text-3xl font-bold text-brand-ink mb-2 text-balance">
                {current.title}
              </h2>
              <p className="font-sans text-[15px] font-medium leading-relaxed text-brand-ink-soft text-pretty mb-6">
                {current.description}
              </p>

              {/* Flex Time™ info panel */}
              {isFlex && (
                <div className="mb-6 rounded-2xl border border-brand-blush bg-brand-cream/50 p-5">
                  <button
                    onClick={() => setShowFlexInfo((v) => !v)}
                    className="flex w-full items-center justify-between text-left"
                    aria-expanded={showFlexInfo}
                  >
                    <span className="flex items-center gap-2 font-sans text-sm font-bold text-brand-ink">
                      <Info className="h-4 w-4 text-brand-coral" aria-hidden />
                      How Flex Time™ works
                    </span>
                    <span className="font-sans text-xs font-medium text-brand-ink-soft">
                      {showFlexInfo ? "Hide" : "Show"}
                    </span>
                  </button>
                  {showFlexInfo && (
                    <div className="mt-4 space-y-3 font-sans text-[14px] font-medium leading-relaxed text-brand-ink-soft">
                      <p>
                        <strong className="text-brand-ink">Default:</strong>{" "}
                        {flexSegment.flexNote!.default}
                      </p>
                      <p>
                        <strong className="text-brand-ink">Borrowing:</strong> When life requires
                        it, you may temporarily expand Flex Time™ by borrowing:
                      </p>
                      <ul className="ml-4 space-y-1 list-disc">
                        {flexSegment.flexNote!.borrow.map((b) => (
                          <li key={b.from}>
                            <strong className="text-brand-ink">{b.from}</strong> — {b.max}
                          </li>
                        ))}
                      </ul>
                      <p className="font-semibold text-brand-ink">{flexSegment.flexNote!.max}</p>
                      <p className="rounded-xl border border-brand-coral/20 bg-brand-coral/5 px-4 py-3 text-brand-ink-soft">
                        <strong className="text-brand-ink">Important:</strong>{" "}
                        {flexSegment.flexNote!.rule}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Borrow note for Morning GIV•EN and Healthy Hybrid Lunch */}
              {"borrowNote" in current && current.borrowNote && (
                <div className="mb-6 flex items-start gap-2 rounded-xl border border-brand-blush bg-brand-cream/50 px-4 py-3">
                  <Info className="h-4 w-4 mt-0.5 shrink-0 text-brand-ink-soft" aria-hidden />
                  <p className="font-sans text-[13px] font-medium text-brand-ink-soft">
                    <strong className="text-brand-ink">Borrow Flex Time™:</strong>{" "}
                    {(current as typeof SEGMENTS[1]).borrowNote}
                  </p>
                </div>
              )}

              {/* Examples */}
              <div className="mb-6">
                <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brand-ink-soft mb-2">
                  Examples
                </p>
                <div className="flex flex-wrap gap-2">
                  {current.examples.map((ex) => (
                    <button
                      key={ex}
                      onClick={() =>
                        setStates((prev) => ({
                          ...prev,
                          [current.id]: {
                            ...prev[current.id],
                            input: ex,
                            declaration: null,
                          },
                        }))
                      }
                      className="rounded-full border border-brand-blush bg-white px-3 py-1.5 font-sans text-xs font-medium text-brand-ink-soft transition-colors hover:border-brand-green/40 hover:text-brand-green"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              {!state.declaration ? (
                /* ── Input state ── */
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor={`input-${current.id}`}
                      className="block font-sans text-sm font-bold text-brand-ink mb-3"
                    >
                      {TYPE_INPUT_LABEL[current.type]}
                    </label>
                    <div className="flex items-start rounded-xl border border-brand-blush bg-brand-cream/40 focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/20 transition-all overflow-hidden">
                      <span className="shrink-0 px-4 pt-3.5 font-sans text-[15px] font-semibold text-brand-green select-none">
                        I am committed to
                      </span>
                      <textarea
                        id={`input-${current.id}`}
                        value={state.input}
                        onChange={(e) =>
                          setStates((prev) => ({
                            ...prev,
                            [current.id]: {
                              ...prev[current.id],
                              input: e.target.value,
                              declaration: null,
                            },
                          }))
                        }
                        placeholder="completing the sentence..."
                        rows={2}
                        className="flex-1 bg-transparent px-2 py-3.5 font-sans text-[15px] text-brand-ink placeholder:text-brand-ink-soft/40 focus:outline-none resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                            e.preventDefault()
                            handleGenerate()
                          }
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={!state.input.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Create My Intention Declaration™
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              ) : (
                /* ── Declaration state ── */
                <div className="space-y-6">
                  <div className="rounded-2xl border border-brand-green/20 bg-brand-green/5 px-6 py-5">
                    <p className={`font-sans text-xs font-bold uppercase tracking-[0.2em] mb-3 ${TYPE_COLOR[current.type]}`}>
                      {TYPE_DECLARATION_LABEL[current.type]}
                    </p>
                    <p className="font-sans text-lg font-semibold leading-relaxed text-brand-ink text-balance">
                      &ldquo;{state.declaration}&rdquo;
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleConfirm}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden />
                      Install This™
                    </button>
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-transparent px-6 py-3.5 font-sans text-sm font-semibold text-brand-green transition-all hover:bg-brand-green/5"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Completion — Cherry Blossom confirmation. Shown after all confirmed. */}
        {allConfirmed && (
          <div
            ref={completionRef}
            className="rounded-2xl border border-brand-blush bg-white/70 backdrop-blur-sm shadow-ds overflow-hidden relative"
          >
            <div aria-hidden className="absolute inset-y-0 left-0 w-1 bg-brand-coral/70 rounded-l-2xl" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-blush/50 blur-3xl"
            />
            <div className="relative px-8 py-10 sm:px-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="relative inline-flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-brand-blush shadow-sm">
                  <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-brand-coral">
                  Cherry Blossom™
                </span>
              </div>
              <p className="font-sans font-bold text-xl text-brand-ink mb-4">
                Harmony Lane™ is now installed.
              </p>
              <div className="font-sans font-medium text-[15px] leading-relaxed text-brand-ink-soft space-y-3 text-pretty mb-7">
                <p>
                  You have just installed <strong className="text-brand-ink">two operating systems simultaneously</strong>.
                </p>
                <p>
                  Your <strong className="text-brand-ink">Life Operating System™</strong> is built
                  from your <strong className="text-brand-ink">Daily Non-Negotiables™</strong> — the
                  commitments that protect your health, relationships, recovery, and Time Freedom™.
                </p>
                <p>
                  Your <strong className="text-brand-ink">Business Operating System™</strong> is
                  built from your <strong className="text-brand-ink">Business Operating Rules™</strong> — the
                  rules that reduce execution friction, improve decision-making, leverage AI and
                  delegation, and build compounding business assets.
                </p>
                <p>
                  Together they create what Harmony Lane™ ultimately delivers:{" "}
                  <em>a business that supports the life you want to live, instead of a life that revolves around the business.</em>
                </p>
              </div>
              <Link
                href="/live-today"
                className="inline-flex items-center gap-2 rounded-full bg-brand-green px-8 py-4 font-sans text-sm font-bold text-white shadow-ds transition-colors hover:bg-brand-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30"
              >
                Begin Live Today™
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
