/**
 * Transition Space™ (internal, ~15-minute Monday boundary between Redesign
 * Your Entry Into The Workweek™ and Morning GIV•EN™).
 *
 * This is a GENUINE preparation boundary — NOT a sales moment. There is no
 * pricing, no "Join Us NOW" conversion, and no upgrade CTA here. It simply
 * gives the founder a protected pause to let the redesign settle before the
 * live rhythm continues.
 */
export function TransitionSpaceInvitation() {
  return (
    <div className="px-7 py-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#4A7C59]">
          Transition Space™
        </p>
        <h2 className="font-playfair text-[28px] font-semibold leading-tight tracking-tight text-[#1C161A] sm:text-[34px] text-balance">
          A moment to let it settle.
        </h2>
        <p className="mt-2 font-playfair text-[17px] italic leading-snug text-[#4A7C59] sm:text-[20px] text-pretty">
          Before you step into the rhythm of the day.
        </p>

        <div className="mt-5 space-y-2 text-sm leading-relaxed text-[#5C4F55]">
          <p>You&apos;ve looked at your current reality.</p>
          <p>You&apos;ve redesigned your entry into the workweek.</p>
          <p className="pt-1">
            Take a breath here. Step away from the screen, stretch, and arrive present — Morning GIV•EN™ is next.
          </p>
        </div>

        <div className="mx-auto mt-7 max-w-md rounded-2xl border border-[#4A7C59]/20 bg-[#4A7C59]/[0.05] px-6 py-5 text-left">
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-[#4A7C59]">
            While you pause
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#5C4F55]">
            <li>Stand up, stretch, or step outside for a moment.</li>
            <li>Let what surfaced in your Reality Check™ settle without acting on it.</li>
            <li>Arrive present for Morning GIV•EN™ rather than rushing into it.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
