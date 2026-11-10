
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

export function WeMakeTimeForMoreSection() {
  const model = [
    { value: "4 Day", title: "Workweek", detail: "Monday–Thursday" },
    { value: "4 Hour", title: "Focused CEO Workday", detail: "Dedicated time for priority business work" },
    { value: "5 Hours", title: "Time Freedom", detail: "After 5:00 PM" },
    { value: "3 Day", title: "Weekend", detail: "Friday–Sunday" },
  ]

  return (
    <>
      <section id="destination" className="scroll-mt-20 bg-[#F7DCE5] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
          <div className="mx-auto mb-10 max-w-5xl">
            <p className="mb-3 font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#5A7F46] sm:text-base">We Make Time For More</p>
            <h2 className="font-playfair text-balance text-4xl font-bold leading-tight text-[#4A3A42] sm:text-6xl lg:text-7xl">The Work-Life Balance Business Week™</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {model.map((item) => (
              <article key={item.title} className="flex min-h-44 flex-col items-center justify-center rounded-2xl bg-white px-5 py-7 text-center shadow-sm">
                <p className="font-playfair text-4xl font-bold text-[#C13B6B] sm:text-5xl">{item.value}</p>
                <h3 className="mt-2 font-poppins text-base font-bold text-[#4A3A42]">{item.title}</h3>
                <p className="mt-1 font-poppins text-sm leading-relaxed text-[#5A4A52]">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="business-day" className="scroll-mt-20 bg-[#FFF8F4] py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col gap-12 px-5 sm:px-8">
          <header className="mx-auto max-w-4xl text-center">
            <h2 className="whitespace-nowrap font-playfair text-3xl font-bold leading-tight text-[#4A3A42] sm:text-6xl">Make Time For More On Monday</h2>
            <p className="mt-3 font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#5A7F46] sm:text-base">Redesign Your Entry Into The Workweek</p>
          </header>
          <div className="flex flex-col gap-5">
            <h3 className="font-playfair text-balance text-2xl font-bold leading-tight text-[#4A3A42] sm:text-3xl">Why Harmony Lane — The Parallel Lane to Hustle Entrepreneurship — Redesigned Monday</h3>
            <p className={BODY}>The traditional workweek often begins before Monday morning.</p>
            <p className={BODY}>Sunday evening arrives, and many people are already thinking about the demands waiting for them: the workload, the meetings, the pressure, the responsibilities, and the lack of control over their time.</p>
            <p className={BODY}>For some, Sunday night is when the decision to leave their job becomes final. They may have been considering it for weeks or months, but the thought of returning to another week of the same conditions becomes the tipping point.</p>
            <p className={BODY}>Harmony Lane looked at that experience and asked a different question:</p>
            <p className="font-playfair text-xl font-semibold leading-snug text-[#C13B6B] sm:text-2xl">What if we didn't simply help people get through another workweek? What if we redesigned how they enter it?</p>
            <p className={BODY}>That is why we decided to <strong>Make Time For More on Monday.</strong></p>
            <p className={BODY}>Rather than beginning the week by adding more demands, we introduce work-life balance at the point where the workweek begins.</p>
            <p className={BODY}>We bring work-life balance into the workday and workweek—not as something founders hope to experience after work, but as part of how they operate their businesses.</p>
          </div>
          <div className="flex flex-col gap-5 border-t border-[#EAD5DC] pt-10">
            <p className="font-playfair text-xl font-semibold leading-snug text-[#C13B6B] sm:text-2xl">Monday is the intentional entry point into the Work-Life Balance Business Week™.</p>
            <p className={BODY}>It is where founders:</p>
            <ul className="flex flex-col gap-3">
              {[
                "Reconnect with the life they are building their business to support.",
                "Establish their intentions for the week.",
                "Identify what matters most in their business and personal lives.",
                "Bring their priorities into the Work-Life Balance Business Day™.",
                "Establish the boundaries that will contain work and protect time for life.",
                "Begin the week with a different operating experience.",
              ].map((item) => (
                <li key={item} className={`flex items-start gap-3 ${BODY}`}>
                  <Dot />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-playfair text-xl font-semibold leading-snug text-[#C13B6B] sm:text-2xl">Monday is not about preparing to hustle harder. It is about entering the workweek differently.</p>
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 bg-[#123B2A] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <header className="mx-auto mb-12 max-w-4xl text-center">
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.24em] text-[#C9DDB4]">Experience Your Work-Life Balance Business Day™</p>
            <h2 className="mt-3 font-playfair text-balance text-3xl font-bold leading-tight text-[#FFF8F4] sm:text-5xl">Practice Your Human Sustainability Boundaries™</h2>
            <p className="mt-5 font-poppins text-pretty text-lg leading-relaxed text-[#F6D6E1]">Set boundaries that make room for your life while giving your business the structure and focused attention it needs.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Flex-Time™", lead: "Prepare for Your Day.", body: "Make room for personal preparation and competing priorities before stepping into your business day. Take care of what matters in your life so everything doesn't have to compete with your work.", image: "/images/holiday/winter-stroll.webp", alt: "A woman enjoying a festive winter stroll with a warm drink." },
              { title: "Decide & Design™", lead: "Redesign Your Entry Into the Workweek.", body: "Decide what matters and personalize your Work-Life Balance Business Day. Plan your business priorities, account for your personal priorities, and design how you want your day to work.", image: "/images/holiday/holiday-decide-design.webp", alt: "Decide & Design banner reading Your Work-Life Balance Business Day: Redesign Your Entry Into the Workweek, framed by cherry blossoms, a holiday candle, and a pink planner." },
              { title: "Morning GIV•EN™", lead: "Begin With Intention and Alignment.", body: "Practice Gratitude, Intention, Vision & Visualization, Emotional Embodiment, and Nurture to bring clarity and intention to your day.", image: "/images/holiday/holiday-morning-given.webp", alt: "A man meditating on a cushion, facing a snowy Japanese garden with cherry blossoms and a red bridge at sunrise." },
              { title: "Movement Window™", lead: "Make Room for Movement.", body: "Give your body the opportunity to move. Make physical activity part of your day instead of something you continually put off.", image: "/images/holiday/hanukkah-tai-chi.webp", alt: "A mother and daughter practicing movement together at home." },
              { title: "Extended Healthy Hybrid Lunch™", lead: "Step Away, Recharge, and Enjoy a Real Break.", body: "Make room for nourishment, rest, connection, and personal priorities. Give yourself permission to step away from business.", image: "/images/holiday/cafe-gathering.webp", alt: "Two friends enjoying a meal together in a welcoming café." },
              { title: "4-Hour Focused CEO Workday™", lead: "Focus on the Business Priorities That Matter.", body: "Give your business focused attention. Work on the priorities you selected during Decide & Design and move your business forward without allowing work to consume your entire day.", image: "/images/holiday/team-celebration.webp", alt: "A team sharing a moment of connection around their work." },
              { title: "Time Freedom™", lead: "Reclaim Your Personal Time.", body: "Close out your focused work and make room for the life your business was intended to support—your relationships, interests, experiences, and personal priorities.", image: "/images/holiday/togetherness.webp", alt: "Family and friends enjoying time together outdoors." },
              { title: "Power Down™", lead: "Close the Day Together.", body: "Join the live community Zoom from 10:00–11:00 PM ET to acknowledge the completed day, reflect, and prepare for bedtime. This is not a time to catch up on business work.", image: "/images/holiday/kwanzaa-rest.webp", alt: "A quiet evening moment of rest and renewal." },
              { title: "Unplug™", lead: "Disconnect and Rest.", body: "At 11:00 PM ET, the community closes. Step away from devices and business communications, begin your overnight digital detox, and make room for a full night's sleep.", image: "/images/holiday/digital-detox-sign.webp", alt: "A sign announcing the community's nightly digital detox." },
            ].map((item) => (
              <article key={item.title} className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(255,255,255,0.72)] ring-1 ring-white/70 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_44px_rgba(255,255,255,0.95)] motion-reduce:transition-none motion-reduce:hover:transform-none">
                <img src={item.image} alt={item.alt} className="h-56 w-full object-cover" loading="lazy" />
                <div className="flex flex-col gap-2 p-7">
                  <h3 className="font-playfair text-xl font-bold text-[#4A3A42]">{item.title}</h3>
                  <p className="font-poppins text-sm font-semibold text-[#C13B6B]">{item.lead}</p>
                  <p className="font-poppins text-sm leading-relaxed text-[#5A4A52]">{item.body}</p>
                </div>
              </article>
            ))}
          </div>        </div>
      </section>

      <section id="weekly-rhythm" className="scroll-mt-20 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <header className="mx-auto mb-12 max-w-4xl text-center">
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7F46]">The Work-Life Balance Business Week™</p>
            <h2 className="mt-3 font-playfair text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">See How Your Week Works.</h2>
            <p className="mt-5 font-poppins text-lg leading-relaxed text-[#5A4A52]">We Don't Hustle — We Harmonize Work &amp; Life.™ We contain work, so life has space to expand. Here's how you put that into practice—starting on Day 1.</p>
          </header>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5">
            <article className="rounded-2xl border border-[#2D6348]/30 bg-[#123B2A] p-6 sm:p-8">
              <p className="font-poppins text-sm font-semibold uppercase tracking-[0.18em] text-[#F6A9C2]">01 · Sunday — See your reality</p>
              <h3 className="mt-3 font-playfair text-2xl font-bold text-[#FFF8F4]">Start with the Reality Check™</h3>
              <p className="mt-3 font-poppins text-base leading-relaxed text-[#F6D6E1]">Look at where business demands and life priorities are competing. Identify the boundaries that need attention. Sunday is your reflection and transition point—not another scheduled business workday.</p>
            </article>
            <article className="rounded-2xl border border-[#2D6348]/30 bg-[#123B2A] p-6 sm:p-8">
              <p className="font-poppins text-sm font-semibold uppercase tracking-[0.18em] text-[#F6A9C2]">02 · Monday–Thursday — Repeat each day</p>
              <h3 className="mt-3 font-playfair text-2xl font-bold text-[#FFF8F4]">Decide. Design. Live Your Day.</h3>
              <p className="mt-3 font-poppins text-base leading-relaxed text-[#F6D6E1]">Each business day, decide what matters in work and life. Personalize that day's time-and-space boundaries in their dropdown spaces; your choices populate that day's schedule. Then begin living, working, leading, and operating within those boundaries—starting Monday, Day 1.</p>
              <p className="mt-4 font-poppins text-sm font-semibold text-[#C9DDB4]">Join live Zoom co-working for community, support, and accountability.</p>
            </article>
            <article className="rounded-2xl border border-[#2D6348]/30 bg-[#123B2A] p-6 sm:p-8">
              <p className="font-poppins text-sm font-semibold uppercase tracking-[0.18em] text-[#F6A9C2]">03 · At the end of each boundary</p>
              <h3 className="mt-3 font-playfair text-2xl font-bold text-[#FFF8F4]">Five Minutes to Notice and Record.</h3>
              <p className="mt-3 font-poppins text-base leading-relaxed text-[#F6D6E1]">Record whether a collision occurred, what interfered, and what you observed. These brief check-ins help reveal patterns across the four business days.</p>
            </article>
            <article className="rounded-2xl border border-[#2D6348]/30 bg-[#123B2A] p-6 sm:p-8">
              <p className="font-poppins text-sm font-semibold uppercase tracking-[0.18em] text-[#F6A9C2]">04 · 1:00–5:00 PM ET — Focused CEO Workday™</p>
              <h3 className="mt-3 font-playfair text-2xl font-bold text-[#FFF8F4]">Choose the Work That Moves Your Business.</h3>
              <p className="mt-3 font-poppins text-base leading-relaxed text-[#F6D6E1]">Choose an assignment from your own business priorities or from the business functions—Client Attraction, Sales &amp; Conversion, Service/Product Delivery, or Business Operations. Use this time to execute business work or redesign how the business operates.</p>
            </article>
            <article className="rounded-2xl border border-[#2D6348]/30 bg-[#123B2A] p-6 sm:p-8">
              <p className="font-poppins text-sm font-semibold uppercase tracking-[0.18em] text-[#F6A9C2]">05 · After the four-day rhythm</p>
              <h3 className="mt-3 font-playfair text-2xl font-bold text-[#FFF8F4]">Turn a Boundary Into a Business Rule.</h3>
              <p className="mt-3 font-poppins text-base leading-relaxed text-[#F6D6E1]">Choose a Non-Negotiable Boundary to integrate into your actual business. Use the guided Boundary Builder and Communicate + Delegate process to begin creating a Business Operating Rule / SOP that helps protect it.</p>
            </article>
            <article className="rounded-2xl border border-[#2D6348]/30 bg-[#123B2A] p-6 sm:p-8">
              <p className="font-poppins text-sm font-semibold uppercase tracking-[0.18em] text-[#F6A9C2]">06 · Friday–Sunday — Three-day weekend</p>
              <h3 className="mt-3 font-playfair text-2xl font-bold text-[#FFF8F4]">Practice Being Present in Your Life.</h3>
              <p className="mt-3 font-poppins text-base leading-relaxed text-[#F6D6E1]">No scheduled business work. Enjoy relationships, personal priorities, rest, and experiences. The weekend is a boundary, too: practice being away from the business without feeling compelled to return to work.</p>
            </article>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-[#2D6348]/30 bg-[#123B2A] p-6 sm:p-8">
              <p className="font-poppins text-sm font-semibold uppercase tracking-[0.18em] text-[#C9DDB4]">5:00–10:00 PM ET</p>
              <h3 className="mt-2 font-playfair text-2xl font-bold text-[#FFF8F4]">Time Freedom™</h3>
              <p className="mt-3 font-poppins text-base leading-relaxed text-[#F6D6E1]">The business day is finished at 5:00 PM. These five hours belong to life—not business catch-up. Make room for relationships, dinner, interests, and whatever you choose to enjoy.</p>
            </article>
            <article className="rounded-2xl border border-[#2D6348]/30 bg-[#123B2A] p-6 sm:p-8">
              <p className="font-poppins text-sm font-semibold uppercase tracking-[0.18em] text-[#C9DDB4]">10:00–11:00 PM ET · Live Zoom</p>
              <h3 className="mt-2 font-playfair text-2xl font-bold text-[#FFF8F4]">Power Down™</h3>
              <p className="mt-3 font-poppins text-base leading-relaxed text-[#F6D6E1]">Join the community to release a day that is already complete, acknowledge accomplishments, and co-work on your bedtime routine. The goal: pajamas on, in bed, ready to unplug when the community closes at 11:00 PM.</p>
            </article>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl shadow-lg">
            <img src="/images/holiday/digital-detox-sign.webp" alt="Unplug Close card" className="h-auto w-full object-cover" loading="lazy" />
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-center font-poppins text-base leading-relaxed text-[#4A3A42]">Yes, we do close at night—and we strive to get 8 hours of sleep.</p>
          <p className="mx-auto mt-10 max-w-4xl text-center font-playfair text-xl font-semibold leading-relaxed text-[#4A3A42] sm:text-2xl">Repeat the rhythm. Build the habit. Integrate the boundaries you choose—or adopt the full Work-Life Balance Business Model™ through the monthly membership.</p>
        </div>
      </section>

      <section className="bg-[#FCEEF2] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#C13B6B]">We Help You Build Work-Life Balance Boundaries Into Your Business.</p>
            <h2 className="mt-3 font-playfair text-3xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">Eight Non-Negotiable Human Work-Life Balance Time &amp; Space Boundaries™</h2>
            <p className="mt-4 font-poppins text-base leading-relaxed text-[#5A4A52]">These provide a practical structure. Each founder personalizes them around their intentions, priorities, responsibilities, and business needs.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Flex Time™", description: "Choose a work rhythm that makes room for the needs of your day." },
              { title: "Morning GIV•EN™ Routine", description: "Begin with gratitude, intention, vision, emotional embodiment, and nurture." },
              { title: "Workout & Movement Window™", description: "Protect time for daily movement and care for your physical well-being." },
              { title: "Extended Healthy Hybrid Lunch Break™", description: "Make space for a nourishing meal, restoration, and a real midday pause." },
              { title: "4-Hour Focused CEO Workday™", description: "Concentrate on your highest-priority business work in a focused work block." },
              { title: "Time Freedom™", description: "Keep time beyond scheduled work available for life, relationships, and joy." },
              { title: "Power Down™", description: "Create an evening transition that brings the business day to a close." },
              { title: "Unplug™", description: "Disconnect from business devices and communications to support restorative rest." },
            ].map((item, i) => (
              <article key={item.title} className="flex min-h-44 flex-col rounded-2xl bg-white p-6 shadow-sm">
                <span className="font-playfair text-3xl font-bold text-[#C13B6B]">0{i + 1}</span>
                <h3 className="mt-4 font-playfair text-xl font-bold leading-snug text-[#4A3A42]">{item.title}</h3>
                <p className="mt-2 font-poppins text-sm leading-relaxed text-[#5A4A52]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFF8F4] px-5 py-14 text-center sm:px-8 sm:py-16">
        <p className="mx-auto max-w-3xl font-playfair text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl">
          You don't just learn about work-life balance. You practice it inside your actual business.
        </p>
      </section>
    </>
  )
}

export function FreedomSection() {
  return (
    <>
      <section className="bg-[#F7DCE5] py-16 sm:py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 text-center sm:px-8">
          <p className={EYEBROW}>Your Virtual Work-Life Balance Destination</p>
          <p className="font-playfair text-balance text-2xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">
            Reserve Your First <span className="font-light italic">(or Next)</span>
          </p>
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Work-Life Balance Business Week™
          </h2>
          <p className={BODY}>
            A one-week immersive founder experience, offered weekly, where you step into a Work-Life Balance environment with non-negotiable boundaries already built in and live, work, lead, and operate your actual business while containing work so life has space to expand—<em>in real time</em>.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-5">
            <h2 className="font-playfair text-balance text-2xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">Experience The Freedom You Intended to Create.</h2>
            <p className={BODY}>You started your business for more freedom.</p>
            <p className={BODY}>You wanted to build a business that supported the life you wanted.</p>
            <p className={BODY}>
              But somewhere along the way, you unintentionally brought the hustle with you. You left a demanding corporate environment only to recreate those same demands inside your own business.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "The long hours.",
                "The constant availability.",
                "The pressure to do more.",
                "The feeling that everything depends on you.",
                "Work expanding into your personal time.",
              ].map((item) => (
                <li key={item} className={`flex items-start gap-3 ${BODY}`}>
                  <Dot />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-playfair text-xl font-semibold leading-snug text-[#C13B6B] sm:text-2xl">
              And now, with AI adding a new reality to navigate and integrate...
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

      <section className="bg-[#123B2A] py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-5">
            <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#FFF8F4] sm:text-5xl">
              More Opportunity Can Bring More Pressure.
            </h2>
            <p className="font-poppins text-pretty text-lg leading-relaxed text-[#F6D6E1]">
              More technology can bring more complexity. And more capacity can become even more work.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Keeping up with rapidly changing technology.",
                "Figuring out which tools your business needs.",
                "Finding time to learn how to use them effectively.",
                "Deciding what to automate and what should remain human-led.",
                "Navigating the demands of AI adoption while already carrying the responsibilities of running an overextended business.",
              ].map((item) => (
                <li key={item} className="font-poppins flex items-start gap-3 text-lg leading-relaxed text-[#FFF8F4]">
                  <Dot className="bg-[#F6A9C2]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-poppins text-pretty text-lg leading-relaxed text-[#F6D6E1]">
              We cannot keep adding demands without considering what human beings can sustainably carry. Attention, energy, and recovery are not unlimited resources.
            </p>
          </div>
          <blockquote className="flex flex-col items-center gap-5 rounded-3xl border border-[#FFF8F4]/15 bg-[#FFF8F4]/5 p-8 text-center">
            <p className="font-playfair text-2xl font-semibold italic leading-relaxed text-[#FFF8F4] sm:text-3xl">
              “Attention, energy, and recovery are not unlimited resources.”
            </p>
            <footer className="font-poppins text-sm font-semibold uppercase tracking-[0.18em] text-[#C9DDB4]">
              — Thought Leader Barbara
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="bg-white px-5 py-14 text-center sm:px-8 sm:py-16">
        <h2 className="mx-auto max-w-5xl font-playfair text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
          This Is Why We Don&apos;t Automate &amp; Accelerate the Hustle.
        </h2>
      </section>


    </>
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
    <section id="reality-check" className="relative scroll-mt-20 overflow-hidden bg-[#123B2A] py-20 sm:py-28">
      <img src="/images/holiday/kwanzaa-rest.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-100" loading="lazy" />
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
        <div className="flex flex-col gap-5 rounded-3xl border border-[#FFF8F4]/15 bg-[#123B2A]/65 p-7 backdrop-blur-sm">
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
  return (
    <section id="business-week" className="scroll-mt-20 bg-[#FFF8F4] py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <img src="/images/holiday/team-celebration.webp" alt="A team celebrating together around a festive table" className="w-full rounded-3xl object-cover shadow-xl" loading="lazy" />
          <div className="flex flex-col gap-5">
            <p className={EYEBROW}>Harmony Lane Experience Two · The Full-Week Experience</p>
            <h2 className={H2}>The Work-Life Balance Business Week™</h2>
            <p className={BODY}>A complete seven-day guided experience for founders who want to practice work-life balance while doing their actual business work—not by stepping away from the business, but by redesigning how they enter, operate, and close their workweek.</p>
            <p className={BODY}>The Work-Life Balance Business Day™ is the guided Monday experience within the Business Week. You can also choose the Business Day as a standalone experience, but you do not need to purchase it separately when you join the Business Week.</p>
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
          </div>
          <div className="flex flex-col justify-center gap-5 rounded-3xl bg-[#123B2A] p-8">
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
        <div className="flex justify-center">
          <CtaLink label="Join the Free Sunday Reality Check" />
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
  { q: "What is the Work-Life Balance Business Day™?", a: "It is the guided Monday experience within the Work-Life Balance Business Week™. It helps you reconnect with your entrepreneurial intention, review your current reality, personalize boundaries, design your business day, and practice those boundaries while doing real business work. It can also be experienced on its own as a standalone offering." },
  { q: "What is the Work-Life Balance Business Week™?", a: "It is the complete seven-day guided experience. It includes the Work-Life Balance Business Day™ on Monday, guided boundary practice during the workweek, a Thursday closeout, and intentional Friday–Sunday Time Freedom™." },
  { q: "Do I need to buy the Business Day separately to join the Business Week?", a: "No. The Work-Life Balance Business Day™ is already included as the Monday experience in the Work-Life Balance Business Week™. A separate purchase is only relevant if you choose the standalone Business Day instead of the full-week experience." },
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
    <section id="enrollment" className="relative scroll-mt-20 overflow-hidden bg-[#123B2A] py-20 sm:py-28">
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