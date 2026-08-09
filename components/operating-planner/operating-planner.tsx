"use client"

/**
 * OperatingPlanner™ — Space™ for each operating segment.
 *
 * Phase: Live & Lead Today™ Space™ — Full Content Migration
 *
 * Structure inside each expanded dropdown:
 *   1. Cherry Blossom™ Hero  — garden background (same as /begin), glass card
 *   2. Segment Body          — all content from /design-my-week ported in:
 *        · Type chip + time + title + description
 *        · Flex Time™ info panel (early-access only)
 *        · Borrow note (morning-given, lunch-break)
 *        · Learn More About This Segment™ accordion
 *        · Movement Planner (movement-window only)
 *        · Sleep Planner (power-down only)
 *        · Choose one… or create your own — example chips
 *        · Commitment input ("I am committed to…")
 *        · Create My Intention Declaration™ button
 *        · Confirmed declaration card + Install This™ / Edit buttons
 */

import { useState } from "react"
import { ArrowRight, CheckCircle2, ChevronDown, Clock, Info, Plus, Trash2 } from "lucide-react"
import type { BlockId } from "@/operating-engine"
import { PLANNER_CONFIG } from "@/components/operating-planner/planner-config"
import { FlexTimeGuidedMoments } from "@/components/guided-moments/flex-time-moments"
import dynamic from "next/dynamic"

// Lazy-load the BCA to keep the main bundle lean — only needed in ceo-workday.
// BusinessContextProfile is a named export so we re-export it as default here.
const BusinessContextProfile = dynamic(
  () => import("@/components/business-context/business-context-profile").then(m => ({ default: m.BusinessContextProfile })),
  { ssr: false, loading: () => <div className="py-8 text-center font-sans text-sm text-brand-ink/40">Loading assessment…</div> }
)

// ---------------------------------------------------------------------------
// Segment data — ported from /design-my-week so each Space™ is fully
// self-contained. Keys match BlockId values.
// ---------------------------------------------------------------------------

interface SegmentData {
  dmwId: string
  time: string
  type: "flex" | "life" | "business"
  description: string
  examples: string[]
  borrowNote?: string
  isUnplug?: boolean
  flexNote?: {
    default: string
    borrow: { from: string; max: string }[]
    max: string
    rule: string
  }
  learnMore?: {
    purpose: string
    whyItMatters: string
    science: string
    businessValue: string
    commonMistakes: string[]
    bestPractices: string[]
    cbTip: string
  }
}

const SEGMENT_DATA: Partial<Record<BlockId, SegmentData>> = {
  "early-access": {
    dmwId: "early-entry",
    time: "7:00 AM – 9:00 AM",
    type: "flex",
    description:
      "A protected 2-hour flexibility buffer at the start of every day — designed to absorb life's unavoidable demands without ever touching your CEO Workday™.",
    examples: [
      "preparing for the day and getting myself organized",
      "sleeping in an extra hour when my body needs recovery",
      "handling school drop-offs every weekday morning",
      "scheduling all medical appointments in this window",
      "attending a networking breakfast or coffee meeting",
      "taking care of family responsibilities before my day begins",
      "running personal errands so they never touch my CEO Workday™",
      "fulfilling community or volunteer commitments I value",
    ],
    flexNote: {
      default: "2 hours available by default.",
      borrow: [
        { from: "Morning GIV•EN™", max: "up to 1 hour" },
        { from: "Healthy Hybrid Lunch™", max: "up to 1 hour" },
      ],
      max: "4 hours maximum when both are borrowed.",
      rule: "Borrowing is reserved for genuine life demands — not a daily habit. Your 4-Hour CEO Workday™ (1:00 PM – 5:00 PM) is never borrowed from and never shortened.",
    },
    learnMore: {
      purpose:
        "Early Entry / Flex Time™ is a deliberately engineered buffer — not wasted time. It is one of The New 9-to-5 & Nighttime Non-Negotiable SOPs™ that protects your Daily Non-Negotiables™ and ensures life's unavoidable demands never spill into your CEO Workday™.",
      whyItMatters:
        "Without a protected flexibility window, life events become fires. The CEO Workday™ gets stolen. Sustainable Operating Practices™ get sacrificed. Flex Time™ is how high-performing founders stay anchored to their operating rhythm even when life is unpredictable.",
      science:
        "Research in cognitive load and decision fatigue shows that unplanned interruptions during deep work windows reduce overall productivity by up to 40%. The Progress Principle (Amabile & Kramer) demonstrates that protecting small daily wins — like keeping the CEO Workday™ intact — compounds into significantly higher motivation, creativity, and performance over time. Pre-scheduling a flex buffer eliminates reactive decision-making and protects the cognitive resources reserved for flow state during the CEO Workday™.",
      businessValue:
        "Every hour you protect your CEO Workday™ is an hour available for your highest-leverage business work. Flex Time™ is the front-line defense that makes that protection possible. Founders who install this buffer report fewer scheduling conflicts, lower stress, and stronger consistency with their Sustainable Operating Practices™ — even during the most demanding weeks.",
      commonMistakes: [
        "Allowing Flex Time™ to expand beyond 4 hours on a regular basis.",
        "Using borrowed Flex Time™ every day rather than occasionally.",
        "Not having a defined anchor commitment for this window — defaulting to reactive behavior.",
        "Treating personal errands and family responsibilities as interruptions rather than protected commitments.",
      ],
      bestPractices: [
        "Install one consistent anchor commitment (e.g. school drop-off, networking breakfast, morning prep).",
        "Treat borrowing as a weekly exception — not a daily routine.",
        "Use this window for medical appointments, community commitments, and family responsibilities by design.",
        "Return borrowed time the next opportunity by compressing flex needs.",
      ],
      cbTip:
        "Your Flex Time™ commitment is not about filling every minute. It is about knowing in advance how your morning unfolds so your CEO Workday™ always begins on time — and your Sustainable Operating Practices™ remain intact, even on imperfect days.",
    },
  },
  "morning-given": {
    dmwId: "morning-given",
    time: "9:00 AM – 10:30 AM",
    type: "life",
    description:
      "Your 90-minute intentional morning operating ritual — grounding your mind, aligning your spirit, and setting the tone for your entire Work-Life Balance Business Day™. GIV•EN™ stands for: Gratitude • Invitation to Your Creator • Vision & Visualization • Emotional Embodiment • Nurture.",
    examples: [
      "opening my heart and mind to gratitude, allowing abundance, possibility, and peace to become today's starting point",
      "inviting my Creator to co-create my day with me",
      "visualizing my ideal life and business with all five senses",
      "embodying the emotions of the work-life balanced founder I am becoming",
      "nurturing my Daily Non-Negotiables™ with consistent action",
      "journaling my intentions and setting a clear focus for the day",
    ],
    borrowNote:
      "Up to 1 hour of this 90-minute segment may be temporarily reallocated to Flex Time™ when life requires it — preserving at least 30 minutes for Morning GIV•EN™.",
    learnMore: {
      purpose:
        "Morning GIV•EN™ is your 90-minute intentional morning operating ritual. GIV•EN™ stands for: Gratitude • Invitation to Your Creator • Vision & Visualization • Emotional Embodiment • Nurture. It combines spiritual alignment with scientific habit formation to create sustainable transformation from the inside out.",
      whyItMatters:
        "How you begin your morning determines how you execute your day. Harmony Lane™ combines two powerful forces: spiritual alignment — inviting your Creator and planting seeds of intention — and scientific habit formation through neuroscience, identity-based behavior change, and the Reticular Activating System (RAS). Together they align both your beliefs and your behaviors.",
      science:
        "The Reticular Activating System (RAS) in the brain acts as a filter — when you clearly visualize and emotionally embody your desired outcomes, the RAS begins directing your attention toward opportunities that match. Behavioral science research (Duhigg, Clear, Dispenza) confirms that emotional conditioning and consistent repetition rewire identity at the neurological level. Nervous system regulation through gratitude and visualization also lowers cortisol, improving executive decision-making throughout the day.",
      businessValue:
        "Founders who protect Morning GIV•EN™ report higher focus during their CEO Workday™, clearer decision-making, stronger sense of purpose, and reduced entrepreneurial isolation. This is not indulgence — it is operational preparation. The 30-minute borrow buffer ensures you never lose this practice entirely, even on demanding days.",
      commonMistakes: [
        "Checking email or social media before completing Morning GIV•EN™.",
        "Skipping the ritual when time is tight — that is exactly when you need it most.",
        "Rushing through the steps without genuine emotional engagement.",
        "Making the ritual so complex it becomes unsustainable over time.",
      ],
      bestPractices: [
        "Move through each GIV•EN™ element in sequence: Gratitude → Invitation → Vision → Emotional Embodiment → Nurture.",
        "Wear comfortable clothing after Flex Time™ so you flow directly into the Movement Window™ at 10:30 AM.",
        "Complete your ritual before opening any device-based communication.",
        "Depth of engagement matters more than duration. 30 focused minutes outperforms 90 distracted ones.",
      ],
      cbTip:
        "The GIV•EN™ framework aligns your spirit and your science simultaneously. When you open with Gratitude and invite your Creator into co-creation, then see and feel your desired life through Vision & Visualization and Emotional Embodiment, you are not just preparing for the day — you are becoming the founder who already lives it.",
    },
  },
  "movement-window": {
    dmwId: "workout",
    time: "10:30 AM – 11:00 AM",
    type: "life",
    description:
      "Your protected 30-minute Movement Window™ — built directly into your Work-Life Balance Business Day™. Non-negotiable for sustained energy, mental clarity, and long-term health. The goal is not athletic performance. The goal is movement consistency.",
    examples: [
      "a 3-minute stretch to open my body for the day",
      "a 5-minute walk to reset my energy",
      "a 10-minute mobility session for flexibility and recovery",
      "a 15-minute yoga flow to ground my mind and body",
      "15 minutes of Walk Away the Pounds™ followed by 15 minutes of Tai Chi",
      "a 20-minute strength circuit to build physical resilience",
      "a 25-minute brisk walk for cardiovascular health",
      "a full 30-minute workout of my choice",
    ],
    learnMore: {
      purpose:
        "The Movement Window™ is your protected 30-minute movement practice — a non-negotiable block built into the Work-Life Balance Business Day™ from 10:30 AM to 11:00 AM. A 3-minute stretch counts. A full 30-minute workout counts. What matters is that you move consistently.",
      whyItMatters:
        "Exercise is the single highest-ROI Sustainable Operating Practice™ available to a founder. It directly improves cognitive performance, emotional regulation, stress resilience, hormonal balance, and sleep quality — all of which are prerequisites for high-level executive decision-making during your CEO Workday™.",
      science:
        "Neuroscience research (Ratey, Harvard Medical School) demonstrates that aerobic exercise increases BDNF (Brain-Derived Neurotrophic Factor), which accelerates learning, improves memory consolidation, and enhances creative problem-solving. Even 15–30 minutes of moderate movement produces measurable cognitive benefits that last 4–6 hours — directly improving your 1:00 PM CEO Workday™ performance.",
      businessValue:
        "Founders who exercise consistently report 23% higher self-reported productivity and significantly reduced decision fatigue during their CEO Workday™. Your Movement Window™ is not separate from your business — it is the engine that powers it.",
      commonMistakes: [
        "Treating movement as optional and skipping it when work pressures build — that is exactly when you need it.",
        "Planning a workout that exceeds 30 minutes and then skipping it entirely when time is short.",
        "Not wearing comfortable clothing after Morning GIV•EN™, which creates friction at 10:30 AM.",
      ],
      bestPractices: [
        "Wear comfortable clothing after Morning GIV•EN™ so you are ready when the Movement Window™ begins at 10:30 AM.",
        "Choose a form of movement you genuinely enjoy — consistency beats intensity every time.",
        "Even the shortest movement counts. A 3-minute stretch is a kept commitment.",
        "Protect this window as fiercely as you protect your CEO Workday™.",
      ],
      cbTip:
        "The goal of the Movement Window™ is not athletic performance. The goal is movement consistency. A 3-minute stretch performed every day for a year creates more compounding value than an intense 60-minute workout performed occasionally. Physical movement is not a reward for completing your work — it is preparation for doing your best work.",
    },
  },
  "lunch-break": {
    dmwId: "healthy-lunch",
    time: "11:00 AM – 1:00 PM",
    type: "life",
    description:
      "A nourishing midday pause that refuels your body, creates a natural rhythm break, and prepares you for your most important work.",
    examples: [
      "eating lunch away from my desk every day",
      "taking an outdoor walk during my lunch break",
      "having lunch with a friend or colleague once a week",
      "preparing a healthy meal so I control what I eat",
      "drinking at least 64 oz of water by midday",
      "taking a full midday pause away from all screens",
    ],
    borrowNote:
      "Up to 1 hour of this segment may be temporarily reallocated to Flex Time™ when life requires it.",
    learnMore: {
      purpose:
        "Healthy Hybrid Lunch™ is your nourishing midday pause — a deliberate Sustainable Operating Practice™ that refuels your body, transitions your mind from morning commitments, and prepares you for your most important work. It is a core part of The New 9-to-5 & Nighttime Non-Negotiable SOPs™.",
      whyItMatters:
        "Most founders work through lunch, believing it demonstrates dedication. In reality, it depletes the mental resources needed for high-quality CEO Workday™ execution. The pause is not a cost — it is an investment in the quality of your afternoon, your nervous system regulation, and your hormonal balance.",
      science:
        "Research in chronobiology confirms a natural post-lunch cognitive dip between 1:00 PM and 3:00 PM when blood glucose regulation causes reduced alertness. A genuine midday break with intentional nutrition and movement counteracts this dip, improving afternoon performance by 20–35%. Stepping away also activates the brain's default mode network — the neural system responsible for creative insight and strategic thinking.",
      businessValue:
        "Founders who take a genuine lunch break report higher afternoon focus, better quality decisions during their CEO Workday™, and lower rates of late-day exhaustion. This is one of the most underrated Sustainable Operating Practices™ available.",
      commonMistakes: [
        "Eating at the desk while continuing to work.",
        "Skipping lunch entirely and running on caffeine into the CEO Workday™.",
        "Using the lunch window reactively — responding to emails or attending calls.",
      ],
      bestPractices: [
        "Step fully away from your workspace, even if only for 20 minutes.",
        "Include a brief movement element — a short walk, stretching, or fresh air.",
        "Eat with intention: prioritize protein and healthy fats over high-glycemic carbohydrates.",
      ],
      cbTip:
        "Think of Healthy Hybrid Lunch™ as the bridge between your morning commitments and your CEO Workday™. What happens in this window directly determines the quality of work you do in the four hours that follow.",
    },
  },
  "ceo-workday": {
    dmwId: "ceo-workday",
    time: "1:00 PM – 5:00 PM",
    type: "business",
    description:
      "Your protected, high-leverage CEO execution window. Four focused hours dedicated exclusively to the most important work that moves your business forward.",
    examples: [
      "only scheduling meetings that have an agenda, owner, and clear decision",
      "having AI draft first and reviewing before I send anything",
      "turning every recurring process into an SOP after the third time I do it",
      "sending every client proposal within 24 hours of the conversation",
      "beginning every CEO Workday™ by reviewing my Executive Brief™",
      "having one leveraged sales conversation every working day",
    ],
    learnMore: {
      purpose:
        "The 4-Hour CEO Workday™ is your protected high-leverage execution window — four focused hours dedicated exclusively to the most important work that moves your business forward. It is the Business Operating System™ in action.",
      whyItMatters:
        "Most founders believe they need to work more hours to produce better results. The research says the opposite. Deep, focused, uninterrupted work produces 4–5x more output than the same hours worked in reactive, fragmented mode. Four focused hours in a flow state outperforms eight scattered, interrupted ones every time.",
      science:
        "Cal Newport's research on Deep Work demonstrates that knowledge workers are capable of only 4 hours of peak cognitive performance per day. Parkinson's Law confirms that work expands to fill the time available — a defined 4-hour window forces prioritization and eliminates low-leverage activity. Flow state research (Csikszentmihalyi) demonstrates that full immersion in high-challenge, high-skill work produces exponential output.",
      businessValue:
        "Business Operating Rules™ installed during the CEO Workday™ reduce execution friction, improve decision quality, increase AI leverage, strengthen delegation, and build compounding business assets.",
      commonMistakes: [
        "Allowing meetings, phone calls, or email to interrupt the CEO Workday™.",
        "Starting the CEO Workday™ without a clear Executive Outcome™ defined.",
        "Using CEO Workday™ time for tasks that belong in delegation queues.",
      ],
      bestPractices: [
        "Begin every CEO Workday™ by reviewing your Executive Brief™.",
        "Define one Executive Outcome™ — the single most important result for the day.",
        "AI drafts first. Human judgment second. Never the reverse.",
      ],
      cbTip:
        "Your CEO Workday™ Operating Rule™ is not a task — it is a governing standard. It defines HOW you operate during this window, not just what you do. A great Operating Rule™ applies to every CEO Workday™ this week, next week, and every week after.",
    },
  },
  "time-freedom": {
    dmwId: "time-freedom",
    time: "5:00 PM – 10:00 PM",
    type: "life",
    description:
      "The protected life your business exists to support. Five hours of fully present, fully free time — for your relationships, passions, rest, and joy. The business does not follow you here.",
    examples: [
      "being fully present with my family every evening",
      "attending every one of my child's activities this week",
      "reading for pleasure for at least 30 minutes each evening",
      "spending quality time with my partner at least twice this week",
      "gardening and reconnecting with nature after work",
      "volunteering my time to a cause that matters to me",
    ],
    learnMore: {
      purpose:
        "Time Freedom™ is the protected life your business exists to support. From 5:00 PM to 10:00 PM, you are fully present — in your relationships, your passions, your rest, and your joy. This is a core Sustainable Operating Practice™. The business does not follow you here.",
      whyItMatters:
        "Founders who never fully disconnect report higher burnout, relationship deterioration, declining creative capacity, and accelerated entrepreneurial isolation. Time Freedom™ is not a privilege earned by finishing work — it is a non-negotiable component of sustainable high performance.",
      science:
        "Research in recovery psychology (Sonnentag & Fritz) demonstrates that psychological detachment from work during off-hours is the strongest predictor of next-day job performance, engagement, and creativity.",
      businessValue:
        "Time Freedom™ is the entire purpose of the Work-Life Balance Business Week™. Every CEO Workday™, every Operating Rule™, every AI leverage and delegation decision is in service of expanding and protecting this segment.",
      commonMistakes: [
        "Checking email or Slack during Time Freedom™.",
        "Taking 'just one more call' that erodes the boundary.",
        "Treating Time Freedom™ as optional when the business is demanding.",
      ],
      bestPractices: [
        "Define what Time Freedom™ looks like for you specifically.",
        "Protect this window with the same discipline you apply to your CEO Workday™.",
        "Let the people you love know this time belongs to them.",
      ],
      cbTip:
        "The founder who can walk away from their business at 5:00 PM with a clear conscience has built something extraordinary. That clarity comes from completing meaningful work during the CEO Workday™ — not from working longer hours.",
    },
  },
  "power-down": {
    dmwId: "power-down",
    time: "10:00 PM – 11:00 PM",
    type: "life",
    description:
      "The intentional close to every Work-Life Balance Business Day™. Power Down™ begins at 10:00 PM. You are fully winding down — transitioning away from screens, releasing the day, and preparing your mind and body for deep, restorative rest.",
    examples: [
      "beginning my Power Down™ ritual at 10:00 PM every night",
      "placing all devices out of reach by 10:00 PM",
      "spending 15 minutes in evening reflection and gratitude",
      "reading a book instead of scrolling before sleep",
      "stretching to release the day from my body",
      "reviewing my intentions for tomorrow before I rest",
      "a skincare routine and gentle self-care ritual",
      "quiet conversation with someone I love",
      "light music and candlelight relaxation",
      "preparing tomorrow's clothes and laying out workout wear",
      "prayer or meditation to close the day",
      "deep breathing to signal rest to my nervous system",
    ],
    learnMore: {
      purpose:
        "Power Down™ is your intentional evening ritual — the 60-minute transition between Time Freedom™ and Unplug™. It begins at 10:00 PM and prepares your mind and body for deep, restorative sleep. The business day closes at 11:00 PM sharp.",
      whyItMatters:
        "Sleep quality is the single most important recovery variable for cognitive performance. Founders who do not have a deliberate wind-down practice experience poorer sleep onset, lighter sleep stages, and reduced next-day executive function.",
      science:
        "Harvard sleep research (Walker, 'Why We Sleep') confirms that blue light exposure within 90 minutes of sleep onset reduces melatonin production by up to 50%. Cognitive arousal from email, work content, or social media keeps the prefrontal cortex activated and delays sleep onset by 30–60 minutes on average.",
      businessValue:
        "A well-rested founder makes better decisions, thinks more creatively, manages emotions more skillfully, and sustains high performance over time. Power Down™ is not a soft habit — it is the physiological foundation of the entire Work-Life Balance Business Day™.",
      commonMistakes: [
        "Bringing your phone to bed and scrolling after 10:00 PM.",
        "Checking email or reviewing work in the Power Down™ window.",
        "Not having a defined close of business ritual — the mind stays 'on' without one.",
        "Allowing the Power Down™ window to start later and later each night.",
      ],
      bestPractices: [
        "Create a clear 'close of business' ritual at 10:00 PM — a physical or symbolic act that signals the end of the business day.",
        "Place all devices out of reach by 10:00 PM.",
        "End with something that feeds the mind gently: reading, reflection, or gratitude.",
        "If you choose to Power Down earlier, honor it. Earlier is always encouraged.",
      ],
      cbTip:
        "The way you end today determines how you begin tomorrow. At 11:00 PM, today's business is officially closed. Tomorrow deserves a fully restored CEO. Power Down™ is not the end of the operating cycle — it is the preparation for the next one.",
    },
  },
  "digital-detox": {
    dmwId: "unplug",
    time: "11:00 PM • Closed For Business™",
    type: "life",
    isUnplug: true,
    description:
      "The official close of the Work-Life Balance Business Day™. At 11:00 PM, Harmony Lane™ is Closed For Business™. All devices are away. The community is closed. You are in full rest. Tomorrow deserves a fully restored CEO.",
    examples: [
      "fully unplugged from all devices by 11:00 PM every night",
      "asleep or in bed with no screens by 11:00 PM",
      "honoring the close of business every night at 11:00 PM",
      "protecting my restorative sleep as a non-negotiable CEO investment",
      "trusting that Harmony Lane™ will be here at 7:00 AM — rested and ready",
    ],
    learnMore: {
      purpose:
        "Unplug™ is the 8th Operating Segment™ — the official close of the Work-Life Balance Business Day™. At 11:00 PM, the business day is Closed For Business™. There is no partial unplugging. This commitment protects the restorative sleep that makes everything else in your operating day possible.",
      whyItMatters:
        "Sleep onset, sleep depth, and sleep consistency are directly governed by the signals you send your nervous system between 10:00 PM and 11:00 PM. Unplug™ installs the final boundary that makes true recovery possible.",
      science:
        "Consistent sleep timing regulates the circadian clock, which governs cortisol, melatonin, growth hormone, and immune function simultaneously. Even a single night of disrupted sleep reduces next-day executive decision-making by a measurable margin.",
      businessValue:
        "Tomorrow's CEO Workday™ performance is built tonight. Every hour of quality sleep compounds into clearer thinking, faster decisions, better emotional regulation, and more creative problem-solving the following day.",
      commonMistakes: [
        "Telling yourself 'just five more minutes' — that is how 11:00 PM becomes 1:00 AM.",
        "Keeping your phone on your nightstand within reach.",
        "Treating Unplug™ as optional on high-stress nights — those are exactly the nights you need it most.",
      ],
      bestPractices: [
        "Make Unplug™ a physical act: put the phone in another room.",
        "Your Power Down™ ritual should lead you naturally into Unplug™ without willpower.",
        "If you wake during the night, do not reach for your phone.",
      ],
      cbTip:
        "Your business is now Closed For Business™. Tomorrow deserves a fully restored CEO. Unplug™ is not a restriction — it is the highest form of executive self-respect. Sleep well.",
    },
  },
}

// ---------------------------------------------------------------------------
// Movement activity library (movement-window only)
// ---------------------------------------------------------------------------
const MOVEMENT_ACTIVITIES = [
  "Walking", "Walk Away the Pounds™", "Tai Chi", "Yoga", "Stretching",
  "Pilates", "Strength Training", "Resistance Bands", "Bodyweight Exercises",
  "Dance", "Zumba", "Chair Exercise", "Mobility", "Swimming", "Cycling",
  "Running", "Hiking", "Elliptical", "Treadmill", "Rowing", "Jump Rope",
  "Meditation Walk", "Rebounding", "Gardening", "Other",
]

const SLEEP_OPTIONS = [
  { value: 6.5, label: "6.5 hours" },
  { value: 7,   label: "7 hours" },
  { value: 7.5, label: "7.5 hours" },
  { value: 8,   label: "8 hours", recommended: true },
  { value: 8.5, label: "8.5 hours" },
  { value: 9,   label: "9 hours" },
]

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Intention Declaration™ generator — identical logic to /design-my-week
// ---------------------------------------------------------------------------
function elevateDeclaration(segmentId: string, rawInput: string): string {
  const input = rawInput.trim()
  if (!input) return ""
  const clean = input.replace(/^I am committed to\s+/i, "").replace(/\.$/, "").trim()
  const lower = clean.toLowerCase()

  if (segmentId === "workout") {
    const hasWalkAwayPounds = /walk away the pounds/i.test(clean)
    const hasTaiChi = /tai chi/i.test(clean)
    const hasYoga = /yoga/i.test(clean)
    const hasWalk = /\bwalk\b/i.test(clean) && !hasWalkAwayPounds
    const hasDance = /danc/i.test(clean)
    const hasStrength = /strength|lift|weight/i.test(clean)
    const hasCycl = /cycl|bike/i.test(clean)
    const hasStretch = /stretch/i.test(clean)
    const hasPilates = /pilates/i.test(clean)
    const hasZumba = /zumba/i.test(clean)
    const hasRun = /\brun\b|\brunning\b/i.test(clean)
    const activities: string[] = []
    if (hasWalkAwayPounds) activities.push("Walk Away the Pounds™")
    if (hasTaiChi) activities.push("Tai Chi")
    if (hasYoga) activities.push("yoga")
    if (hasWalk) activities.push("walking")
    if (hasDance) activities.push("dance")
    if (hasStrength) activities.push("strength training")
    if (hasCycl) activities.push("cycling")
    if (hasStretch) activities.push("stretching")
    if (hasPilates) activities.push("Pilates")
    if (hasZumba) activities.push("Zumba")
    if (hasRun) activities.push("running")
    if (activities.length >= 2) {
      const list = activities.length === 2 ? `${activities[0]} and ${activities[1]}` : activities.slice(0, -1).join(", ") + `, and ${activities[activities.length - 1]}`
      return `Today I honor my body by completing both my ${list} during my Movement Window™. Every minute of intentional movement strengthens my energy, supports my health, and prepares me to lead with greater focus and vitality.`
    }
    if (hasWalkAwayPounds) return `I honor my body and energize my morning through my Walk Away the Pounds™ routine, building the physical foundation that powers my CEO Workday™.`
    if (hasTaiChi) return `I center my mind and strengthen my body through my daily Tai Chi practice, arriving at each CEO Workday™ grounded, focused, and fully present.`
    if (hasYoga) return `I restore my body and center my mind through a daily yoga practice, arriving at each day flexible, grounded, and energized.`
    if (hasWalk) return `I strengthen my body and renew my energy through a daily walk, honoring my health as the non-negotiable foundation of everything I build.`
    if (hasDance) return `I move my body joyfully through dance, celebrating the energy and vitality that fuels everything I create.`
    if (hasStrength) return `I build physical strength daily, knowing that a strong body creates the sustained energy and resilience my vision requires.`
    if (hasCycl) return `I build endurance and mental clarity through cycling, arriving at every CEO Workday™ with energy to execute at my highest level.`
    if (hasStretch) return `I honor my body with a daily stretching practice, maintaining the flexibility and recovery that high performance demands.`
    return `I protect my body through ${lower}, treating my physical health as the irreplaceable engine that powers everything I am building.`
  }

  switch (segmentId) {
    case "early-entry":
      if (/school|drop.?off|kids|children/i.test(clean)) return `I honor my family responsibilities by making school drop-off a protected part of my morning, knowing my CEO Workday™ begins on time at 1:00 PM.`
      if (/doctor|appointment|medical/i.test(clean)) return `I take care of my health and personal needs during Flex Time™, protecting my 4-Hour CEO Workday™ and everything that matters most.`
      if (/network|coffee|breakfast|meeting/i.test(clean)) return `I invest in meaningful connections and relationships during my Flex Time™ window, keeping my CEO Workday™ fully protected.`
      return `I use my Flex Time™ intentionally for ${lower}, so that nothing interrupts my 4-Hour CEO Workday™ from 1:00 PM to 5:00 PM.`
    case "morning-given":
      if (/gratitude|thank/i.test(clean)) return `I begin every morning by cultivating gratitude, setting the tone for a focused, intentional, and high-performing day.`
      if (/prayer|faith|spiritual/i.test(clean)) return `I begin every morning grounded in prayer, entering each day with clarity of purpose and strength of spirit.`
      if (/journal/i.test(clean)) return `I begin every morning by journaling my intentions and insights, creating clarity and focus before the day begins.`
      if (/meditat/i.test(clean)) return `I begin every morning with meditation, cultivating the stillness and mental clarity that makes everything else possible.`
      if (/visuali/i.test(clean)) return `I begin every morning visualizing the day I intend to create, aligning my mind and energy before I take a single action.`
      if (/read/i.test(clean)) return `I begin every morning with purposeful reading, feeding my mind with wisdom that compounds into extraordinary results over time.`
      return `I begin every morning with ${lower}, creating the intentional foundation from which my most productive and fulfilling days are built.`
    case "healthy-lunch":
      if (/away.*(desk|screen|computer)/i.test(clean) || /desk/i.test(clean)) return `I nourish my body and reset my mind each day by stepping completely away from my desk at lunch — honoring the pause that makes the afternoon possible.`
      if (/outdoor|outside|walk|fresh air/i.test(clean)) return `I refresh my mind and body at midday with an outdoor break, arriving at my CEO Workday™ energized and ready to lead.`
      if (/friend|family/i.test(clean)) return `I invest in meaningful relationships at lunch, knowing that connection nourishes both the life and the business I am building.`
      if (/meal prep|cook/i.test(clean)) return `I fuel my afternoon with intentional nutrition by preparing a healthy meal, treating my body as the high-performance asset it is.`
      if (/hydrat/i.test(clean)) return `I make hydration a conscious midday practice, knowing that clarity of mind and sustained energy begin with how I fuel my body.`
      return `I nourish my body at midday with ${lower}, honoring the reset that prepares me for my most important CEO work of the day.`
    case "ceo-workday":
      if (/keynote|present/i.test(clean)) return `I protect my 4-Hour CEO Workday™ as dedicated time for high-value creation — and this week, I complete my keynote presentation with full focus and creative excellence.`
      if (/podcast|record/i.test(clean)) return `I use my CEO Workday™ to create content that compounds — recording the podcast episode that builds my authority and impact.`
      if (/proposal|client/i.test(clean)) return `I protect my CEO Workday™ for the high-leverage client work that drives revenue and builds lasting business relationships.`
      if (/sales|conversation|call/i.test(clean)) return `I use my CEO Workday™ to lead high-quality sales conversations that convert with integrity and create genuine client value.`
      if (/AI|delegation|delegate|SOP/i.test(clean)) return `I use my CEO Workday™ to build the systems and delegation frameworks that give me leverage — so I can work fewer hours and produce greater results.`
      if (/webinar|course|program/i.test(clean)) return `I protect my CEO Workday™ for building the programs and content that scale my impact beyond the hours I work.`
      return `I protect my 4-Hour CEO Workday™ from 1:00 PM to 5:00 PM as sacred time for ${lower} — the high-leverage work that builds my business and my future.`
    case "time-freedom":
      if (/child|kid|son|daughter|family/i.test(clean)) return `I protect my family time as fiercely as I protect my CEO Workday™ — being fully present with the people I am building this business for.`
      if (/date|partner|spouse|husband|wife/i.test(clean)) return `I invest in my relationship by creating protected, phone-free time with my partner — because the most important business I run is my life.`
      if (/read|book/i.test(clean)) return `I restore my mind and feed my imagination through reading during Time Freedom™ — knowing that the best leaders never stop learning.`
      if (/garden/i.test(clean)) return `I reconnect with nature and find peace through gardening during my Time Freedom™ — restoring the energy I invest in everything I build.`
      if (/volunteer|community/i.test(clean)) return `I give my time and energy to my community during Time Freedom™, fulfilling the deeper purpose that makes my work meaningful.`
      return `I protect my Time Freedom™ as the sacred, non-negotiable reward for doing disciplined, high-value work during my CEO Workday™ — so I can be fully present for ${lower}.`
    case "power-down":
      if (/phone|device|screen/i.test(clean)) return `I end each business day by unplugging completely, creating the space for deep, restorative rest that makes tomorrow's performance possible.`
      if (/reflect|journal/i.test(clean)) return `I close each day with intentional reflection, acknowledging what I accomplished, what I learned, and what I am grateful for.`
      if (/read|book/i.test(clean)) return `I transition into rest each evening through reading, stepping away from screens and allowing my mind to decompress and restore.`
      if (/stretch|yoga|meditat|breath/i.test(clean)) return `I prepare my body and mind for deep rest each evening through movement and stillness, honoring the recovery that high performance requires.`
      if (/prayer|gratitude/i.test(clean)) return `I close each day in gratitude and prayer, releasing the day with a peaceful heart and welcoming tomorrow with an open one.`
      if (/prepare|tomorrow|plan|clothes/i.test(clean)) return `I close each day with calm preparation for tomorrow — reviewing my intentions, organizing my space, and entering rest with a clear and peaceful mind.`
      if (/skincare|self.care/i.test(clean)) return `I honor my body each evening with intentional self-care, transitioning from the business day into the rest that restores me.`
      return `I create a clear and intentional end to every business day by ${lower}, protecting the rest that makes tomorrow's focus, energy, and leadership possible.`
    case "unplug":
      return `At 11:00 PM, my business is Closed For Business™. I am fully unplugged, fully rested, and fully prepared to lead again tomorrow. My commitment to restorative sleep is an investment in every CEO Workday™ yet to come.`
    default:
      return `I am committed to ${lower}.`
  }
}

// ---------------------------------------------------------------------------
// Movement Planner (movement-window segment only)
// ---------------------------------------------------------------------------
type PlannedActivity = { id: string; activity: string; minutes: number; isCustom: boolean; customActivity: string }

function MovementPlanner({ activities, onChange }: { activities: PlannedActivity[]; onChange: (a: PlannedActivity[]) => void }) {
  const total = activities.reduce((s, a) => s + a.minutes, 0)
  function add() {
    onChange([...activities, { id: crypto.randomUUID(), activity: MOVEMENT_ACTIVITIES[0], minutes: 15, isCustom: false, customActivity: "" }])
  }
  function remove(id: string) { onChange(activities.filter((a) => a.id !== id)) }
  function update(id: string, patch: Partial<PlannedActivity>) { onChange(activities.map((a) => a.id === id ? { ...a, ...patch } : a)) }
  return (
    <div className="mb-6 rounded-2xl border border-brand-green/20 bg-brand-green/[0.04] overflow-hidden">
      <div className="px-5 py-4 border-b border-brand-green/10">
        <p className="font-sans text-sm font-bold text-brand-green">Planned Movement™ <span className="font-normal text-brand-ink-soft">(optional)</span></p>
        <p className="mt-0.5 font-sans text-xs text-brand-ink-soft">Build your 30-minute movement plan. Cherry Blossom™ will track your consistency over time.</p>
      </div>
      <div className="px-5 py-4 space-y-3">
        {activities.length === 0 && <p className="font-sans text-sm text-brand-ink-soft italic">No activities added yet. Add one below, or skip and use the free-text commitment above.</p>}
        {activities.map((act, idx) => (
          <div key={act.id} className="flex items-start gap-3 flex-wrap">
            <div className="flex-1 min-w-[180px]">
              <label className="sr-only">Activity {idx + 1}</label>
              <select value={act.isCustom ? "Other" : act.activity} onChange={(e) => { const val = e.target.value; update(act.id, { activity: val, isCustom: val === "Other" }) }} className="w-full rounded-xl border border-brand-blush bg-white px-3 py-2.5 font-sans text-sm text-brand-ink focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20">
                {MOVEMENT_ACTIVITIES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              {act.isCustom && <input type="text" placeholder="Describe your activity..." value={act.customActivity} onChange={(e) => update(act.id, { customActivity: e.target.value })} className="mt-2 w-full rounded-xl border border-brand-blush bg-white px-3 py-2.5 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/50 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20" />}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select value={act.minutes} onChange={(e) => update(act.id, { minutes: Number(e.target.value) })} className="rounded-xl border border-brand-blush bg-white px-3 py-2.5 font-sans text-sm text-brand-ink focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20">
                {[3, 5, 10, 15, 20, 25, 30].map((m) => <option key={m} value={m}>{m} min</option>)}
              </select>
              <button type="button" onClick={() => remove(act.id)} className="rounded-lg p-2 text-brand-ink-soft hover:text-brand-coral transition-colors" aria-label={`Remove activity ${idx + 1}`}><Trash2 className="h-4 w-4" aria-hidden /></button>
            </div>
          </div>
        ))}
        <button type="button" onClick={add} disabled={total >= 30} className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-white px-4 py-2 font-sans text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/5 disabled:opacity-40 disabled:cursor-not-allowed">
          <Plus className="h-4 w-4" aria-hidden /> Add Activity
        </button>
        {total > 0 && <p className="font-sans text-xs font-medium text-brand-ink-soft">{total} / 30 minutes planned</p>}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sleep Planner (power-down segment only)
// ---------------------------------------------------------------------------
function SleepPlanner({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div className="mb-6 rounded-2xl border border-brand-green/20 bg-brand-green/[0.04] overflow-hidden">
      <div className="px-5 py-4 border-b border-brand-green/10">
        <p className="font-sans text-sm font-bold text-brand-green">My Sleep Goal™</p>
        <p className="mt-0.5 font-sans text-xs text-brand-ink-soft">How many hours of restorative sleep will you protect tonight?</p>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {SLEEP_OPTIONS.map((opt) => (
            <button key={opt.value} type="button" onClick={() => onChange(opt.value)} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-sans text-sm font-semibold transition-colors ${value === opt.value ? "bg-brand-green text-white" : "border border-brand-blush bg-white text-brand-ink-soft hover:border-brand-green/40 hover:text-brand-green"}`}>
              {opt.label}
              {opt.recommended && <span className={`text-[10px] font-bold uppercase tracking-wide ${value === opt.value ? "text-white/80" : "text-brand-coral"}`}>Recommended</span>}
            </button>
          ))}
        </div>
        {value !== null && (
          <div className="rounded-xl border border-brand-green/20 bg-white/60 px-4 py-3">
            <p className="font-sans text-sm font-medium text-brand-ink">
              <strong className="text-brand-green">{value} hours</strong> of restorative sleep committed.{" "}
              {value < 7 ? "Harmony Lane™ recommends 8 hours for peak executive performance, but honors your current season of life." : value === 8 ? "Harmony Lane™ recommends exactly 8 hours — you are honoring the science of sustainable peak performance." : "This commitment supports the deep recovery your CEO performance requires."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Learn More section helper
// ---------------------------------------------------------------------------
function LearnMoreSection({ heading, body }: { heading: string; body: string }) {
  return (
    <div>
      <p className="font-bold text-brand-ink mb-1">{heading}</p>
      <p>{body}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// RepeatAfterMe — Intention Declaration block that lives inside the hero card
// ---------------------------------------------------------------------------
interface RepeatAfterMeProps {
  blockId: BlockId
  data: SegmentData
}

function RepeatAfterMe({ blockId, data }: RepeatAfterMeProps) {
  const [input, setInput] = useState("")
  const [declaration, setDeclaration] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  function handleGenerate() {
    if (!input.trim()) return
    setDeclaration(elevateDeclaration(data.dmwId, input))
  }

  if (confirmed && declaration) {
    return (
      <div className="mt-6 w-full space-y-4 text-left">
        <div className="rounded-2xl border border-brand-green/20 bg-brand-green/5 px-5 py-4">
          <p className={`font-sans text-xs font-bold uppercase tracking-[0.2em] mb-2 ${TYPE_COLOR[data.type]}`}>
            {TYPE_DECLARATION_LABEL[data.type]}
          </p>
          <p className="font-sans text-[15px] font-semibold leading-relaxed text-brand-ink text-balance">
            &ldquo;{declaration}&rdquo;
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 font-sans text-sm font-bold text-white shadow-sm">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Installed™
          </div>
          <button
            type="button"
            onClick={() => { setConfirmed(false); setDeclaration(null) }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-transparent px-5 py-3 font-sans text-sm font-semibold text-brand-green transition-all hover:bg-brand-green/5"
          >
            Edit
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 w-full space-y-4 text-left">
      {/* Instruction */}
      <p className="font-sans text-[14px] leading-relaxed text-brand-ink-soft text-pretty">
        For this segment, complete the commitment. I will transform it into an{" "}
        <strong className="text-brand-ink">Intention Declaration™</strong> you will live from, this week.
      </p>

      {/* Example chips */}
      <div>
        <p className="font-sans text-[13px] font-semibold text-brand-ink mb-1">
          Choose one&hellip; or create your own.
        </p>
        <p className="font-sans text-[12px] text-brand-ink-soft mb-3">
          Click any example to use it, then customize it as you like.
        </p>
        <div className="flex flex-wrap gap-2">
          {data.examples.slice(0, 6).map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => { setInput(ex); setDeclaration(null) }}
              className={`rounded-full border px-3 py-1.5 font-sans text-xs font-medium transition-colors ${
                input === ex
                  ? "border-brand-green bg-brand-green/10 text-brand-green"
                  : "border-brand-blush bg-white/70 text-brand-ink-soft hover:border-brand-green/40 hover:text-brand-green"
              }`}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Commitment input + declaration */}
      {!declaration ? (
        <div className="space-y-4">
          <div>
            <label htmlFor={`ram-${blockId}`} className="block font-sans text-sm font-bold text-brand-ink mb-2">
              {TYPE_INPUT_LABEL[data.type]}
            </label>
            <div className="flex items-start rounded-xl border border-brand-blush bg-white/60 focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/20 transition-all overflow-hidden">
              <span className="shrink-0 px-4 pt-3.5 font-sans text-[15px] font-semibold text-brand-green select-none">
                I am committed to
              </span>
              <textarea
                id={`ram-${blockId}`}
                value={input}
                onChange={(e) => { setInput(e.target.value); setDeclaration(null) }}
                placeholder="completing the sentence..."
                rows={2}
                className="flex-1 bg-transparent px-2 py-3.5 font-sans text-[15px] text-brand-ink placeholder:text-brand-ink-soft/40 focus:outline-none resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                    e.preventDefault()
                    handleGenerate()
                  }
                }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!input.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create My Intention Declaration™
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-brand-green/20 bg-brand-green/5 px-5 py-4">
            <p className={`font-sans text-xs font-bold uppercase tracking-[0.2em] mb-2 ${TYPE_COLOR[data.type]}`}>
              {TYPE_DECLARATION_LABEL[data.type]}
            </p>
            <p className="font-sans text-[15px] font-semibold leading-relaxed text-brand-ink text-balance">
              &ldquo;{declaration}&rdquo;
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setConfirmed(true)}
              className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Install This™
            </button>
            <button
              type="button"
              onClick={() => setDeclaration(null)}
              className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-transparent px-5 py-3 font-sans text-sm font-semibold text-brand-green transition-all hover:bg-brand-green/5"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Segment Body — all /design-my-week content after the Cherry Blossom™ hero
// ---------------------------------------------------------------------------
interface SegmentBodyProps {
  blockId: BlockId
  data: SegmentData
  config: NonNullable<(typeof PLANNER_CONFIG)[BlockId]>
}

function SegmentBody({ blockId, data, config }: SegmentBodyProps) {
  const [showFlexInfo, setShowFlexInfo] = useState(false)
  const [showLearnMore, setShowLearnMore] = useState(false)
  const [showBca, setShowBca] = useState(false)
  const [plannedActivities, setPlannedActivities] = useState<PlannedActivity[]>([])
  const [plannedSleep, setPlannedSleep] = useState<number | null>(null)

  const isWorkout = blockId === "movement-window"
  const isPowerDown = blockId === "power-down"

  return (
    <div className="px-6 py-10 sm:px-12 lg:px-20 xl:px-28">
      <div className="w-full max-w-5xl mx-auto">

        {/* Segment meta: type chip + time */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className={`font-sans text-xs font-bold uppercase tracking-[0.22em] ${TYPE_COLOR[data.type]}`}>
            {TYPE_LABEL[data.type]}
          </span>
          <span className="flex items-center gap-1 font-sans text-xs font-medium text-brand-ink-soft">
            <Clock className="h-3 w-3" aria-hidden />
            {data.time}
          </span>
          {data.isUnplug && (
            <span className="rounded-full bg-brand-coral/10 px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-coral">
              Segment 8
            </span>
          )}
        </div>

        {/* Segment title — e.g. "Design My Time Freedom™" */}
        <h2 className="font-playfair text-3xl font-bold text-brand-ink mb-4 text-balance">
          {config.title}
        </h2>

        {/* Guided Moments™ — the daily interactive experience for Flex Time & Preparation™.
            Replaces the old chip-picker / Intention Declaration™ workflow. Kept above the
            educational content below so members who just want to move through their morning
            can do so quickly, while members who want to learn more can still expand it. */}
        {blockId === "early-access" && <FlexTimeGuidedMoments />}

        {/* Learn More About This Segment™ accordion — right under title */}
        {data.learnMore && (
          <div className="mb-6 mt-3 rounded-2xl border border-brand-green/20 bg-brand-green/[0.05] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowLearnMore((v) => !v)}
              className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-brand-green/[0.04] transition-colors"
              aria-expanded={showLearnMore}
            >
              <span className="flex items-center gap-2 font-sans text-sm font-bold text-brand-green-dark">
                <Info className="h-4 w-4 text-brand-green" aria-hidden />
                Learn More About This Segment™
              </span>
              <ChevronDown
                className={`h-4 w-4 text-brand-green/60 transition-transform duration-200 ${showLearnMore ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {showLearnMore && (
              <div className="px-5 pb-6 pt-1 space-y-5 font-sans text-[15px] leading-relaxed text-brand-ink border-t border-brand-green/10">
                <LearnMoreSection heading="Purpose" body={data.learnMore.purpose} />
                <LearnMoreSection heading="Why It Matters" body={data.learnMore.whyItMatters} />
                <LearnMoreSection heading="Scientific Foundation" body={data.learnMore.science} />
                <LearnMoreSection heading="Business Value" body={data.learnMore.businessValue} />
                <div>
                  <p className="font-bold text-brand-ink mb-1.5">Common Mistakes</p>
                  <ul className="space-y-1 list-disc ml-4">
                    {data.learnMore.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-brand-ink mb-1.5">Best Practices</p>
                  <ul className="space-y-1 list-disc ml-4">
                    {data.learnMore.bestPractices.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div className="rounded-xl border border-brand-green/20 bg-brand-green/[0.06] px-4 py-3">
                  <p className="font-bold text-brand-green-dark mb-1">Cherry Blossom™ Tip</p>
                  <p>{data.learnMore.cbTip}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Flex Time™ info panel */}
        {data.flexNote && (
          <div className="mb-6 rounded-2xl border border-brand-blush bg-brand-cream/50 p-5">
            <button
              type="button"
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
              <div className="mt-4 space-y-3 font-sans text-[15px] font-medium leading-relaxed text-brand-ink">
                <p><strong>Default:</strong> {data.flexNote.default}</p>
                <p><strong>Borrowing:</strong> When life requires it, you may temporarily expand Flex Time™ by borrowing:</p>
                <ul className="ml-4 space-y-1 list-disc">
                  {data.flexNote.borrow.map((b) => (
                    <li key={b.from}><strong>{b.from}</strong> — {b.max}</li>
                  ))}
                </ul>
                <p className="font-semibold">{data.flexNote.max}</p>
                <p className="rounded-xl border border-brand-coral/20 bg-brand-coral/5 px-4 py-3 text-brand-ink-soft">
                  <strong className="text-brand-ink">Important:</strong> {data.flexNote.rule}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Borrow note */}
        {data.borrowNote && (
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-brand-blush bg-brand-cream/50 px-4 py-3">
            <Info className="h-4 w-4 mt-0.5 shrink-0 text-brand-ink-soft" aria-hidden />
            <p className="font-sans text-[13px] font-medium text-brand-ink-soft">
              <strong className="text-brand-ink">Borrow Flex Time™:</strong> {data.borrowNote}
            </p>
          </div>
        )}

        {/* Unplug™ CB message */}
        {data.isUnplug && (
          <div className="mb-6 rounded-2xl border border-brand-coral/20 bg-brand-coral/[0.04] px-5 py-4">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-brand-coral mb-2">
              Cherry Blossom™ says:
            </p>
            <p className="font-sans text-[15px] font-medium leading-relaxed text-brand-ink italic">
              &ldquo;Your business is now{" "}
              <strong className="not-italic">Closed For Business™</strong>. Tomorrow deserves
              a fully restored CEO.&rdquo;
            </p>
          </div>
        )}

        {/* Movement Planner */}
        {isWorkout && (
          <MovementPlanner
            activities={plannedActivities}
            onChange={setPlannedActivities}
          />
        )}

        {/* Sleep Planner */}
        {isPowerDown && (
          <SleepPlanner value={plannedSleep} onChange={setPlannedSleep} />
        )}

        {/* Business Context Assessment™ accordion — ceo-workday only */}
        {blockId === "ceo-workday" && (
          <div className="mt-8 rounded-2xl border border-brand-green/20 bg-brand-green/[0.04] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowBca((v) => !v)}
              aria-expanded={showBca}
              className="flex w-full items-center justify-between px-5 py-5 text-left hover:bg-brand-green/[0.04] transition-colors"
            >
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-brand-green mt-0.5 shrink-0" aria-hidden />
                <div>
                  <p className="font-sans text-base font-bold text-brand-ink">
                    Business Context Assessment™
                  </p>
                  <p className="font-sans text-[13px] leading-relaxed text-brand-ink/55 mt-0.5 max-w-lg">
                    Complete your Business Context Assessment™ to help Harmony Lane™ better understand your business and provide more personalized executive guidance and recommendations.
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`ml-4 h-5 w-5 shrink-0 text-brand-green/60 transition-transform duration-200 ${showBca ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {showBca && (
              <div className="border-t border-brand-green/10">
                <BusinessContextProfile onDone={() => setShowBca(false)} />
              </div>
            )}
          </div>
        )}

        {/* Chip picker + "I am committed to" input + Create My Intention Declaration™
            Skip for unplug (digital-detox) segments — they have no commitment workflow —
            and for Flex Time & Preparation™, which now uses Guided Moments™ above instead. */}
        {!data.isUnplug && blockId !== "early-access" && (
          <RepeatAfterMe blockId={blockId} data={data} />
        )}

      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// OperatingPlanner — main export
// ---------------------------------------------------------------------------
interface OperatingPlannerProps {
  blockId: BlockId
}

export function OperatingPlanner({ blockId }: OperatingPlannerProps) {
  const config = PLANNER_CONFIG[blockId]
  const data = SEGMENT_DATA[blockId]
  const [open, setOpen] = useState(true)

  if (!config) return null

  return (
    /* Panoramic outer wrapper — truly full width, no margin constraints */
    <div className="relative z-10 w-full pb-[4.5rem] pt-0">
      {/* Toggle header — full width */}
      <div
        className="w-full overflow-hidden rounded-none"
        style={{ backgroundColor: config.surface }}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`operating-planner-body-${blockId}`}
          className="flex w-full items-start justify-between gap-4 px-6 pt-8 pb-8 text-left sm:px-12 sm:pt-10 sm:pb-10"
        >
          <span>
            <span className="ds-eyebrow text-brand-green-dark/70">{config.workspaceLabel}</span>
            <span className="mt-1.5 block font-display text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
              {config.title}
            </span>
            <span className="mt-2 block font-serif text-sm italic text-brand-ink-soft">
              {config.atmosphere}
            </span>
            {config.purposeDescription && (
              <span className="mt-3 block font-sans text-sm text-brand-ink-soft/80 max-w-lg">
                {config.purposeDescription}
              </span>
            )}
          </span>
          <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-brand-ink-soft">
            <ChevronDown
              className={`ds-icon transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
            <span className="sr-only">{open ? "Collapse workspace" : "Expand workspace"}</span>
          </span>
        </button>
      </div>

        {/* Collapsible body — PANORAMIC, edge-to-edge */}
      {open && (
        <div id={`operating-planner-body-${blockId}`} className="w-full">

          {/* Space™ — tinted surface bg + elevated white workspace card */}
          {data && (
            // Part 5: subtle tinted background spans the full Space™ area
            <div className="w-full px-4 pb-12 pt-12 sm:px-8 lg:px-12" style={{ backgroundColor: config.surface }}>
              {/* Part 6: single elevated white workspace card */}
              <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white shadow-[0_4px_32px_rgba(0,0,0,0.08)] overflow-hidden ring-1 ring-black/[0.04]">
                <SegmentBody blockId={blockId} data={data} config={config} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OperatingPlanner
