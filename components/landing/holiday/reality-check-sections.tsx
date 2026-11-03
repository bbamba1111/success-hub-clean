import { RegistrationForm } from "./registration-form"
import { FOUNDER_PRICING_DEADLINE, SESSION_TIME_LABEL } from "@/lib/reality-check/session"

const INK = "text-[#4A3A42]"
const BODY = "font-poppins text-pretty leading-relaxed text-[#5A4A52]"
const EYEBROW = "font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#5A7F46]"
const H2 = `font-playfair text-balance text-3xl font-bold leading-tight sm:text-4xl ${INK}`

function CtaLink({ label = "Save My Free Seat" }: { label?: string }) {
  return (
    <a
      href="#register"
      className="font-poppins inline-flex w-fit items-center justify-center rounded-full bg-[#C13B6B] px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#FFF8F4] shadow-lg shadow-[#C13B6B]/25 transition-colors hover:bg-[#A8305B]"
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
          <p className={EYEBROW}>Why this matters now</p>
          <h2 className={H2}>AI is creating capacity. What will you do with the time it gives you back?</h2>
          <p className={BODY}>
            You started your business for freedom. But somewhere along the way, the business may have become another
            place where you work harder, carry more responsibility, and struggle to make room for the life you intended
            to create.
          </p>
          <p className={BODY}>Now AI is changing what one person or a small team can accomplish.</p>
          <p className={BODY}>
            AI doesn&apos;t automatically create freedom. It creates capacity, and you decide what that capacity is for.
            Technology should serve people, not the other way around.
          </p>
          <p className={`font-playfair text-xl italic leading-snug ${INK}`}>
            Before you use it to do more, consider this: have you redesigned the way your business operates to support
            the freedom you wanted in the first place?
          </p>
        </div>
        <img
          src="/images/holiday/digital-detox-sign.png"
          alt="A holiday signboard reading: We are closed and unplugged, digital detox in session, business hours 9 AM to 5 PM and 10 PM to 11 PM. We don't hustle, we harmonize."
          className="w-full rounded-3xl object-cover shadow-xl"
          loading="lazy"
        />
      </div>
    </section>
  )
}

export function RealityCheckSection({ sessionLabel }: { sessionLabel: string }) {
  const outcomes = [
    "Where business demands may be interfering with the life you want.",
    "Which boundaries are being challenged or overlooked.",
    "Where the business may depend too heavily on you.",
    "What deserves a closer look.",
    "Where you might begin making changes.",
  ]
  const path = [
    { title: "Sunday Reality Check™", tag: "Free", body: "See your current reality and where to begin." },
    { title: "Monday Business Day™", tag: "$997", body: "Live a full guided Work-Life Balance Business Day™ with your real work." },
    { title: "Work-Life Balance Business Week™", tag: "$1,997", body: "Keep practicing Monday to Thursday, with community support." },
  ]
  return (
    <section id="reality-check" className="relative scroll-mt-20 overflow-hidden bg-[#2E2228] py-20 sm:py-28">
      <img src="/images/holiday/kwanzaa-rest.png" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-25" loading="lazy" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">
            {sessionLabel} · Free · Live online
          </p>
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#FFF8F4] sm:text-4xl">
            Start with the free Weekly Work-Life Balance Reality Check™
          </h2>
          <p className="font-poppins text-pretty leading-relaxed text-[#F6D6E1]">
            Before you redesign your week, see the one you have. You&apos;ll walk away understanding:
          </p>
          <ul className="flex flex-col gap-3">
            {outcomes.map((o) => (
              <li key={o} className="font-poppins flex gap-3 leading-relaxed text-[#FFF8F4]">
                <Dot className="bg-[#F6A9C2]" />
                {o}
              </li>
            ))}
          </ul>
          <p className="font-poppins text-sm italic leading-relaxed text-[#F6D6E1]">
            Your results are a starting point for reflection, not a judgment of you or your business.
          </p>
          <CtaLink />
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">How the path works</p>
          <ol className="flex flex-col gap-4">
            {path.map((p, i) => (
              <li key={p.title} className="flex gap-4 rounded-2xl border border-[#FFF8F4]/15 bg-[#2E2228]/60 p-5 backdrop-blur-sm">
                <span className="font-playfair text-3xl font-bold text-[#F6A9C2]">{i + 1}</span>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-playfair text-lg font-bold text-[#FFF8F4]">{p.title}</h3>
                    <span className="font-poppins text-xs font-semibold uppercase tracking-[0.16em] text-[#C9DDB4]">{p.tag}</span>
                  </div>
                  <p className="font-poppins text-sm leading-relaxed text-[#F6D6E1]">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="font-poppins text-sm leading-relaxed text-[#F6D6E1]">
            The Reality Check is free and stands on its own. Monday is a separate, paid experience.
          </p>
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
  return (
    <section id="monday" className="scroll-mt-20 bg-[#FFFDFB] py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-5 sm:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className={EYEBROW}>Your first experience · Monday</p>
            <h2 className={H2}>Live work-life balance. Don&apos;t just learn about it.</h2>
            <p className={BODY}>
              Make Time For More on Mondays™ is a full, guided Work-Life Balance Business Day™, not a workshop, a
              presentation, or a four-hour coworking session.
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
          <h3 className="font-poppins text-sm font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            The boundaries you&apos;ll practice
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BOUNDARY_AREAS.map((b) => (
              <li key={b.title} className="flex flex-col gap-2 rounded-2xl bg-[#FFF8F4] p-6 ring-1 ring-[#F2E4E8]">
                <h4 className={`font-playfair text-xl font-bold ${INK}`}>{b.title} boundaries</h4>
                <p className={`${BODY} text-sm`}>{b.body}</p>
              </li>
            ))}
          </ul>
          <p className={`${BODY} max-w-3xl text-sm italic`}>
            These are areas to explore, not a rigid rulebook. You choose the boundaries that reflect your life, values,
            responsibilities, and business.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="flex flex-col gap-5 lg:col-span-3">
            <h3 className="font-poppins text-sm font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
              What happens during the day
            </h3>
            <ol className="flex flex-col divide-y divide-[#F2E4E8] border-y border-[#F2E4E8]">
              {MONDAY_SEQUENCE.map((s, i) => (
                <li key={s.title} className="flex gap-5 py-5">
                  <span className="font-playfair w-6 shrink-0 text-2xl font-bold text-[#C13B6B]">{i + 1}</span>
                  <div className="flex flex-col gap-1">
                    <h4 className={`font-playfair text-lg font-bold ${INK}`}>{s.title}</h4>
                    <p className={`${BODY} text-sm`}>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-3">
              <p className="font-poppins text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">The full day includes</p>
              <ul className="flex flex-wrap gap-2">
                {DAY_RHYTHM.map((r) => (
                  <li key={r} className="font-poppins rounded-full bg-[#EEF3E8] px-3 py-1.5 text-xs font-medium text-[#4A3A42]">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="flex flex-col gap-5 rounded-3xl bg-[#2E2228] p-7 lg:col-span-2">
            <p className="font-poppins text-xs font-semibold uppercase tracking-[0.2em] text-[#C9DDB4]">
              The Five-Minute Work-Life Boundary Check-In™
            </p>
            <ul className="flex flex-col gap-4">
              {CHECK_IN.map((c) => (
                <li key={c.word} className="flex flex-col gap-1">
                  <span className="font-playfair text-xl font-bold text-[#F6A9C2]">{c.word}</span>
                  <span className="font-poppins text-sm leading-relaxed text-[#FFF8F4]">{c.body}</span>
                </li>
              ))}
            </ul>
            <p className="font-poppins text-sm leading-relaxed text-[#F6D6E1]">
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
          <div className="flex shrink-0 flex-col gap-1">
            <p className={`font-playfair text-4xl font-bold ${INK}`}>$997</p>
            <p className="font-poppins text-sm text-[#5A4A52]">Full guided day · live with Barbara</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function BusinessWeekSection() {
  const noWait = [
    "Your business is fully built.",
    "You reach a particular revenue milestone.",
    "Every business problem is solved.",
  ]
  const continues = [
    "A Monday–Thursday workweek, with the rest reclaimed as Time Freedom™.",
    "Ongoing coworking and community support.",
    "Reflection and accountability each week.",
    "Continued practice of your personal and business boundaries.",
    "Room to recognize patterns and adjust over time.",
  ]
  return (
    <section id="business-week" className="scroll-mt-20 bg-[#FFF8F4] py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <img
          src="/images/holiday/team-celebration.png"
          alt="A team in holiday sweaters sharing a high five around a festive table"
          className="w-full rounded-3xl object-cover shadow-xl"
          loading="lazy"
        />
        <div className="flex flex-col gap-5">
          <p className={EYEBROW}>How the practice continues</p>
          <h2 className={H2}>The Work-Life Balance Business Week™</h2>
          <p className={BODY}>
            A recurring destination where founders experience work-life balance in real time while working on their
            actual businesses. It helps you notice where work and life collide, recognize what needs attention, and keep
            practicing a different operating rhythm.
          </p>
          <div className="flex flex-col gap-2">
            <p className={`font-poppins text-sm font-semibold ${INK}`}>You don&apos;t need to wait until:</p>
            <ul className="flex flex-col gap-1.5">
              {noWait.map((n) => (
                <li key={n} className={`${BODY} flex gap-3 text-sm`}>
                  <Dot />
                  {n}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <p className={`font-poppins text-sm font-semibold ${INK}`}>What continues after Monday:</p>
            <ul className="flex flex-col gap-1.5">
              {continues.map((c) => (
                <li key={c} className={`${BODY} flex gap-3 text-sm`}>
                  <Dot className="bg-[#5A7F46]" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-1 border-t border-[#F2E4E8] pt-5">
            <p className={`font-playfair text-3xl font-bold ${INK}`}>
              $1,997 <span className="font-poppins text-sm font-medium text-[#5A4A52]">· your $997 Monday is credited when you upgrade</span>
            </p>
            <p className="font-poppins text-sm font-semibold text-[#5A7F46]">
              Founder pricing is open through {FOUNDER_PRICING_DEADLINE}, 2026.
            </p>
          </div>
          <p className={`${BODY} text-xs`}>
            Community support helps you keep practicing. It doesn&apos;t replace your own business decisions and
            leadership.
          </p>
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
            src="/images/holiday/winter-stroll.png"
            alt="A smiling woman strolling a snowy, festive street with coffee and winter flowers"
            className="w-full rounded-3xl object-cover shadow-xl lg:col-span-2"
            loading="lazy"
          />
          <div className="flex flex-col gap-5 lg:col-span-3">
            <p className={EYEBROW}>Before January arrives</p>
            <h2 className={H2}>Don&apos;t enter January with another resolution. Enter with a practice already underway.</h2>
            <p className={BODY}>
              Resolutions tend to fade without support or accountability. Begin now, and by the New Year you can have:
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
                <li key={c} className={`${BODY} text-sm`}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl bg-[#FCEEF2] p-8">
            <h3 className={`font-playfair text-2xl font-bold ${INK}`}>Skip it if…</h3>
            <ul className="flex flex-col gap-3">
              {skip.map((s) => (
                <li key={s} className={`${BODY} text-sm`}>{s}</li>
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
              <li key={r} className={`${BODY} flex gap-3 text-sm`}>
                <Dot />
                {r}
              </li>
            ))}
          </ul>
          <p className="font-poppins text-sm font-semibold text-[#5A7F46]">
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
    a: `The Reality Check is free, with no credit card required. Monday is $997 and the Business Week is $1,997. Founder pricing is open through ${FOUNDER_PRICING_DEADLINE}, 2026.`,
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
              <p className={`${BODY} mt-3 text-sm`}>{f.a}</p>
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
      <img src="/images/holiday/togetherness.png" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">Save your free seat</p>
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#FFF8F4] sm:text-5xl">
            Start creating the life you want now, not in January.
          </h2>
          <p className="font-poppins text-lg text-[#F6D6E1]">
            {sessionLabel} · {SESSION_TIME_LABEL} · Live online
          </p>
          <p className="font-poppins text-sm text-[#F6D6E1]">Free · No credit card required</p>
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
    <p className="font-poppins mx-auto max-w-3xl px-5 py-8 text-center text-xs leading-relaxed text-[#8A7A82]">
      This is educational. Results vary with your experience, effort, and circumstances, and nothing here promises specific
      business or personal results.
    </p>
  )
}
