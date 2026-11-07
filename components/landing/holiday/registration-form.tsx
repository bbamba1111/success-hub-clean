"use client"

import { useFormState, useFormStatus } from "react-dom"
import { registerForRealityCheck, type RegistrationState } from "@/app/landing/actions"
import { SESSION_DURATION_LABEL, SESSION_TIME_LABEL, formatSessionDate } from "@/lib/reality-check/session"

const initialState: RegistrationState = { status: "idle" }

const fieldClass =
  "font-poppins w-full rounded-xl border border-[#E8D5DC] bg-[#FFFDFB] px-4 py-3 text-base text-[#4A3A42] placeholder:text-[#A8989F] focus:border-[#C13B6B] focus:outline-none focus:ring-2 focus:ring-[#C13B6B]/20"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-poppins mt-1 inline-flex w-full items-center justify-center rounded-full bg-[#C13B6B] px-7 py-4 text-[15px] font-semibold uppercase tracking-[0.1em] text-[#FFF8F4] shadow-lg shadow-[#C13B6B]/25 transition-colors hover:bg-[#A8305B] disabled:opacity-60"
    >
      {pending ? "Saving your seat…" : "Save My Free Seat"}
    </button>
  )
}

function SuccessMessage({ state }: { state: RegistrationState }) {
  const when = `${state.sessionDate ? formatSessionDate(state.sessionDate) : "Sunday"} at ${SESSION_TIME_LABEL}`
  const copy =
    state.emailStatus === "failed"
      ? `Your seat for ${when} is saved, but we couldn't send your confirmation email just now. Submit the form again in a few minutes and we'll retry sending your Zoom link.`
      : state.emailStatus === "already_sent"
        ? `You're already registered for ${when}. Your confirmation with the Zoom link was sent to ${state.email}.`
        : `We've emailed your confirmation and private Zoom link to ${state.email}. See you ${when} (${SESSION_DURATION_LABEL}).`

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl p-6 text-center ${state.emailStatus === "failed" ? "bg-[#FCEEF2]" : "bg-[#EEF3E8]"}`}
      role="status"
    >
      <p className="font-playfair text-2xl font-bold text-[#4A3A42]">Your seat is saved.</p>
      <p className="font-poppins text-base leading-relaxed text-[#5A4A52]">{copy}</p>
    </div>
  )
}

export function RegistrationForm() {
  const [state, formAction] = useFormState(registerForRealityCheck, initialState)

  if (state.status === "success" && state.emailStatus !== "failed") {
    return <SuccessMessage state={state} />
  }

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {state.status === "success" && <SuccessMessage state={state} />}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="fullName" className="font-poppins text-[15px] font-semibold text-[#4A3A42]">
          Full name
        </label>
        <input id="fullName" name="fullName" type="text" autoComplete="name" required maxLength={120} className={fieldClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="font-poppins text-[15px] font-semibold text-[#4A3A42]">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} className={fieldClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="mobile" className="font-poppins text-[15px] font-semibold text-[#4A3A42]">
          Mobile number <span className="font-normal text-[#8A7A82]">(optional)</span>
        </label>
        <input id="mobile" name="mobile" type="tel" autoComplete="tel" maxLength={25} className={fieldClass} />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <p className="font-poppins rounded-lg bg-[#FCE8EE] px-3 py-2 text-[15px] text-[#A8305B]" role="alert">
          {state.message}
        </p>
      )}

      <SubmitButton />
      <p className="font-poppins text-center text-sm text-[#8A7A82]">
        FREE · No credit card required · Your Zoom link arrives by email
      </p>
    </form>
  )
}
