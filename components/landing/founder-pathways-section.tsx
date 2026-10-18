const PATHWAYS = [
  {
    id: "design",
    eyebrow: "Pathway A",
    title: "Design It In From the Beginning",
    audience: "For new entrepreneurs, startup founders, and founders preparing to launch.",
    body: [
      "You don't have to wait until your business consumes your time to decide how you want it to operate.",
      "Start with your entrepreneurial intention. Define the human boundaries you want to protect. Consider how your workday, availability, client expectations, communication practices, and responsibilities should be designed around the life you want your business to support.",
      "As you introduce AI, decide what additional capacity should make possible instead of automatically turning every efficiency gain into more work.",
    ],
    benefits: [
      "Establish personal boundaries and a sustainable working rhythm early.",
      "Set intentional expectations for workload, communication, and availability.",
      "Build a foundation that can evolve as the business grows and adopts AI.",
    ],
  },
  {
    id: "redesign",
    eyebrow: "Pathway B",
    title: "Redesign the Business You Already Built",
    audience: "For established entrepreneurs and growing businesses.",
    body: [
      "You may have started your business for freedom, flexibility, and greater control over your life. Over time, client demands, responsibilities, established habits, and new technology may have changed the reality.",
      "You don't need to abandon the business you built. You need to examine how it operates and decide what should change.",
    ],
    benefits: [
      "Recognize the gap between your original intention and current reality.",
      "Identify recurring collisions between business demands and personal boundaries.",
      "Begin redesigning your working rhythm and the business practices that interfere with it.",
    ],
  },
]

export function FounderPathwaysSection() {
  return (
    <section id="pathways" className="w-full scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Two Ways to Begin. One Work-Life Balance Business Model&trade;.
          </h2>
          <div className="font-poppins mt-6 flex flex-col gap-4 text-pretty text-lg leading-relaxed text-[#5A4A52]">
            <p>
              Every founder begins somewhere. Some are establishing a business for the first time. Others have built a
              business and now recognize that the way it operates no longer supports the life they intended to create.
            </p>
            <p>Harmony Lane&trade; helps both design a more intentional relationship between business and human life.</p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PATHWAYS.map((path) => (
            <article
              key={path.id}
              aria-labelledby={`pathway-${path.id}`}
              className="flex flex-col gap-5 rounded-3xl border border-[#F2E4E8] bg-[#FDF6F3] p-7 sm:p-9"
            >
              <div>
                <p className="font-poppins text-sm font-semibold tracking-[0.14em] text-[#C13B6B]">{path.eyebrow}</p>
                <h3
                  id={`pathway-${path.id}`}
                  className="font-playfair mt-3 text-balance text-2xl font-bold leading-tight text-[#4A3A42] sm:text-3xl"
                >
                  {path.title}
                </h3>
                <p className="font-poppins mt-2 text-base font-semibold text-[#5A7F46]">{path.audience}</p>
              </div>
              <div className="font-poppins flex flex-col gap-3 text-pretty text-base leading-relaxed text-[#5A4A52]">
                {path.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <ul className="mt-auto flex flex-col gap-3 border-t border-[#F2E4E8] pt-5">
                {path.benefits.map((b) => (
                  <li key={b} className="font-poppins flex items-start gap-3 text-base leading-relaxed text-[#4A3A42]">
                    <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-[#8AA06A]" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p className="font-playfair max-w-2xl text-pretty text-xl font-semibold leading-snug text-[#4A3A42] sm:text-2xl">
            Different starting points. One intention: build a business that makes room for human life.
          </p>
          <a
            href="#monday"
            className="font-poppins inline-flex flex-none items-center justify-center rounded-full bg-[#8AA06A] px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-lg shadow-[#8AA06A]/25 transition-transform hover:scale-[1.03] hover:bg-[#788e5a]"
          >
            Explore the Monday Experience
          </a>
        </div>
      </div>
    </section>
  )
}
