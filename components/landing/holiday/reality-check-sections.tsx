
const INK = "text-[#4A3A42]"
const BODY_BASE = "font-poppins text-pretty leading-relaxed text-[#5A4A52]"
const BODY = `${BODY_BASE} text-[17px] sm:text-lg`
const BODY_SM = `${BODY_BASE} text-base`
const EYEBROW = "font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#5A7F46]"
const H2 = `font-playfair text-balance text-3xl font-bold leading-tight sm:text-5xl ${INK}`

function CtaLink({ label = "Explore the $197 Reality Check" }: { label?: string }) {
  return (
    <a
      href="#enrollment"
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
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[2fr_1fr]">
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
          src="/images/barbara-portrait.png"
          alt="Thought Leader Barbara Bamba, architect of Harmony Lane"
          className="mx-auto max-h-[780px] w-full rounded-3xl object-contain object-center shadow-xl"
          loading="lazy"
        />
      </div>
    </section>
  )
}

export function RealityCheckSection() {
  const outcomes = [
    "How your original entrepreneurial intention compares with your current business reality.",
    "Where business demands collide with your personal life and desired way of living.",
    "Your 30-Day Work-Life Balance Baseline™ across 15 Core Life Value Areas™.",
    "The priority focus areas and business boundary collisions that deserve attention.",
    "A personalized Work-Life Balance Boundary Report™ with recommendations and practical first steps.",
  ]
  const steps = [
    "Complete your Founder Profile™.",
    "Answer 10 questions in Business Context™.",
    "Identify relevant conditions in Business Boundary Collisions™.",
    "Describe your Personal & Work-From-Home Reality™.",
    "Complete the 15-question 30-Day Work-Life Balance Audit™.",
    "Answer the 3 Work-Life Balance Alignment™ questions.",
    "Receive your results, priority focus areas, and personalized Boundary Report™.",
  ]
  return (
    <section id="reality-check" className="relative scroll-mt-20 overflow-hidden bg-[#2E2228] py-20 sm:py-28">
      <img src="/images/holiday/kwanzaa-rest.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-25" loading="lazy" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <p className="font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">A complete standalone diagnostic experience</p>
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#FFF8F4] sm:text-4xl">
            Work-Life Balance Reality Check™
          </h2>
          <div className="flex items-end gap-3">
            <span className="font-playfair text-5xl font-bold text-[#FFF8F4]">$197</span>
            <span className="font-poppins pb-1 text-sm text-[#F6D6E1]">one-time · $497 stated value</span>
          </div>
          <p className="font-poppins text-pretty leading-relaxed text-[#F6D6E1]">
            You built your business for a reason. Let&apos;s find out if it is still giving you that life. Take an honest look at your original intention, the way your business operates today, and the personal reality you are living.
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
            This is a complete paid experience—not a free event, a certification, or a judgment of you or your business. You keep your completed Reality Check and Boundary Report whether or not you continue into implementation.
          </p>
          <CtaLink label="See the two Harmony Lane offers" />
          <p className="font-poppins text-sm text-[#F6D6E1]">The $197 Reality Check is not charged again when you upgrade to the Business Week.</p>
        </div>
        <div className="flex flex-col gap-5 rounded-3xl border border-[#FFF8F4]/15 bg-[#2E2228]/65 p-7 backdrop-blur-sm">
          <p className="font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">What the Reality Check includes</p>
          <ol className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="font-playfair text-2xl font-bold text-[#F6A9C2]">{i + 1}</span>
                <p className="font-poppins pt-1 text-base leading-relaxed text-[#FFF8F4]">{step}</p>
              </li>
            ))}
          </ol>
          <p className="font-poppins border-t border-[#FFF8F4]/15 pt-4 text-sm leading-relaxed text-[#F6D6E1]">
            Your Alignment answers measure willingness and readiness. They do not determine whether you receive your completed results or Boundary Report™.
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
  const durations = [
    { weeks: 4, price: "$1,988" },
    { weeks: 8, price: "$3,976" },
    { weeks: 12, price: "$5,964" },
  ]
  return (
    <section id="business-week" className="scroll-mt-20 bg-[#FFF8F4] py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <img src="/images/holiday/team-celebration.webp" alt="A team celebrating together around a festive table" className="w-full rounded-3xl object-cover shadow-xl" loading="lazy" />
          <div className="flex flex-col gap-5">
            <p className={EYEBROW}>The implementation experience</p>
            <h2 className={H2}>The Work-Life Balance Business Week™</h2>
            <p className={BODY}>Practice work-life balance boundaries while doing your actual business work—not by stepping away from the business, but by redesigning how it operates.</p>
            <p className={BODY}>The Business Week builds on your Reality Check. You bring your findings into your real workweek, choose a priority boundary, notice what collides with it, and begin translating that boundary into business practices, communication, workflows, and Sustainable Operating Procedures™ where appropriate.</p>
            <p className={BODY}>The operating rhythm is Monday–Thursday, with a 4-Hour Focused CEO Workday™ from 1 PM–5 PM ET, and a protected Friday–Sunday three-day weekend.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Four-day workweek", body: "Monday–Thursday. Practice operating your business within the boundaries you choose." },
            { title: "Four-hour CEO workday", body: "1 PM–5 PM ET, Monday–Thursday. Focus on real business priorities." },
            { title: "Three-day weekend", body: "Friday–Sunday. Practice protecting time outside the business." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-white p-6 ring-1 ring-[#F2E4E8]">
              <h3 className={`font-playfair text-xl font-bold ${INK}`}>{item.title}</h3>
              <p className={`${BODY_SM} mt-2`}>{item.body}</p>
            </div>
          ))}
        </div>
        <p className={BODY_SM}>The rhythm creates 16 scheduled CEO work hours per week. Time outside those scheduled hours is not automatically obligation-free; it is protected through deliberate boundaries and operating design.</p>
        <div id="offers" className="scroll-mt-24 flex flex-col gap-6">
          <div className="max-w-3xl">
            <p className={EYEBROW}>The second step</p>
            <h3 className={`font-playfair mt-2 text-3xl font-bold ${INK}`}>Continue from insight into implementation.</h3>
            <p className={BODY_SM}>Choose the implementation duration that fits the work ahead. The Work-Life Balance Business Day™ is part of this experience—not a separate offer.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {durations.map((item) => (
              <article key={item.weeks} className="flex flex-col gap-4 rounded-3xl bg-white p-8 ring-1 ring-[#F2E4E8]">
                <p className={EYEBROW}>{item.weeks}-week implementation</p>
                <h4 className={`font-playfair text-2xl font-bold ${INK}`}>Work-Life Balance Business Week™</h4>
                <p className="font-playfair text-4xl font-bold text-[#4A3A42]">{item.price}</p>
                <p className={BODY_SM}>497 per week · {item.weeks} consecutive weeks</p>
                <p className={BODY_SM}>Practice your chosen boundaries in your actual business, observe collisions, and begin redesigning the operating practices that need to support them.</p>
                <p className="font-poppins text-sm font-semibold text-[#5A7F46]">Your $197 Reality Check is included—no second charge.</p>
                <a href="#enrollment" className="font-poppins inline-flex w-fit items-center justify-center rounded-full bg-[#C13B6B] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#A8305B]">Enrollment details</a>
              </article>
            ))}
          </div>
          <p className={BODY_SM}>Enrollment checkout links are being connected. Pricing is shown here for clarity; online payment is not yet open from this page.</p>
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
              This holiday season, begin with the $197 Work-Life Balance Reality Check™ and start redesigning the way you work,
              lead, and operate your business, so you can build sustainable success in the AI age and make room for more
              of the life you started your business to create. By the New Year you can have:
            </p>
            <ul className="flex flex-col gap-2">
              {outcomes.map((o) => (
                <li key={o} className={`${BODY} flex gap-3`}><Dot />{o}</li>
              ))}
            </ul>
            <CtaLink label="Explore the $197 Reality Check" />
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
  { q: "What is the Work-Life Balance Reality Check™?", a: "It is a complete standalone diagnostic experience priced at $197 one-time, with a stated value of $497. It includes your Founder Profile™, Business Context™, Business Boundary Collisions™, Personal & Work-From-Home Reality™, 30-Day Work-Life Balance Baseline™, Results & Priority Focus Areas™, and personalized Work-Life Balance Boundary Report™." },
  { q: "Do I keep my Reality Check if I do not continue?", a: "Yes. Your completed Reality Check and Boundary Report™ are yours to keep and use whether or not you purchase the Business Week." },
  { q: "What is the Work-Life Balance Business Week™?", a: "It is the implementation experience where you practice boundaries in your actual business week, observe collisions, and begin translating a chosen boundary into operating practices, communication, workflows, and Sustainable Operating Procedures™ where appropriate." },
  { q: "How much does the Business Week cost?", a: "The current price is $497 per week. Choose 4 weeks for $1,988, 8 weeks for $3,976, or 12 weeks for $5,964." },
  { q: "Is the Reality Check charged again when I upgrade?", a: "No. When a Reality Check buyer upgrades to the Work-Life Balance Business Week™, the Reality Check is included and is not charged a second time." },
  { q: "Is Monday a separate offer?", a: "No. Make Time For More on Mondays™ is part of the Business Week experience. The Work-Life Balance Business Day™ is also part of the week, not a separate standalone offer." },
  { q: "What is the weekly operating rhythm?", a: "The intended rhythm is a Monday–Thursday workweek, a 4-Hour Focused CEO Workday™ from 1 PM–5 PM ET, and a Friday–Sunday three-day weekend. Boundaries and operating practices are used to protect that rhythm." },
  { q: "Is this an AI readiness certification?", a: "No. The Reality Check is a work-life balance and business operating diagnostic. It helps you understand your current reality and the boundaries that need attention; it is not an AI certification." },
  { q: "Are my answers and results private?", a: "Your individual answers and results are private. Your original baseline is retained so you can compare future progress." },
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

export function RegisterSection() {
  return (
    <section id="enrollment" className="relative scroll-mt-20 overflow-hidden bg-[#2E2228] py-20 sm:py-28">
      <img src="/images/holiday/togetherness.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 px-5 text-center sm:px-8">
        <p className="font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">Your next step</p>
        <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#FFF8F4] sm:text-5xl">Start with clarity. Then decide what you want to change.</h2>
        <p className="font-poppins max-w-2xl text-lg leading-relaxed text-[#F6D6E1]">The Work-Life Balance Reality Check™ is $197 one-time. The Work-Life Balance Business Week™ is $497 per week, with 4-, 8-, and 12-week implementation options. Checkout links will be activated after the correct products are verified.</p>
        <p className="font-playfair text-xl italic text-[#FFF8F4]">We Don&apos;t Hustle — We Harmonize.™</p>
        <a href="#reality-check" className="font-poppins inline-flex w-fit items-center justify-center rounded-full bg-[#C13B6B] px-7 py-4 text-base font-semibold uppercase tracking-[0.12em] text-[#FFF8F4] shadow-lg shadow-[#C13B6B]/25 transition-colors hover:bg-[#A8305B]">Review the Reality Check</a>
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
