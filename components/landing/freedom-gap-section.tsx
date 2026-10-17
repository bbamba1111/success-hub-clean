const SEQUENCE = [
  {
    label: "Original Intention",
    body: "Build a business that creates freedom and a better life.",
  },
  {
    label: "Current Reality",
    body: "Business demands and established habits expand into personal time and space.",
  },
  {
    label: "AI Acceleration",
    body: "New capacity risks becoming additional work.",
  },
  {
    label: "The Harmony Lane\u2122 Alternative",
    body: "Personalize human boundaries, practice a redesigned rhythm, and intentionally decide what the capacity should make possible.",
  },
]

export function FreedomGapSection() {
  return (
    <section id="freedom-gap" className="w-full scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <p className="font-poppins text-sm font-semibold tracking-[0.14em] text-[#C13B6B]">
            The Entrepreneurial Freedom Gap&trade;
          </p>
          <h2 className="font-playfair mt-4 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            You Didn&apos;t Start Your Business to Recreate the Life You Left.
          </h2>

          <div className="font-poppins mt-8 flex flex-col gap-4 text-pretty text-lg leading-relaxed text-[#5A4A52]">
            <p>
              You started your business for more freedom. More time. More flexibility. More opportunity to live on your
              terms.
            </p>
            <p>
              But the habits that helped you succeed in a previous environment can follow you into entrepreneurship.
            </p>
            <p>
              Work expands. Availability becomes the default. Responsibilities multiply. Your life begins adjusting
              around the business you built to make more life possible.
            </p>
            <p>Now AI introduces another layer of acceleration.</p>
            <p>
              AI can increase what a business can accomplish. But increased capability does not automatically create
              more freedom.
            </p>
            <p>
              If every efficiency gain becomes more output, more clients, faster response times, greater availability,
              and more work, the business may simply consume the capacity it just created.
            </p>
          </div>

          <p className="font-playfair mt-10 text-balance text-2xl font-bold leading-snug text-[#5A7F46] sm:text-3xl">
            You didn&apos;t leave hustle culture to automate it.
          </p>
        </div>

        <div className="mt-16 rounded-3xl border border-[#F2E4E8] bg-[#FDF6F3] p-6 sm:p-10">
          <p className="font-poppins max-w-3xl text-pretty text-base leading-relaxed text-[#5A4A52]">
            <span className="font-semibold text-[#4A3A42]">The Entrepreneurial Freedom Gap&trade;</span> is the
            distance between the freedom a founder originally intended to create and the way the business currently
            shapes their time, attention, and life.
          </p>

          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SEQUENCE.map((step, i) => {
              const isAlternative = i === SEQUENCE.length - 1
              return (
                <li
                  key={step.label}
                  className={`flex flex-col gap-3 rounded-2xl p-5 ${
                    isAlternative ? "bg-[#5A7F46] text-white" : "border border-[#F2E4E8] bg-white"
                  }`}
                >
                  <span
                    className={`font-poppins text-xs font-semibold tracking-[0.14em] ${
                      isAlternative ? "text-white/80" : "text-[#C13B6B]"
                    }`}
                  >
                    Step {i + 1}
                  </span>
                  <h3
                    className={`font-playfair text-lg font-bold leading-snug ${
                      isAlternative ? "text-white" : "text-[#4A3A42]"
                    }`}
                  >
                    {step.label}
                  </h3>
                  <p
                    className={`font-poppins text-sm leading-relaxed ${
                      isAlternative ? "text-white/90" : "text-[#5A4A52]"
                    }`}
                  >
                    {step.body}
                  </p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
