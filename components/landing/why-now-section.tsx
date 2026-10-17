const BEFORE = [
  "Before accelerating work, reconnect with your entrepreneurial intention.",
  "Before filling new capacity, decide what your life needs.",
  "Before automating existing habits, experience a more human-centered way to operate.",
]

export function WhyNowSection() {
  return (
    <section id="why-now" className="w-full scroll-mt-20 bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="font-poppins text-sm font-semibold tracking-[0.14em] text-[#C13B6B]">Why Now?</p>
        <h2 className="font-playfair mt-4 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
          Don&apos;t Automate the Hustle You Unintentionally Built.
        </h2>
        <p className="font-playfair mt-4 text-pretty text-lg font-semibold text-[#5A7F46] sm:text-xl">
          AI may accelerate your business. Establish your human boundaries before you accelerate.
        </p>

        <div className="font-poppins mt-8 flex flex-col gap-4 text-pretty text-lg leading-relaxed text-[#5A4A52]">
          <p>
            Agentic AI creates new possibilities for how businesses execute work, coordinate tasks, and use capacity.
          </p>
          <p>
            But technical capability alone does not determine whether the result will be a better life for the founder.
          </p>
          <p>Without intentional boundaries, new capacity can become more work, more availability, and more demand.</p>
        </div>

        <aside
          aria-labelledby="research-heading"
          className="mt-12 rounded-2xl border border-[#E5D8DC] bg-white p-6 sm:p-8"
        >
          <h3 id="research-heading" className="font-playfair text-xl font-bold text-[#4A3A42] sm:text-2xl">
            What Happens When AI Makes More Work Possible?
          </h3>
          <div className="font-poppins mt-4 flex flex-col gap-4 text-pretty text-base leading-relaxed text-[#5A4A52]">
            <p>Research is beginning to document a challenge that matters to founders adopting AI.</p>
            <p>
              In an in-progress, eight-month study of approximately 200 employees at one U.S. technology company,
              researchers described how generative AI tools could accelerate work while also contributing to broader
              workloads and work extending into more hours of the day.
            </p>
            <p>The finding raises an important question for founders:</p>
            <p className="font-playfair text-lg font-semibold leading-snug text-[#4A3A42]">
              When AI creates additional capacity, will that capacity create more room for human life&mdash;or simply
              more room for work?
            </p>
            <p>At Harmony Lane&trade;, we believe that question deserves attention before acceleration becomes the default.</p>
            <p>
              The answer begins with establishing human boundaries, deciding what your business should make possible, and
              designing your operating practices accordingly.
            </p>
          </div>

          <div className="font-poppins mt-6 flex flex-col gap-2 border-t border-[#F2E4E8] pt-5 text-sm leading-relaxed text-[#6A5A62]">
            <p>
              <span className="font-semibold text-[#4A3A42]">Research limitation:</span> This study concerns employees at
              one technology company. It is in-progress research, not proof that the same effects occur in every
              organization or that Harmony Lane&trade; produces particular results.
            </p>
            <p>
              Source: Aruna Ranganathan and Xingqi Maggie Ye, &ldquo;AI Doesn&apos;t Reduce Work&mdash;It Intensifies
              It,&rdquo; Harvard Business Review, February 9, 2026.
            </p>
            <a
              href="https://hbr.org/2026/02/ai-doesnt-reduce-work-it-intensifies-it"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit font-semibold text-[#C13B6B] underline underline-offset-4 hover:text-[#a8325c]"
            >
              Read the Harvard Business Review article
            </a>
          </div>
        </aside>

        <div className="mt-12 flex flex-col gap-4">
          <p className="font-playfair text-xl font-bold text-[#4A3A42]">
            Harmony Lane&trade; begins on the human side of the equation.
          </p>
          <ul className="flex flex-col gap-3">
            {BEFORE.map((line) => (
              <li key={line} className="font-poppins flex items-start gap-3 text-lg leading-relaxed text-[#5A4A52]">
                <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-[#8AA06A]" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
          <p className="font-playfair mt-4 text-2xl font-bold text-[#5A7F46] sm:text-3xl">
            Don&apos;t re-spend the capacity AI creates.
          </p>
          <p className="font-poppins text-pretty text-lg leading-relaxed text-[#5A4A52]">
            You do not need to become a technical AI expert to begin this work. You need to recognize the human
            boundaries your life requires and understand why your business must make room for them.
          </p>
        </div>
      </div>
    </section>
  )
}
