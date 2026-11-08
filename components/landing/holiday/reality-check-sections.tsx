
const INK = "text-[#4A3A42]"
const BODY_BASE = "font-poppins text-pretty leading-relaxed text-[#5A4A52]"
const BODY = `${BODY_BASE} text-[17px] sm:text-lg`
const BODY_SM = `${BODY_BASE} text-base`
const EYEBROW = "font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#5A7F46]"
const H2 = `font-playfair text-balance text-3xl font-bold leading-tight sm:text-5xl ${INK}`

function CtaLink({ label = "Join the Free Sunday Reality Check" }: { label?: string }) {
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
    "A clearer picture of your original entrepreneurial intention and current business reality.",
    "Where business demands collide with the personal life and workweek you want.",
    "Your 30-Day Work-Life Balance Baseline™ across 15 Core Life Value Areas™.",
    "The priority focus areas and business boundary collisions that deserve attention.",
  ]
  const steps = [
    "Complete your Founder Profile™.",
    "Answer the 10 questions in Business Context™.",
    "Identify relevant conditions in Business Boundary Collisions™.",
    "Describe your Personal & Work-From-Home Reality™.",
    "Complete the 15-question 30-Day Work-Life Balance Audit™.",
    "Answer the 3 Work-Life Balance Alignment™ questions.",
    "Review your results and priority focus areas. You may choose to explore a personalized Boundary Report™.",
  ]
  return (
    <section id="reality-check" className="relative scroll-mt-20 overflow-hidden bg-[#2E2228] py-20 sm:py-28">
      <img src="/images/holiday/kwanzaa-rest.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-25" loading="lazy" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <p className="font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">Your free Sunday starting point</p>
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#FFF8F4] sm:text-4xl">
            Free Sunday Work-Life Balance Reality Check™
          </h2>
          <div className="flex items-end gap-3">
            <span className="font-playfair text-5xl font-bold text-[#FFF8F4]">FREE</span>
            <span className="font-poppins pb-1 text-sm text-[#F6D6E1]">guided Sunday experience</span>
          </div>
          <p className="font-poppins text-pretty leading-relaxed text-[#F6D6E1]">
            Start your week with clarity. This guided experience helps you examine why you started your business, what your business asks of you today, and whether the way you work supports the life you want to live.
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
            Your Reality Check, assessment results, and priority focus areas are free. After reviewing your results, you can decide whether you want a deeper personalized Boundary Report™ or to continue into a paid Harmony Lane™ experience. There is no obligation to purchase.
          </p>
          <CtaLink label="Join the Free Sunday Reality Check" />
          <p className="font-poppins text-sm text-[#F6D6E1]">One Sunday can help you see what needs attention before you redesign the way you work.</p>
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
            The Alignment questions help clarify your willingness and readiness. They do not determine whether you receive your free results.
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
            <p className={EYEBROW}>Harmony Lane Experience One · Make Time For More on Mondays™</p>
            <h2 className={H2}>The Work-Life Balance Business Day™</h2>
            <p className={BODY}>
              A distinct, paid guided experience—not simply a preview or a free kickoff. Redesign your entry into the workweek, reconnect with your entrepreneurial intention, establish the boundaries you want to protect, and practice a more intentional business day.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className={`font-playfair text-2xl font-bold ${INK}`}>Bring your real work. Practice a different way to work.</h3>
            <p className={BODY}>
              You are not stepping away from your business to learn about work-life balance. You bring real priorities into a guided day and practice working within the boundaries you choose.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <h3 className="font-poppins text-base font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">The boundaries you will personalize</h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BOUNDARY_AREAS.map((b) => (
              <li key={b.title} className="flex flex-col gap-2 rounded-2xl bg-[#FFF8F4] p-6 ring-1 ring-[#F2E4E8]">
                <h4 className={`font-playfair text-xl font-bold ${INK}`}>{b.title} boundaries</h4>
                <p className={BODY_SM}>{b.body}</p>
              </li>
            ))}
          </ul>
          <p className="max-w-3xl italic text-base text-[#5A4A52]">
            Your boundaries reflect your life, values, responsibilities, and business. This is a guided practice—not a one-size-fits-all rulebook.
          </p>
        </div>
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="flex flex-col gap-5 lg:col-span-3">
            <h3 className="font-poppins text-base font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">Your Business Day experience</h3>
            <ol className="flex flex-col divide-y divide-[#F2E4E8] border-y border-[#F2E4E8]">
              {[
                { title: "Reconnect with intention", body: "Remember why you became an entrepreneur and what you wanted your business to make possible." },
                { title: "Review your current reality", body: "Notice where the way you work supports—or competes with—the life you want." },
                { title: "Personalize your boundaries", body: "Choose the non-negotiables and work-life balance boundaries you want to practice." },
                { title: "Decide & Design My Business Day™", body: "Set meaningful priorities and plan your actual business work inside your chosen boundaries." },
                { title: "Practice and reflect", body: "Work on real priorities, use Five-Minute Work-Life Balance Boundary Check-ins™, and close the day intentionally." },
              ].map((s, i) => (
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
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#C9DDB4]">Five-Minute Work-Life Balance Boundary Check-in™</p>
            <p className="font-playfair text-xl font-bold text-[#F6A9C2]">Notice · Identify · Consider</p>
            <p className="font-poppins text-base leading-relaxed text-[#FFF8F4]">Where is work colliding with the boundaries you want to protect? What is creating that collision? What could change?</p>
            <p className="font-poppins text-base leading-relaxed text-[#F6D6E1]">A practical reflection and decision tool—not a score or a judgment. You decide what to change first and what can wait.</p>
          </aside>
        </div>
      </div>
    </section>
  )
}

export function BusinessWeekSection() {
  const days = [
    { day: "Monday", title: "Redesign your entry", body: "Experience the Work-Life Balance Business Day™: reconnect with intention, personalize boundaries, set priorities, and practice your redesigned business day." },
    { day: "Tuesday & Wednesday", title: "Practice your rhythm", body: "Bring real business priorities into your focused work container. Practice your boundaries and notice where the business pushes against them." },
    { day: "Thursday", title: "Close your workweek", body: "Complete your scheduled work, close out priorities, and make an intentional transition away from business." },
    { day: "Friday–Sunday", title: "Experience Time Freedom™", body: "Make room for relationships, rest, recreation, and personal priorities. Time off is not another productivity project." },
  ]
  const boundaries = [
    "Flex Time™", "Morning GIV•EN™ Routine", "Workout & Movement Window™", "Extended Healthy Hybrid Lunch Break™",
    "4-Hour Focused CEO Workday™", "Time Freedom™", "Power Down™", "Unplug™",
  ]
  return (
    <section id="business-week" className="scroll-mt-20 bg-[#FFF8F4] py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <img src="/images/holiday/team-celebration.webp" alt="A team celebrating together around a festive table" className="w-full rounded-3xl object-cover shadow-xl" loading="lazy" />
          <div className="flex flex-col gap-5">
            <p className={EYEBROW}>Harmony Lane Experience Two · The Full-Week Experience</p>
            <h2 className={H2}>The Work-Life Balance Business Week™</h2>
            <p className={BODY}>A complete seven-day guided experience for founders who want to practice work-life balance while doing their actual business work—not by stepping away from the business, but by redesigning how they enter, operate, and close their workweek.</p>
            <p className={BODY}>The Business Week includes the Work-Life Balance Business Day™ on Monday. The Business Day is also available as a distinct, standalone paid experience.</p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {days.map((item) => (
            <article key={item.day} className="rounded-2xl bg-white p-6 ring-1 ring-[#F2E4E8]">
              <p className={EYEBROW}>{item.day}</p>
              <h3 className={`font-playfair mt-2 text-xl font-bold ${INK}`}>{item.title}</h3>
              <p className={`mt-2 ${BODY_SM}`}>{item.body}</p>
            </article>
          ))}
        </div>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className={`font-playfair text-2xl font-bold ${INK}`}>Eight Non-Negotiable Human Work-Life Balance Time & Space Boundaries™</h3>
            <p className={BODY_SM}>These provide a practical structure. Each founder personalizes them around their intentions, priorities, responsibilities, and business needs.</p>
            <ol className="grid gap-3 sm:grid-cols-2">
              {boundaries.map((item, i) => (
                <li key={item} className="flex gap-3 rounded-xl bg-white p-4 ring-1 ring-[#F2E4E8]">
                  <span className="font-playfair text-xl font-bold text-[#C13B6B]">{i + 1}</span>
                  <span className="font-poppins text-sm font-semibold text-[#4A3A42]">{item}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col justify-center gap-5 rounded-3xl bg-[#2E2228] p-8">
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#C9DDB4]">The two Harmony Lane experiences</p>
            <div>
              <h3 className="font-playfair text-2xl font-bold text-[#FFF8F4]">1. Work-Life Balance Business Day™</h3>
              <p className="mt-2 font-poppins text-base leading-relaxed text-[#F6D6E1]">A standalone paid guided day to redesign your entry into the workweek and practice your chosen boundaries.</p>
            </div>
            <div className="border-t border-white/15 pt-5">
              <h3 className="font-playfair text-2xl font-bold text-[#FFF8F4]">2. Work-Life Balance Business Week™</h3>
              <p className="mt-2 font-poppins text-base leading-relaxed text-[#F6D6E1]">The full seven-day paid experience, including the Business Day, practice across the workweek, and intentional Time Freedom™.</p>
            </div>
            <p className="font-poppins text-sm leading-relaxed text-[#F6D6E1]">Experience details and enrollment information will be provided when registration opens.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function NewYearSection() {
  const outcomes = [
    "Greater clarity about what needs to change.",
    "Boundaries you have identified and want to protect.",
    "A different way of working already in practice.",
    "Priority areas to address in your actual business.",
  ]
  const come = [
    "You started your business for freedom and want to experience more of it.",
    "You are adopting AI and want to decide what to do with the capacity it creates.",
    "You want to practice a more sustainable way to work—not add another productivity system.",
  ]
  const skip = [
    "You want to automate more hustle without reconsidering how work is designed.",
    "You expect a quick fix or guaranteed business result.",
    "You are not ready to look honestly at your current workweek.",
  ]
  return (
    <section className="bg-[#FFFDFB] py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-5">
          <img src="/images/holiday/winter-stroll.webp" alt="A smiling woman strolling a festive winter street" className="w-full rounded-3xl object-cover shadow-xl lg:col-span-2" loading="lazy" />
          <div className="flex flex-col gap-5 lg:col-span-3">
            <p className={EYEBROW}>Start before the calendar changes</p>
            <h2 className={H2}>Don’t wait for a new year to make room for more life.</h2>
            <p className={BODY}>AI is creating new possibilities. But more capacity does not have to become more work. Begin with the free Sunday Work-Life Balance Reality Check™ and get clear about the business you have, the life you want, and the boundaries that need attention.</p>
            <ul className="flex flex-col gap-2">
              {outcomes.map((o) => <li key={o} className={`${BODY} flex gap-3`}><Dot />{o}</li>)}
            </ul>
            <CtaLink label="Join the Free Sunday Reality Check" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-3xl bg-[#EEF3E8] p-8">
            <h3 className={`font-playfair text-2xl font-bold ${INK}`}>Come if…</h3>
            <ul className="flex flex-col gap-3">{come.map((c) => <li key={c} className={BODY_SM}>{c}</li>)}</ul>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl bg-[#FCEEF2] p-8">
            <h3 className={`font-playfair text-2xl font-bold ${INK}`}>This may not be for you if…</h3>
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
  { q: "Is the Sunday Work-Life Balance Reality Check™ free?", a: "Yes. The Sunday Reality Check, assessment results, and priority focus areas are free. You can decide afterward whether you want a deeper personalized Boundary Report™ or a paid Harmony Lane experience." },
  { q: "What does the Reality Check include?", a: "It includes your Founder Profile™, 10-question Business Context™, Business Boundary Collisions™, Personal & Work-From-Home Reality™, 15-question 30-Day Work-Life Balance Audit™, results and priority focus areas, and 3 Work-Life Balance Alignment™ questions." },
  { q: "What is the Work-Life Balance Business Day™?", a: "It is the first distinct, paid Harmony Lane experience: a guided day to reconnect with your entrepreneurial intention, review your current reality, personalize boundaries, design your business day, and practice those boundaries while doing real business work." },
  { q: "What is the Work-Life Balance Business Week™?", a: "It is the second, full seven-day paid Harmony Lane experience. It includes the Business Day on Monday, guided practice during the workweek, a Thursday closeout, and intentional Friday–Sunday Time Freedom™." },
  { q: "Is the Business Day included in the Business Week?", a: "Yes. The Work-Life Balance Business Day™ is included as the Monday experience in the full Work-Life Balance Business Week™. It is also available as its own standalone paid experience." },
  { q: "Do I have to purchase anything after the free Reality Check?", a: "No. You receive your free results and priority focus areas without purchasing a report or either Harmony Lane experience." },
  { q: "Is this an AI readiness certification?", a: "No. The Reality Check is a work-life balance and business operating diagnostic. It helps you understand your current reality and the boundaries that need attention; it is not an AI certification." },
  { q: "Who is Harmony Lane for?", a: "New and established founders who want to build work-life balance into the way they start, grow, and operate their businesses—including founders who want to avoid recreating hustle culture or automating it with AI." },
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
        <p className="font-poppins max-w-2xl text-lg leading-relaxed text-[#F6D6E1]">Join the free Sunday Work-Life Balance Reality Check™. Review your results and priority focus areas, then decide whether the optional $97 personalized Boundary Report™ or either Harmony Lane experience is right for you.</p>
        <p className="font-playfair text-xl italic text-[#FFF8F4]">We Don&apos;t Hustle — We Harmonize.™</p>
        <a href="#reality-check" className="font-poppins inline-flex w-fit items-center justify-center rounded-full bg-[#C13B6B] px-7 py-4 text-base font-semibold uppercase tracking-[0.12em] text-[#FFF8F4] shadow-lg shadow-[#C13B6B]/25 transition-colors hover:bg-[#A8305B]">Join the Free Sunday Reality Check</a>
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
