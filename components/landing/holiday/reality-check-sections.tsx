import { RegistrationForm } from "./registration-form"
import { OfferCta } from "@/components/landing/offer-cta"
import { getPlanByLevel } from "@/lib/payments/config"
import {
  FOUNDER_PRICING_DEADLINE,
  SESSION_DURATION_LABEL,
  SESSION_TIME_LABEL,
  isFounderPricingOpen,
} from "@/lib/reality-check/session"

const INK = "text-[#4A3A42]"
const BODY_BASE = "font-poppins text-pretty leading-relaxed text-[#5A4A52]"
const BODY = `${BODY_BASE} text-[17px] sm:text-lg`
const BODY_SM = `${BODY_BASE} text-base`
const BODY_XS = `${BODY_BASE} text-sm`
const EYEBROW = "font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#5A7F46]"
const H2 = `font-playfair text-balance text-3xl font-bold leading-tight sm:text-5xl ${INK}`

function CtaLink({ label = "Save My Free Seat" }: { label?: string }) {
  return (
    <a
      href="#register"
      className="font-poppins inline-flex w-fit items-center justify-center rounded-full bg-[#C13B6B] px-7 py-4 text-base font-semibold uppercase tracking-[0.12em] text-[#FFF8F4] shadow-lg shadow-[#C13B6B]/25 transition-colors hover:bg-[#A8305B]"
    >
      {label}
    </a>
  )
}

function Dot({ className = "bg-[#C13B6B]" }: { className?: string }) {
  return <span aria-hidden="true" className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${className}`} />
}

export function FreedomSection() {
  return (
    <section className="bg-[#FFF8F4] py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <p className={EYEBROW}>Workweek Redesign for Human Sustainability in the Accelerated Age of AI</p>
          <h2 className={H2}>AI is creating capacity. What will you do with the time it gives you back?</h2>
          <p className={BODY}>
            You started your business for freedom. But somewhere along the way, the business may have become another
            place where you work harder, carry more responsibility, and struggle to make room for the life you intended
            to create.
          </p>
          <p className={BODY}>Now AI is changing what one person or a small team can accomplish.</p>
          <p className={`font-playfair text-xl italic leading-snug sm:text-2xl ${INK}`}>
            Before you use it to do more, consider this: have you redesigned the way your business operates to support
            the freedom you wanted in the first place?
          </p>
          <p className={BODY}>Welcome to a different way to approach the workweek.</p>
          <p className={`font-poppins text-lg font-semibold leading-relaxed text-[#5A7F46]`}>
            Experience work-life balance in real time. Discover what needs to change. Make time for more life.
          </p>
        </div>
        <img
          src="/images/holiday/digital-detox-sign.webp"
          alt="A holiday signboard reading: We are closed and unplugged, digital detox in session, business hours 9 AM to 5 PM and 10 PM to 11 PM. We don't hustle, we harmonize."
          className="w-full rounded-3xl object-cover shadow-xl"
          loading="lazy"
        />
      </div>
    </section>
  )
}

export function RealityCheckSection() {
  const steps = [
    {
      number: "01",
      title: "Complete your Founder Profile™",
      body: "First, tell us about you: who you are, your circumstances, and the life you want your business to support. Every field is optional. This profile helps Harmony Lane™ understand how to guide you from day one.",
      detail: "About 3–5 minutes",
    },
    {
      number: "02",
      title: "Complete your Business Context Profile™",
      body: "Now tell us about the business you're building: its current stage, how it operates, the work you carry, the people and tools involved, and what you're working toward. No scores and no right answers—just the context needed to make recommendations relevant to your real business.",
      detail: "About 10 minutes",
    },
    {
      number: "03",
      title: "Reconnect with your Original Entrepreneurial Intention™",
      body: "Choose everything you hoped your business would make possible when you started. Explore the life you wanted across time and freedom, health and rest, relationships and family, community and giving, play and creativity, home and inner life, financial autonomy, and the deeper reasons you chose entrepreneurship.",
      detail: "Select all that apply",
    },
    {
      number: "04",
      title: "Explore your Business Reality™",
      body: "Identify the conditions in your operating environment that may collide with the life you described: founder dependency, meetings, interruptions, client expectations, availability, decision ownership, delegation, team capacity, workload, deadlines, communication, technology, notifications, systems, workflows, automation, AI support, operating hours, and escalation. These are not scored. They help identify what the Business Week™ can help you examine and design.",
      detail: "Select every condition that applies",
    },
    {
      number: "05",
      title: "Describe your Personal & Work-From-Home Reality™",
      body: "Share the personal responsibilities and work-from-home circumstances your business needs to make room for. This context helps distinguish what the business demands from what your life requires.",
      detail: "Select what applies right now",
    },
    {
      number: "06",
      title: "Complete your 30-Day Work-Life Balance Audit™",
      body: "Answer 15 quick questions about the last 30 days across your 15 Core Value Areas™. Your answers establish your 30-Day Work-Life Balance Baseline™—a starting point for understanding how life has really been operating alongside your business.",
      detail: "15 questions · 15 Core Value Areas™",
    },
    {
      number: "07",
      title: "Review your Results & Priority Focus Areas™",
      body: "See your overall Work-Life Balance Score™ and how each area is showing up in your baseline. Areas at 60% or below may need more protected time, space, attention, or capacity. Then choose one, two, or three priority areas to focus on during your first or next Work-Life Balance Business Week™.",
      detail: "Choose 1–3 priority areas",
    },
  ]

  const lifeAreas = [
    "Time & Freedom",
    "Health & Rest",
    "Relationships & Family",
    "Community & Giving",
    "Play, Travel & Creativity",
    "Home, Self & Inner Life",
    "Financial & Life Autonomy",
    "The Deeper Intent",
  ]

  return (
    <section id="reality-check" className="relative scroll-mt-20 overflow-hidden bg-[#2E2228] py-20 sm:py-28">
      <img src="/images/holiday/kwanzaa-rest.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-20" loading="lazy" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-14 px-5 sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
          <p className="font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">
            Your first step in Harmony Lane™
          </p>
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#FFF8F4] sm:text-5xl">
            The Work-Life Balance Reality Check™
          </h2>
          <p className="font-playfair text-balance text-xl italic leading-relaxed text-[#F6D6E1] sm:text-2xl">
            An interactive experience designed to connect what you built your business for with how your life is really operating today—and uncover what your business needs to protect so you can make time for more life.
          </p>
          <p className="font-poppins max-w-3xl text-base leading-relaxed text-[#FFF8F4] sm:text-lg">
            First, we'd love to get to know you and the business you're building. You'll complete your Founder Profile™ and Business Context Profile™, then take the Reality Check™. Together, they help Harmony Lane™ personalize the guidance and experience that follow.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {steps.map((step) => (
            <article key={step.number} className="flex gap-4 rounded-2xl border border-[#FFF8F4]/15 bg-[#2E2228]/70 p-6 backdrop-blur-sm">
              <span className="font-playfair shrink-0 text-3xl font-bold text-[#F6A9C2]">{step.number}</span>
              <div className="flex flex-col gap-2">
                <h3 className="font-playfair text-xl font-bold text-[#FFF8F4]">{step.title}</h3>
                <p className="font-poppins text-base leading-relaxed text-[#F6D6E1]">{step.body}</p>
                <p className="font-poppins text-sm font-semibold text-[#C9DDB4]">{step.detail}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="grid gap-8 rounded-3xl bg-[#FFF8F4] p-7 sm:p-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7F46]">What you'll reconnect with</p>
            <h3 className={`font-playfair text-2xl font-bold ${INK}`}>The life you wanted your business to make possible.</h3>
            <p className={BODY_SM}>Your Original Entrepreneurial Intention™ invites you to choose all that apply—not just one answer—from the areas that matter in a whole life.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {lifeAreas.map((area) => (
              <li key={area} className="font-poppins flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-base font-medium text-[#4A3A42]">
                <Dot className="mt-0 bg-[#5A7F46]" />
                {area}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#C9DDB4]">Your baseline</p>
            <h3 className="font-playfair text-2xl font-bold text-[#FFF8F4]">A clearer picture of your last 30 days.</h3>
            <p className="font-poppins text-base leading-relaxed text-[#F6D6E1]">
              The 15-question audit looks across your 15 Core Value Areas™ and establishes your 30-Day Work-Life Balance Baseline™. Your score is a starting point—not a verdict about you or your business.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-[#FFF8F4]/15 bg-[#2E2228]/70 p-6">
            <h3 className="font-playfair text-xl font-bold text-[#FFF8F4]">Your Priority Focus Areas™</h3>
            <p className="font-poppins text-base leading-relaxed text-[#F6D6E1]">
              Review the areas that may need more protected time, space, attention, or capacity. Choose one, two, or three that matter most now. These become the focus of your first or next Work-Life Balance Business Week™.
            </p>
          </div>
        </div>

        <div className="grid gap-8 rounded-3xl bg-[#FCEEF2] p-7 sm:p-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-3">
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7F46]">What you'll receive</p>
            <h3 className="font-playfair text-2xl font-bold text-[#4A3A42]">Your Work-Life Balance Boundary Report™</h3>
            <p className="font-poppins text-base leading-relaxed text-[#5A4A52]">
              Your completed profiles, answers, baseline, business conditions, and selected priorities come together in a personalized report you can use as your starting point for boundary design.
            </p>
          </div>
          <ul className="flex flex-col gap-3">
            {[
              "A record of the life you originally wanted your business to support.",
              "Your Business Context Profile™ and the operating conditions you identified.",
              "Your 30-Day Work-Life Balance Baseline™ across the 15 Core Value Areas™.",
              "Your Priority Focus Areas™—the one, two, or three areas you selected.",
              "A clearer starting point for deciding what your business needs to protect and what to work on next.",
            ].map((item) => (
              <li key={item} className="font-poppins flex gap-3 text-base leading-relaxed text-[#4A3A42]">
                <Dot className="mt-2 bg-[#5A7F46]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#C9DDB4]">Your next step is yours to choose</p>
          <h3 className="font-playfair text-balance text-2xl font-bold text-[#FFF8F4] sm:text-3xl">Bring your Boundary Report™ into the Work-Life Balance Business Week™.</h3>
          <p className="font-poppins text-base leading-relaxed text-[#F6D6E1] sm:text-lg">
            The Reality Check helps you understand your starting point. The one-week Business Week is where you bring your real business into the experience, practice the Work-Life Balance Business Day™ rhythm, examine the collisions you identified, and begin designing boundaries that help your business make room for the life you want.
          </p>
          <a href="#business-week" className="font-poppins inline-flex w-fit items-center justify-center rounded-full bg-[#C13B6B] px-7 py-4 text-base font-semibold uppercase tracking-[0.12em] text-[#FFF8F4] shadow-lg shadow-[#C13B6B]/25 transition-colors hover:bg-[#A8305B]">
            Explore the Work-Life Balance Business Week™
          </a>
        </div>
      </div>
    </section>
  )
}

const BOUNDARY_AREAS = [
  { title: "Time", body: "Decide when work begins and ends, and what fits into the time available." },
  { title: "Personal life", body: "Protect time for relationships, family, personal interests, and life outside the business." },
  { title: "Breaks", body: "Make room for movement, meals, rest, and transitions instead of working straight through." },
  { title: "Availability", body: "Decide when clients, colleagues, team members, and business demands can access your time." },
  {
    title: "Workload",
    body: "Recognize when too much rests on you, and decide what to prioritize, delegate, defer, or redesign.",
  },
  { title: "Digital", body: "Establish when to disconnect from business communications and technology." },
]

const MONDAY_SEQUENCE = [
  { title: "Identify your boundaries", body: "Decide what matters in your life and what you want your business day to respect." },
  { title: "Decide & design your day", body: "Set your non-negotiables and plan your actual business work around them." },
  {
    title: "Do your real work",
    body: "Work on real priorities during The 4-Hour Focused CEO Workday™, practicing the boundaries you set.",
  },
  {
    title: "Check in",
    body: "Use the Five-Minute Work-Life Boundary Check-In™ to see where work collides with your boundaries.",
  },
  { title: "Reflect & adjust", body: "Recognize what worked, what needs attention, and what you want to keep practicing." },
]

const DAY_RHYTHM = [
  "Morning routine",
  "Movement",
  "Decide & design",
  "Extended lunch",
  "4-Hour Focused CEO Workday™",
  "Power down",
  "Time Freedom™",
]

const CHECK_IN = [
  { word: "Notice", body: "Where is work colliding with the boundaries you want to protect?" },
  { word: "Identify", body: "What is creating that collision?" },
  { word: "Consider", body: "What could change?" },
]

export function MondaySection() {
  const monday = getPlanByLevel("business-day")
  return (
    <section id="monday" className="scroll-mt-20 bg-[#FFFDFB] py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-5 sm:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className={EYEBROW}>Offer One · Make Time For More on Mondays™</p>
            <h2 className={H2}>Redesign Your Entry Into the Workweek™</h2>
            <p className={BODY}>
              Monday is your guided entry into the Work-Life Balance Business Day™, the operating rhythm you practice
              Monday through Thursday, with Friday through Sunday protected as a three-day weekend. It&apos;s a full,
              guided business day, not a workshop, a presentation, or a coworking session.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className={`font-playfair text-2xl font-bold ${INK}`}>Bring your real work. Practice a different way to work.</h3>
            <p className={BODY}>
              Before the day begins, you identify the boundaries you want your business to respect. Then you plan and
              work on actual business priorities while practicing those boundaries in real time.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="font-poppins text-base font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            The boundaries you&apos;ll practice
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BOUNDARY_AREAS.map((b) => (
              <li key={b.title} className="flex flex-col gap-2 rounded-2xl bg-[#FFF8F4] p-6 ring-1 ring-[#F2E4E8]">
                <h4 className={`font-playfair text-xl font-bold ${INK}`}>{b.title} boundaries</h4>
                <p className={`${BODY_SM}`}>{b.body}</p>
              </li>
            ))}
          </ul>
          <p className={`${BODY_SM} max-w-3xl italic`}>
            These are areas to explore, not a rigid rulebook. You choose the boundaries that reflect your life, values,
            responsibilities, and business.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="flex flex-col gap-5 lg:col-span-3">
            <h3 className="font-poppins text-base font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
              What happens during the day
            </h3>
            <ol className="flex flex-col divide-y divide-[#F2E4E8] border-y border-[#F2E4E8]">
              {MONDAY_SEQUENCE.map((s, i) => (
                <li key={s.title} className="flex gap-5 py-5">
                  <span className="font-playfair w-6 shrink-0 text-2xl font-bold text-[#C13B6B]">{i + 1}</span>
                  <div className="flex flex-col gap-1">
                    <h4 className={`font-playfair text-lg font-bold ${INK}`}>{s.title}</h4>
                    <p className={`${BODY_SM}`}>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-3">
              <p className="font-poppins text-sm font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">The full day includes</p>
              <ul className="flex flex-wrap gap-2">
                {DAY_RHYTHM.map((r) => (
                  <li key={r} className="font-poppins rounded-full bg-[#EEF3E8] px-3 py-1.5 text-sm font-medium text-[#4A3A42]">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="flex flex-col gap-5 rounded-3xl bg-[#2E2228] p-7 lg:col-span-2">
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#C9DDB4]">
              The Five-Minute Work-Life Boundary Check-In™
            </p>
            <ul className="flex flex-col gap-4">
              {CHECK_IN.map((c) => (
                <li key={c.word} className="flex flex-col gap-1">
                  <span className="font-playfair text-xl font-bold text-[#F6A9C2]">{c.word}</span>
                  <span className="font-poppins text-base leading-relaxed text-[#FFF8F4]">{c.body}</span>
                </li>
              ))}
            </ul>
            <p className="font-poppins text-base leading-relaxed text-[#F6D6E1]">
              A practical reflection and decision tool. It isn&apos;t a score or a judgment, and not every collision can
              be fixed right away. You decide what to change first and what can wait.
            </p>
          </aside>
        </div>

        <div className="flex flex-col gap-6 rounded-3xl bg-[#FCEEF2] p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <p className={`font-playfair max-w-2xl text-pretty text-xl leading-snug ${INK}`}>
            You won&apos;t just leave with ideas about work-life balance. You&apos;ll have experienced what it feels like
            to approach your business day differently, practiced boundaries while doing your actual work, and identified
            changes you can keep making.
          </p>
          <div className="flex shrink-0 flex-col gap-3">
            <p className={`font-playfair text-4xl font-bold ${INK}`}>{monday?.priceLabel ?? "$997"}</p>
            <p className="font-poppins text-base text-[#5A4A52]">Full guided day · live with Barbara</p>
            <OfferCta href={monday?.checkoutUrl || undefined} label="Join Make Time For More on Mondays™" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function BusinessWeekSection() {
  const weekExperience = [
    {
      title: "Bring your real business",
      body: "Bring the work, responsibilities, client commitments, team realities, and operating conditions that make up your actual business. This is not a hypothetical exercise.",
    },
    {
      title: "Experience the Business Day rhythm",
      body: "Move through the guided Work-Life Balance Business Day™ rhythm: morning alignment, movement, an extended lunch break, a focused CEO workday, and a deliberate power-down. The operating model centers on a four-day workweek, Monday through Thursday, with a three-day weekend.",
    },
    {
      title: "Work on real priorities",
      body: "Use the 1:00–5:00 PM ET 4-Hour Focused CEO Workday™ to work on meaningful business priorities within a defined work window—not to add another layer of work to your day.",
    },
    {
      title: "Examine the collisions",
      body: "Use your Reality Check™ and Boundary Report™ to examine where business demands collide with the life you want to protect: availability, workload, decisions, delegation, communication, systems, workflows, technology, and more.",
    },
    {
      title: "Select and begin developing a boundary",
      body: "Choose a business boundary to work on and begin translating it into practical decisions about how the business operates. Depending on the boundary, that may involve communication expectations, work assignments, operating hours, workflows, or a Sustainable Operating Procedure™.",
    },
    {
      title: "Reflect and decide what comes next",
      body: "Notice what the experience reveals, what you can begin changing, and what needs continued attention. One week is a beginning—not a promise that every collision or operating procedure will be fully resolved.",
    },
  ]

  return (
    <section id="business-week" className="scroll-mt-20 bg-[#FFF8F4] py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <img
            src="/images/holiday/team-celebration.webp"
            alt="A team sharing a moment of connection and celebration"
            className="w-full rounded-3xl object-cover shadow-xl"
            loading="lazy"
          />
          <div className="flex flex-col gap-5">
            <p className={EYEBROW}>A one-week guided intensive · One-time purchase</p>
            <h2 className={H2}>The Work-Life Balance Business Week™</h2>
            <p className={BODY}>
              Don't just assess your work-life balance. Experience a different way to operate your business. Bring your actual business into a guided, immersive week where you practice the Work-Life Balance Business Day™ rhythm, work on real priorities, and see where the way your business operates supports—or conflicts with—the life you want it to make possible.
            </p>
            <p className={BODY}>
              Your Reality Check™ and Work-Life Balance Boundary Report™ give you a starting point. During the Week™, you use that insight to examine your operating reality, choose a boundary to develop, and begin designing how the business can respect it.
            </p>
            <p className="font-playfair text-xl italic leading-snug text-[#4A3A42]">
              The day creates the space. The boundaries contain the work. The operating procedures protect the boundaries.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="font-poppins text-base font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            What you'll do during the week
          </h3>
          <ol className="grid gap-4 md:grid-cols-2">
            {weekExperience.map((item, index) => (
              <li key={item.title} className="flex gap-4 rounded-2xl bg-white p-6 ring-1 ring-[#F2E4E8]">
                <span className="font-playfair shrink-0 text-2xl font-bold text-[#C13B6B]">{index + 1}</span>
                <div className="flex flex-col gap-2">
                  <h4 className={`font-playfair text-xl font-bold ${INK}`}>{item.title}</h4>
                  <p className={BODY_SM}>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "The day creates the space", body: "A defined daily rhythm and focused work window give the work a container." },
            { title: "The boundaries contain the work", body: "You identify what the business can and cannot demand of your time, energy, availability, and attention." },
            { title: "The operating procedures protect the boundaries", body: "You begin translating the boundary into the communication practices, assignments, workflows, and procedures that help it hold." },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-3 rounded-2xl bg-[#EEF3E8] p-6">
              <h3 className={`font-playfair text-xl font-bold ${INK}`}>{item.title}</h3>
              <p className={BODY_SM}>{item.body}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 rounded-3xl bg-[#2E2228] p-8 sm:p-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#C9DDB4]">After your one-week experience</p>
            <h3 className="font-playfair text-2xl font-bold text-[#FFF8F4]">Keep applying what you've begun—or choose continued support.</h3>
            <p className="font-poppins text-base leading-relaxed text-[#F6D6E1]">
              The Work-Life Balance Business Week™ is a complete one-time purchase. You can take what you've learned and continue applying it independently. If you want ongoing access and support as you develop, review, and strengthen your business boundaries, you may choose to upgrade to the monthly membership.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-[#FFF8F4]/15 bg-[#FFF8F4]/5 p-6">
            <h3 className="font-playfair text-xl font-bold text-[#FFF8F4]">If you choose the monthly membership</h3>
            <ul className="flex flex-col gap-3">
              {[
                "Continue with Weekly Business Boundary Focus™.",
                "Use Monthly Business Boundary Focus™ to review and develop your operating boundaries.",
                "Continue redesigning business operations so the boundaries can be supported in practice.",
                "Carry your selected Business Week boundary forward. It remains active; upgrading does not reset or replace it.",
              ].map((item) => (
                <li key={item} className="font-poppins flex gap-3 text-base leading-relaxed text-[#F6D6E1]">
                  <Dot className="mt-2 bg-[#C9DDB4]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <h3 className={`font-playfair text-2xl font-bold ${INK}`}>Ready to experience a different way to operate your business?</h3>
          <p className={`max-w-3xl ${BODY}`}>
            Begin with the Work-Life Balance Reality Check™. Then bring your completed Boundary Report™ into the one-week Work-Life Balance Business Week™ and start putting your priorities into practice.
          </p>
          <OfferCta label="Join the Work-Life Balance Business Week™" variant="secondary" />
          <p className={BODY_XS}>One-week intensive · One-time purchase · Monthly membership is optional</p>
        </div>
      </div>
    </section>
  )
}

export function NewYearSection() {
  const outcomes = [
    "Greater clarity about what needs to change.",
    "Boundaries you've identified and want to protect.",
    "A different way of working already in practice.",
    "Adjustments underway in your actual business.",
    "A support structure to help you continue.",
  ]
  const come = [
    "You started your business for freedom and want to feel it.",
    "You're adopting AI and want to decide what to do with the time it gives back.",
    "You want a practice, not another productivity system.",
  ]
  const skip = [
    "You want to automate more hustle.",
    "You want a quick fix or a guaranteed result.",
    "You aren't ready to look honestly at your current week.",
  ]
  return (
    <section className="bg-[#FFFDFB] py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-5">
          <img
            src="/images/holiday/winter-stroll.webp"
            alt="A smiling woman strolling a snowy, festive street with coffee and winter flowers"
            className="w-full rounded-3xl object-cover shadow-xl lg:col-span-2"
            loading="lazy"
          />
          <div className="flex flex-col gap-5 lg:col-span-3">
            <p className={EYEBROW}>Before January arrives</p>
            <h2 className={H2}>Don&apos;t Wait for the New Year to Start Creating &amp; Celebrating the Life You Want.</h2>
            <p className={BODY}>
              AI is creating new possibilities. The world is changing. And uncertainty about what comes next can make it
              tempting to wait until January to make a change. But you don&apos;t have to wait.
            </p>
            <p className={BODY}>
              This holiday season, begin with the FREE Weekly Work-Life Balance Reality Check™ and start redesigning the
              way you work, lead, and operate your business, so you can build sustainable success in the AI age and make
              room for more of the life you started your business to create. By the New Year you can have:
            </p>
            <ul className="flex flex-col gap-2">
              {outcomes.map((o) => (
                <li key={o} className={`${BODY} flex gap-3`}>
                  <Dot />
                  {o}
                </li>
              ))}
            </ul>
            <CtaLink />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-3xl bg-[#EEF3E8] p-8">
            <h3 className={`font-playfair text-2xl font-bold ${INK}`}>Come if…</h3>
            <ul className="flex flex-col gap-3">
              {come.map((c) => (
                <li key={c} className={`${BODY_SM}`}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl bg-[#FCEEF2] p-8">
            <h3 className={`font-playfair text-2xl font-bold ${INK}`}>Skip it if…</h3>
            <ul className="flex flex-col gap-3">
              {skip.map((s) => (
                <li key={s} className={`${BODY_SM}`}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

const BARBARA_ROLES = [
  "Architect, Harmony Lane™",
  "Founder, Startup & Thrive, LLC",
  "Creator, Make Time For More™",
  "Guide of The Work-Life Balance Business Day™ and Business Week™",
  "International Bestselling Co-Author, The Voyage to Your Vision",
  "Former Owner, Philadelphia Speakers Bureau",
]

export function AboutBarbaraSection() {
  return (
    <section id="about" className="scroll-mt-20 bg-[#FFF8F4] py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <img
          src="/images/barbara-portrait.png"
          alt="Barbara Bamba, founder of Make Time For More, in front of a cherry blossom window"
          className="w-full max-w-md rounded-3xl object-cover shadow-xl"
          loading="lazy"
        />
        <div className="flex flex-col gap-5">
          <p className={EYEBROW}>Your guide</p>
          <h2 className={H2}>Thought Leader Barbara Bamba</h2>
          <p className={BODY}>
            Barbara helps founders redefine success beyond constant work, reconnect with their original entrepreneurial
            intentions, and build work-life balance boundaries into the way they start, grow, and operate their
            businesses, whether they&apos;re just beginning or already established.
          </p>
          <p className={`font-playfair text-lg font-semibold leading-snug ${INK}`}>
            Her Human Sustainability™ work asks: how do we make sure the businesses we&apos;re building, and the
            technologies we&apos;re adopting, create more room for human life rather than simply more work?
          </p>
          <ul className="grid gap-2 border-t border-[#F2E4E8] pt-5 sm:grid-cols-2">
            {BARBARA_ROLES.map((r) => (
              <li key={r} className={`${BODY} flex gap-3 text-base`}>
                <Dot />
                {r}
              </li>
            ))}
          </ul>
          <p className="font-poppins text-base font-semibold text-[#5A7F46]">
            On Monday, Barbara isn&apos;t just teaching the concept. She&apos;s guiding you through the experience.
          </p>
        </div>
      </div>
    </section>
  )
}

const FAQS = [
  {
    q: "What happens during the free Reality Check?",
    a: "It's a live online session where you look honestly at your current week: where business demands interfere with the life you want, which boundaries are being challenged, and where the business depends too heavily on you. You leave with a starting point, not a verdict.",
  },
  {
    q: "What happens during the paid Monday experience?",
    a: "A full, guided Work-Life Balance Business Day™. You identify your boundaries, design your day, do real work during The 4-Hour Focused CEO Workday™, use the Five-Minute Boundary Check-In™, and reflect on what to adjust. The day also includes a morning routine, movement, an extended lunch, a power-down, and Time Freedom™.",
  },
  {
    q: "Is it a workshop or a full-day experience?",
    a: "A full-day experience. You're living the day while you work, not watching a presentation.",
  },
  {
    q: "Do I bring my own business work?",
    a: "Yes. You work on your actual priorities, which is how you see where your boundaries and your business collide.",
  },
  {
    q: "What boundaries will I practice?",
    a: "Time, personal life, breaks, availability, workload, and digital boundaries. You choose the ones that fit your life and business; there's no fixed rulebook.",
  },
  {
    q: "What's the difference between Monday and the Business Week?",
    a: "Monday is a standalone guided day ($997). The Work-Life Balance Business Week™ ($1,997) is the recurring Monday–Thursday practice with coworking, community, and accountability. Your Monday fee is credited when you upgrade.",
  },
  {
    q: "What does it cost?",
    a: `The Reality Check is free, with no credit card required. Monday is $997 and the Business Week is $1,997.${isFounderPricingOpen() ? ` Founder pricing is open through ${FOUNDER_PRICING_DEADLINE}, 2026.` : ""}`,
  },
  {
    q: "What support continues afterward?",
    a: "In the Business Week you keep practicing with ongoing coworking, community support, weekly reflection, and accountability, so you can notice patterns and adjust over time.",
  },
  { q: "Do I need AI experience?", a: "No. This is about how you work, not which tools you use." },
  {
    q: "Are you going to sell me something?",
    a: "After the Reality Check, I'll invite you to experience Monday. You're free to say no and keep what you learned.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 bg-[#FFFDFB] py-20 sm:py-28">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-5 sm:px-8">
        <h2 className={H2}>Questions</h2>
        <div className="flex flex-col divide-y divide-[#F2E4E8] rounded-2xl bg-[#FFF8F4] ring-1 ring-[#F2E4E8]">
          {FAQS.map((f) => (
            <details key={f.q} className="group p-6">
              <summary className={`font-playfair flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold ${INK}`}>
                {f.q}
                <span aria-hidden="true" className="font-poppins text-xl text-[#C13B6B] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className={`${BODY} mt-3 text-base`}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function RegisterSection({ sessionLabel }: { sessionLabel: string }) {
  return (
    <section id="register" className="relative scroll-mt-20 overflow-hidden bg-[#2E2228] py-20 sm:py-28">
      <img src="/images/holiday/togetherness.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p className="font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">Save your free seat</p>
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#FFF8F4] sm:text-5xl">
            Start creating the life you want now, not in January.
          </h2>
          <p className="font-poppins text-lg text-[#F6D6E1]">
            {sessionLabel} · {SESSION_TIME_LABEL} · Live online
          </p>
          <p className="font-poppins text-base text-[#F6D6E1]">Free · No credit card required</p>
          <p className="font-playfair text-xl italic text-[#FFF8F4]">We Don&apos;t Hustle — We Harmonize Work &amp; Life.™</p>
        </div>
        <div className="rounded-3xl bg-[#FFFDFB] p-6 shadow-2xl sm:p-8">
          <RegistrationForm />
        </div>
      </div>
    </section>
  )
}

export function DisclaimerFooter() {
  return (
    <p className="font-poppins mx-auto max-w-3xl px-5 py-8 text-center text-sm leading-relaxed text-[#8A7A82]">
      This is educational. Results vary with your experience, effort, and circumstances, and nothing here promises specific
      business or personal results.
    </p>
  )
}
