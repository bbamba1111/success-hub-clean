import { RegistrationForm } from "./registration-form"
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
          <h2 className={H2}>You started your business for freedom. Let&apos;s make room for it again.</h2>
          <p className="font-poppins text-lg font-semibold leading-relaxed text-[#5A7F46]">
            Redesign how you enter the workweek. Set work-life balance boundaries in your business—and start living them in real time.
          </p>
          <p className={BODY}>
            Somewhere along the way, the hustle habits may have followed you into entrepreneurship. The business you
            created for more freedom may now demand more of your time, energy, attention, and availability than you intended.
          </p>
          <p className={BODY}>And now AI is changing how business gets done.</p>
          <p className="font-playfair text-xl font-semibold leading-snug text-[#C13B6B] sm:text-2xl">
            Without intentional boundaries and a redesigned way of operating, AI could simply automate the very hustle you were trying to escape.
          </p>
          <p className={`font-playfair text-xl italic leading-snug sm:text-2xl ${INK}`}>
            Before using new technology to increase what your business can produce, consider a different question:
            have you redesigned your business to make room for the life you wanted it to create?
          </p>
          <p className={BODY}>
            Welcome to Harmony Lane™ — the parallel lane to hustle entrepreneurship and the place you live within
            work-life balance boundaries while redesigning your business weeks.
          </p>
          <p className="font-poppins text-lg font-semibold leading-relaxed text-[#5A7F46]">
            Experience work-life balance in real time. Discover what needs to change. Make time for more life.
          </p>
        </div>
        <img
          src="/images/holiday/digital-detox-sign.webp"
          alt="A holiday signboard celebrating a digital detox and the message: We don't hustle, we harmonize."
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
  const steps = [
    "Welcome and orientation to Harmony Lane™.",
    "Complete your Founder Profile.",
    "Explore your Business Context Profile.",
    "Complete your initial Work-Life Balance Audit, measuring the previous 30 days.",
    "Receive your individual results and recommendations.",
    "Explore the weekly and monthly ways to experience Harmony Lane.",
  ]
  return (
    <section id="reality-check" className="relative scroll-mt-20 overflow-hidden bg-[#2E2228] py-20 sm:py-28">
      <img src="/images/holiday/kwanzaa-rest.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-25" loading="lazy" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <p className="font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">
            Every Sunday · Next: {sessionLabel} · {SESSION_TIME_LABEL} · {SESSION_DURATION_LABEL} · Free
          </p>
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#FFF8F4] sm:text-4xl">
            Start with the FREE Sunday Reality Check™
          </h2>
          <p className="font-poppins text-pretty leading-relaxed text-[#F6D6E1]">
            Before you redesign your workweek, take an honest look at the one you have. During this facilitated group
            experience, you will discover:
          </p>
          <ul className="flex flex-col gap-3">
            {outcomes.map((o) => (
              <li key={o} className="font-poppins flex gap-3 leading-relaxed text-[#FFF8F4]">
                <Dot className="bg-[#F6A9C2]" />
                {o}
              </li>
            ))}
          </ul>
          <p className="font-poppins text-base italic leading-relaxed text-[#F6D6E1]">
            Your results establish your starting point. They are a tool for reflection, not a judgment of you or your business.
          </p>
          <CtaLink />
          <p className="font-poppins text-sm text-[#F6D6E1]">Free · No credit card required</p>
        </div>
        <div className="flex flex-col gap-5 rounded-3xl border border-[#FFF8F4]/15 bg-[#2E2228]/65 p-7 backdrop-blur-sm">
          <p className="font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">
            Your 90-minute Sunday experience
          </p>
          <ol className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="font-playfair text-2xl font-bold text-[#F6A9C2]">{i + 1}</span>
                <p className="font-poppins pt-1 text-base leading-relaxed text-[#FFF8F4]">{step}</p>
              </li>
            ))}
          </ol>
          <p className="font-poppins border-t border-[#FFF8F4]/15 pt-4 text-sm leading-relaxed text-[#F6D6E1]">
            The Sunday event recurs every week. Each person completes the initial Founder Profile, Business Context
            Profile, and 30-day baseline once. Your original results are saved so you do not have to start over.
            Individual answers and results remain private.
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
  { title: "Workload", body: "Recognize when too much rests on you, and decide what to prioritize, delegate, defer, or redesign." },
  { title: "Digital", body: "Establish when to disconnect from business communications and technology." },
]

const MONDAY_SEQUENCE = [
  { title: "Review your previous week", body: "Notice what supported your boundaries, what collided with them, and what needs attention." },
  { title: "Establish your priorities", body: "Decide what matters this week and what your business needs to move forward." },
  { title: "Decide & design", body: "Plan actual business work around the boundaries and non-negotiables you want to protect." },
  { title: "Do your real work", body: "Work on real priorities during The 4-Hour Focused CEO Workday™, practicing the boundaries you set." },
  { title: "Check in and adjust", body: "Use Five-Minute Work-Life Balance Boundary Check-ins™ to capture collisions and recognize patterns." },
]

export function MondaySection() {
  return (
    <section id="monday" className="scroll-mt-20 bg-[#FFFDFB] py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 sm:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className={EYEBROW}>Monday Kickoff · Make Time For More on Mondays™</p>
            <h2 className={H2}>Redesign Your Entry Into the Workweek™</h2>
            <p className={BODY}>
              Monday is the kickoff inside the complete Work-Life Balance Business Week™. It is where you begin
              practicing your boundaries and redesigning how your business week operates.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className={`font-playfair text-2xl font-bold ${INK}`}>Bring your real work. Practice a different way to work.</h3>
            <p className={BODY}>
              You are not stepping away from your business to learn about work-life balance. You are practicing it
              while doing your actual business work and noticing what needs to change.
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
                <p className={BODY_SM}>{b.body}</p>
              </li>
            ))}
          </ul>
          <p className="max-w-3xl italic text-base text-[#5A4A52]">
            These are areas to explore, not a rigid rulebook. You choose the boundaries that reflect your life, values,
            responsibilities, and business.
          </p>
        </div>
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="flex flex-col gap-5 lg:col-span-3">
            <h3 className="font-poppins text-base font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
              Your Monday kickoff
            </h3>
            <ol className="flex flex-col divide-y divide-[#F2E4E8] border-y border-[#F2E4E8]">
              {MONDAY_SEQUENCE.map((s, i) => (
                <li key={s.title} className="flex gap-5 py-5">
                  <span className="font-playfair w-6 shrink-0 text-2xl font-bold text-[#C13B6B]">{i + 1}</span>
                  <div className="flex flex-col gap-1">
                    <h4 className={`font-playfair text-lg font-bold ${INK}`}>{s.title}</h4>
                    <p className={BODY_SM}>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <aside className="flex flex-col gap-5 rounded-3xl bg-[#2E2228] p-7 lg:col-span-2">
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#C9DDB4]">
              Five-Minute Work-Life Balance Boundary Check-in™
            </p>
            <p className="font-playfair text-xl font-bold text-[#F6A9C2]">Notice · Identify · Consider</p>
            <p className="font-poppins text-base leading-relaxed text-[#FFF8F4]">
              Where is work colliding with the boundaries you want to protect? What is creating that collision? What
              could change?
            </p>
            <p className="font-poppins text-base leading-relaxed text-[#F6D6E1]">
              A practical reflection and decision tool—not a score or a judgment. You decide what to change first and
              what can wait.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}

export function BusinessWeekSection() {
  const founderOpen = isFounderPricingOpen()
  return (
    <section id="business-week" className="scroll-mt-20 bg-[#FFF8F4] py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <img
            src="/images/holiday/team-celebration.webp"
            alt="A team celebrating together around a festive table"
            className="w-full rounded-3xl object-cover shadow-xl"
            loading="lazy"
          />
          <div className="flex flex-col gap-5">
            <p className={EYEBROW}>The signature experience inside Harmony Lane™</p>
            <h2 className={H2}>The Work-Life Balance Business Week™</h2>
            <p className={BODY}>
              Live, Work, Lead &amp; Operate Within Your Work-Life Balance Boundaries — In Real Time.
            </p>
            <p className={BODY}>
              This is where the redesign becomes real. Practice your boundaries while doing your actual business work.
              Notice what challenges them, identify what needs to change, and redesign the way your business week works.
            </p>
            <p className={BODY}>
              Monday–Thursday is your four-day workweek. Friday–Sunday is your protected three-day weekend. Your
              four-hour Focused CEO Workday™ runs from 1 PM–5 PM ET, Monday through Thursday.
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Four-day workweek", body: "Monday–Thursday. Practice operating your business within the boundaries you choose." },
            { title: "Four-hour CEO workday", body: "1 PM–5 PM ET, Monday–Thursday. Focus on the business priorities that matter." },
            { title: "Three-day weekend", body: "Friday–Sunday. Practice protecting time outside the business." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-white p-6 ring-1 ring-[#F2E4E8]">
              <h3 className={`font-playfair text-xl font-bold ${INK}`}>{item.title}</h3>
              <p className={`${BODY_SM} mt-2`}>{item.body}</p>
            </div>
          ))}
        </div>
        <p className={BODY_SM}>
          The rhythm creates 16 scheduled CEO work hours per week and 152 hours outside those scheduled business hours.
          The 152 hours are not a promise that every hour is obligation-free; they describe the time outside the
          scheduled CEO workweek.
        </p>
        <div id="offers" className="scroll-mt-24 flex flex-col gap-6">
          <div className="max-w-3xl">
            <p className={EYEBROW}>Choose your Harmony Lane experience</p>
            <h3 className={`font-playfair mt-2 text-3xl font-bold ${INK}`}>One signature experience. Two ways to participate.</h3>
            <p className={BODY_SM}>
              Begin with one complete seven-day experience, or choose four consecutive weeks to practice, evaluate,
              refine, and build sustainable habits.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="flex flex-col gap-4 rounded-3xl bg-white p-8 ring-1 ring-[#F2E4E8]">
              <p className={EYEBROW}>Weekly experience</p>
              <h4 className={`font-playfair text-2xl font-bold ${INK}`}>One complete seven-day Business Week™</h4>
              <p className={BODY_SM}>Regular price <strong>$2,499.25 per week</strong></p>
              <div className="rounded-2xl bg-[#FCEEF2] p-5">
                <p className="font-poppins text-xs font-semibold uppercase tracking-[0.18em] text-[#8A4B61]">Black Friday Founder Rate</p>
                <p className="font-playfair text-4xl font-bold text-[#4A3A42]">$997 <span className="font-poppins text-base font-medium">/ week</span></p>
              </div>
              <p className={BODY_SM}>Experience the rhythm, practice your boundaries, and discover what changes when you operate your business differently.</p>
              <CtaLink label="Start with the Free Sunday Reality Check" />
            </article>
            <article className="flex flex-col gap-4 rounded-3xl bg-[#2E2228] p-8 text-[#FFF8F4]">
              <p className="font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">Monthly habit-building cycle</p>
              <h4 className="font-playfair text-2xl font-bold text-[#FFF8F4]">Four consecutive Business Weeks™</h4>
              <p className="font-poppins text-base text-[#F6D6E1]">Regular price <strong className="text-white">$9,997</strong></p>
              <div className="rounded-2xl bg-[#FFF8F4] p-5">
                <p className="font-poppins text-xs font-semibold uppercase tracking-[0.18em] text-[#8A4B61]">Black Friday Founder Rate</p>
                <p className="font-playfair text-4xl font-bold text-[#4A3A42]">$3,988</p>
                <p className="font-poppins text-sm text-[#5A4A52]">Four consecutive weeks · $997 per week</p>
              </div>
              <p className="font-poppins text-base leading-relaxed text-[#F6D6E1]">
                Continue practicing the rhythm, retaking your seven-day Work-Life Balance Audit each Monday, reviewing
                your priorities, and strengthening the habits that support your boundaries.
              </p>
              <a href="#register" className="font-poppins inline-flex w-fit items-center justify-center rounded-full bg-[#C13B6B] px-7 py-4 text-base font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#A8305B]">
                Start with the Free Sunday Reality Check
              </a>
            </article>
          </div>
          <p className={BODY_SM}>
            The monthly founder rate is four weekly founder-rate payments of $997. There is no additional pay-in-full
            discount. Enroll by December 31, 2026 to secure the applicable Black Friday Founder Rate. Qualifying
            founders are grandfathered at that rate under the published membership-continuity terms. New enrollments
            beginning January 1, 2027 are subject to regular pricing.
          </p>
          {founderOpen && (
            <p className="font-poppins text-sm font-semibold text-[#5A7F46]">
              Black Friday Founder Offer ends December 31, {new Date().getFullYear()}.
            </p>
          )}
          <p className={BODY_SM}>
            Three consecutive regular monthly cycles represent 12 weeks and a combined regular value of $29,991,
            approximately $30,000 over a quarter. At the Black Friday monthly founder rate, three cycles total $11,964.
            This is an illustrative journey, not a separate required quarterly package. Participation remains weekly
            or monthly.
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
            src="/images/holiday/winter-stroll.webp"
            alt="A smiling woman strolling a festive winter street"
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
              This holiday season, begin with the FREE Sunday Reality Check™ and start redesigning the way you work,
              lead, and operate your business, so you can build sustainable success in the AI age and make room for more
              of the life you started your business to create. By the New Year you can have:
            </p>
            <ul className="flex flex-col gap-2">
              {outcomes.map((o) => (
                <li key={o} className={`${BODY} flex gap-3`}><Dot />{o}</li>
              ))}
            </ul>
            <CtaLink />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-3xl bg-[#EEF3E8] p-8">
            <h3 className={`font-playfair text-2xl font-bold ${INK}`}>Come if…</h3>
            <ul className="flex flex-col gap-3">{come.map((c) => <li key={c} className={BODY_SM}>{c}</li>)}</ul>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl bg-[#FCEEF2] p-8">
            <h3 className={`font-playfair text-2xl font-bold ${INK}`}>Skip it if…</h3>
            <ul className="flex flex-col gap-3">{skip.map((s) => <li key={s} className={BODY_SM}>{s}</li>)}</ul>
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
  "Guide of The Work-Life Balance Business Week™",
  "International Bestselling Co-Author, The Voyage to Your Vision",
  "Former Owner, Philadelphia Speakers Bureau",
]

export function AboutBarbaraSection() {
  return (
    <section id="about" className="scroll-mt-20 bg-[#FFF8F4] py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <img
          src="/images/barbara-portrait.png"
          alt="Thought Leader Barbara Bamba, architect of Harmony Lane"
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
            {BARBARA_ROLES.map((r) => <li key={r} className={`${BODY} flex gap-3 text-base`}><Dot />{r}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

const FAQS = [
  {
    q: "What is Harmony Lane™?",
    a: "Harmony Lane is the premium work-life balance destination where founders live within work-life balance boundaries while redesigning their business weeks.",
  },
  {
    q: "What happens during the free Sunday Reality Check™?",
    a: "It's a free, facilitated 90-minute event every Sunday at 3 PM ET. During the event you complete your Founder Profile, Business Context Profile, and initial 30-day Work-Life Balance Audit, then review your individual results and recommendations.",
  },
  {
    q: "Do I complete the initial Reality Check more than once?",
    a: "No. Each person completes the initial Founder Profile, Business Context Profile, and 30-day baseline once. Your original results are saved. The Sunday event recurs every week for new prospects.",
  },
  {
    q: "What is the Work-Life Balance Business Week™?",
    a: "It is the complete seven-day signature experience inside Harmony Lane. You practice your boundaries while redesigning how your business week operates: Monday–Thursday workdays and a protected Friday–Sunday weekend.",
  },
  {
    q: "Is Monday a separate paid offer?",
    a: "No. Monday is the kickoff inside the complete Work-Life Balance Business Week. Make Time For More on Mondays™ is the featured Monday experience, not a separate product.",
  },
  {
    q: "What is the difference between weekly and monthly participation?",
    a: "Weekly participation is one complete seven-day Work-Life Balance Business Week. Monthly participation is four consecutive weeks, with a seven-day Work-Life Balance Audit each Monday to review priorities and strengthen habits.",
  },
  {
    q: "What does it cost?",
    a: "The Sunday Reality Check is free. Regular pricing is $2,499.25 for one week and $9,997 for four consecutive weeks. The Black Friday Founder Rates through December 31, 2026 are $997 per week and $3,988 for the four-week monthly cycle.",
  },
  {
    q: "How long is the Black Friday Founder Offer available?",
    a: "Enroll by December 31, 2026 to secure the applicable founder rate. Qualifying founders are grandfathered under the published membership-continuity terms. New enrollments beginning January 1, 2027 are subject to regular pricing.",
  },
  {
    q: "Do I need AI experience?",
    a: "No. This is about how you live, work, lead, and operate your business. The focus is on setting boundaries before deploying technology so it supports your intended way of working.",
  },
  {
    q: "Are my Reality Check results private?",
    a: "Yes. Your individual answers and results are private. Your initial baseline is saved so you can measure your progress over time.",
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
          <p className="font-poppins text-lg text-[#F6D6E1]">Every Sunday · {sessionLabel} · {SESSION_TIME_LABEL} · Live online</p>
          <p className="font-poppins text-base text-[#F6D6E1]">Free · 90 minutes · No credit card required</p>
          <p className="font-playfair text-xl italic text-[#FFF8F4]">We Don&apos;t Hustle — We Harmonize.™</p>
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
