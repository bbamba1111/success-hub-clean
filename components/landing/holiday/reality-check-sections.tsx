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

export function FreedomSection() {
  return (
    <section className="bg-[#FFF8F4] py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <p className={EYEBROW}>The holiday question</p>
          <h2 className={H2}>You built your business for freedom. Is it giving you any?</h2>
          <p className={BODY}>
            Many founders leave demanding jobs and bring the hustle with them. Work spills into evenings, and this time of
            year, into the moments that matter most. Every decision waits for you. And now that AI can do more, the easy
            move is to fill every hour it saves with more work.
          </p>
          <p className={`font-playfair text-xl italic leading-snug ${INK}`}>
            You may not have a time-management problem. You may have a workweek that needs to be redesigned.
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

const BOUNDARY_STEPS = [
  { title: "Set your non-negotiables", body: "Each boundary comes with rules, so you know exactly what you're protecting." },
  { title: "Live and work around them", body: "Bring your own work and operate inside your boundaries in real time." },
  {
    title: "Notice what collides",
    body: "The Five-Minute Work-Life Boundary Check-In™ at the end of each boundary shows where work ran into it, and why.",
  },
  {
    title: "Decide what changes",
    body: "Change how the business operates to support the boundary, rather than bending the boundary.",
  },
]

export function BoundariesSection() {
  return (
    <section className="bg-[#FFFDFB] py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 sm:px-8">
        <div className="flex max-w-2xl flex-col gap-4">
          <p className={EYEBROW}>How it works</p>
          <h2 className={H2}>Your boundaries stay. Your business changes.</h2>
          <p className={BODY}>
            Each work-life balance boundary is non-negotiable, and each one has its own rules. You live, work, and lead
            around them in real time, and see exactly where your business pushes back.
          </p>
        </div>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BOUNDARY_STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3 rounded-2xl border border-[#F2E4E8] bg-[#FFF8F4] p-6">
              <span className="font-poppins text-xs font-semibold uppercase tracking-[0.2em] text-[#C13B6B]">
                Step {i + 1}
              </span>
              <h3 className={`font-playfair text-xl font-bold ${INK}`}>{step.title}</h3>
              <p className={`${BODY} text-sm`}>{step.body}</p>
            </li>
          ))}
        </ol>
        <p className={`${BODY} max-w-2xl italic`}>
          Some collisions can&apos;t be solved in a day. You decide what to change first and what can wait.
        </p>
      </div>
    </section>
  )
}

export function ExperiencesSection() {
  return (
    <section className="bg-[#FFF8F4] py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 sm:px-8">
        <div className="flex max-w-3xl flex-col gap-4">
          <p className={EYEBROW}>Two experiences. One habit.</p>
          <h2 className={H2}>The Work-Life Balance Destination</h2>
          <p className={BODY}>
            Make Time For More™ is the place you go to live, work, lead, and operate in work-life balance in real time.
            The Work-Life Balance Business Weeks are habit-building weeks, designed to break the hustle habit in your life
            and your business by containing work so life has space to expand.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="flex flex-col overflow-hidden rounded-3xl bg-[#FFFDFB] shadow-sm ring-1 ring-[#F2E4E8]">
            <img src="/images/holiday/garden-meditation.png" alt="A founder meditating beside a snowy cherry blossom garden at sunrise" className="h-56 w-full object-cover" loading="lazy" />
            <div className="flex flex-1 flex-col gap-3 p-7">
              <p className={EYEBROW}>Experience one</p>
              <h3 className={`font-playfair text-2xl font-bold ${INK}`}>Make Time For More on Mondays™</h3>
              <p className="font-poppins text-sm font-semibold text-[#C13B6B]">The full Work-Life Balance Business Day™</p>
              <p className={`${BODY} text-sm`}>
                A complete guided day. You bring your own work, design your day with intention, and learn to contain it
                inside the 4-Hour Focused CEO Workday™, so the rest of the day belongs to your life. You begin from your
                Reality Check results. Time Freedom™ is left entirely to you.
              </p>
              <p className={`font-playfair mt-auto pt-2 text-3xl font-bold ${INK}`}>$997</p>
            </div>
          </article>

          <article className="flex flex-col overflow-hidden rounded-3xl bg-[#FFFDFB] shadow-sm ring-1 ring-[#F2E4E8]">
            <img src="/images/holiday/team-celebration.png" alt="A team in holiday sweaters sharing a high five around a festive table" className="h-56 w-full object-cover" loading="lazy" />
            <div className="flex flex-1 flex-col gap-3 p-7">
              <p className={EYEBROW}>Experience two</p>
              <h3 className={`font-playfair text-2xl font-bold ${INK}`}>The Work-Life Balance Business Week™</h3>
              <p className="font-poppins text-sm font-semibold text-[#C13B6B]">The same day, lived Monday to Thursday</p>
              <p className={`${BODY} text-sm`}>
                The rest of the week is reclaimed as Time Freedom™. Each week you retake the Work-Life Balance Audit and
                choose 1–3 priority focus areas, so every round builds on the last.
              </p>
              <p className={`font-playfair mt-auto pt-2 text-3xl font-bold ${INK}`}>
                $1,997 <span className="font-poppins text-sm font-medium text-[#5A4A52]">· your $997 Monday is credited</span>
              </p>
            </div>
          </article>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl bg-[#EEF3E8] p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className={`${BODY} text-sm`}>
            <span className="font-semibold text-[#4A3A42]">Why they belong together:</span> one day shows you the
            difference. Repeating it is how it becomes a habit.
          </p>
          <p className="font-poppins text-sm font-semibold text-[#5A7F46]">
            Founder pricing is open through {FOUNDER_PRICING_DEADLINE}.
          </p>
        </div>
      </div>
    </section>
  )
}

export function RealityCheckSection() {
  const outcomes = [
    "See where business demands collide with the life you want.",
    "Notice where the business depends too heavily on you.",
    "Leave with a clear starting point for your first Monday.",
  ]
  const path = [
    { title: "Reality Check", body: "See your current reality." },
    { title: "Monday", body: "Live the full Work-Life Balance Business Day™." },
    { title: "The Business Week", body: "Repeat the practice, retake the audit, and choose your 1–3 focus areas." },
  ]
  return (
    <section id="reality-check" className="relative overflow-hidden bg-[#2E2228] py-20 sm:py-28">
      <img src="/images/holiday/kwanzaa-rest.png" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-25" loading="lazy" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">Every Sunday · Free</p>
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#FFF8F4] sm:text-4xl">
            Start with the free Work-Life Balance Reality Check™
          </h2>
          <p className="font-poppins text-pretty leading-relaxed text-[#F6D6E1]">
            Before redesigning your week, see the one you have. In the Reality Check you&apos;ll:
          </p>
          <ul className="flex flex-col gap-3">
            {outcomes.map((o) => (
              <li key={o} className="font-poppins flex gap-3 leading-relaxed text-[#FFF8F4]">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F6A9C2]" />
                {o}
              </li>
            ))}
          </ul>
          <CtaLink />
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">What happens next</p>
          <ol className="flex flex-col gap-4">
            {path.map((p, i) => (
              <li key={p.title} className="flex gap-4 rounded-2xl border border-[#FFF8F4]/15 bg-[#2E2228]/60 p-5 backdrop-blur-sm">
                <span className="font-playfair text-3xl font-bold text-[#F6A9C2]">{i + 1}</span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-playfair text-lg font-bold text-[#FFF8F4]">{p.title}</h3>
                  <p className="font-poppins text-sm leading-relaxed text-[#F6D6E1]">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export function FitSection() {
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
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-3xl bg-[#EEF3E8] p-8">
            <h2 className={`font-playfair text-2xl font-bold ${INK}`}>Come if…</h2>
            <ul className="flex flex-col gap-3">
              {come.map((c) => (
                <li key={c} className={`${BODY} text-sm`}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl bg-[#FCEEF2] p-8">
            <h2 className={`font-playfair text-2xl font-bold ${INK}`}>Skip it if…</h2>
            <ul className="flex flex-col gap-3">
              {skip.map((s) => (
                <li key={s} className={`${BODY} text-sm`}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-5">
          <img
            src="/images/holiday/winter-stroll.png"
            alt="A smiling woman strolling a snowy, festive street with coffee and winter flowers"
            className="w-full rounded-3xl object-cover shadow-xl lg:col-span-3"
            loading="lazy"
          />
          <div className="flex flex-col gap-4 lg:col-span-2">
            <h2 className={`font-playfair text-balance text-2xl font-bold leading-snug sm:text-3xl ${INK}`}>
              If AI frees up your time, will every saved hour become more work?
            </h2>
            <p className={BODY}>
              Or will some of it protect the life you built the business to support? That&apos;s an operating decision,
              and it&apos;s one to make before you accelerate.
            </p>
            <p className="font-poppins text-sm font-semibold text-[#5A7F46]">Barbara, founder of Make Time For More™</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const FAQS = [
  {
    q: "Are you going to sell me something?",
    a: "After the Reality Check, I'll invite you to experience Monday. You're free to say no and keep what you learned.",
  },
  { q: "Do I need AI experience?", a: "No. This is about how you work, not which tools you use." },
  {
    q: "What does it cost?",
    a: `The Reality Check is free. Monday is $997 and the Business Week is $1,997, with your Monday credited. Founder pricing is open through ${FOUNDER_PRICING_DEADLINE}.`,
  },
  { q: "How often does it run?", a: "Every Sunday, live online. If this week doesn't work, join us next Sunday." },
]

export function FaqSection() {
  return (
    <section id="faq" className="bg-[#FFF8F4] py-20 sm:py-28">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-5 sm:px-8">
        <h2 className={H2}>Questions</h2>
        <div className="flex flex-col divide-y divide-[#F2E4E8] rounded-2xl bg-[#FFFDFB] ring-1 ring-[#F2E4E8]">
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
    <section id="register" className="relative overflow-hidden bg-[#2E2228] py-20 sm:py-28">
      <img src="/images/holiday/togetherness.png" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">Save your free seat</p>
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#FFF8F4] sm:text-5xl">
            Make time for more this holiday season.
          </h2>
          <p className="font-poppins text-lg text-[#F6D6E1]">
            {sessionLabel} · {SESSION_TIME_LABEL} · Live online
          </p>
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
