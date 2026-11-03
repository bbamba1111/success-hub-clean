"use client"

import { useFormState, useFormStatus } from "react-dom"
import { registerForRealityCheck, type RegistrationState } from "@/app/landing/actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-poppins mt-1 inline-flex w-full items-center justify-center rounded-full bg-[#C13B6B] px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#FFF8F4] shadow-lg shadow-[#C13B6B]/25 transition-colors hover:bg-[#A8305B] disabled:opacity-60"
    >
      {pending ? "Saving your seat…" : "Save My Free Seat"}
    </button>
  )
}
import { formatSessionDate } from "@/lib/reality-check/session"

const initialState: RegistrationState = { status: "idle" }

const fieldClass =
  "font-poppins w-full rounded-xl border border-[#E8D5DC] bg-[#FFFDFB] px-4 py-3 text-base text-[#4A3A42] placeholder:text-[#A8989F] focus:border-[#C13B6B] focus:outline-none focus:ring-2 focus:ring-[#C13B6B]/20"

export function RegistrationForm() {
  const [state, formAction] = useFormState(registerForRealityCheck, initialState)

  if (state.status === "success") {
    return (
      <div className="flex flex-col gap-3 rounded-2xl bg-[#EEF3E8] p-6 text-center" role="status">
        <p className="font-playfair text-2xl font-bold text-[#4A3A42]">Your seat is saved.</p>
        <p className="font-poppins text-sm leading-relaxed text-[#5A4A52]">
          We&apos;ll see you {state.sessionDate ? formatSessionDate(state.sessionDate) : "Sunday"}. Your link and the
          session time are on their way to your inbox.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="fullName" className="font-poppins text-sm font-semibold text-[#4A3A42]">
          Full name
        </label>
        <input id="fullName" name="fullName" type="text" autoComplete="name" required maxLength={120} className={fieldClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="font-poppins text-sm font-semibold text-[#4A3A42]">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} className={fieldClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="mobile" className="font-poppins text-sm font-semibold text-[#4A3A42]">
          Mobile number <span className="font-normal text-[#8A7A82]">(optional)</span>
        </label>
        <input id="mobile" name="mobile" type="tel" autoComplete="tel" maxLength={25} className={fieldClass} />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="font-poppins flex items-start gap-3 text-xs leading-relaxed text-[#5A4A52]">
        <input name="smsConsent" type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[#C13B6B]" />
        <span>
          Text me my link and a reminder. By checking this box, you agree to receive reminder texts from Make Time For
          More™. Msg and data rates may apply. Reply STOP to unsubscribe.
        </span>
      </label>

      {state.status === "error" && (
        <p className="font-poppins rounded-lg bg-[#FCE8EE] px-3 py-2 text-sm text-[#A8305B]" role="alert">
          {state.message}
        </p>
      )}

      <SubmitButton />
      <p className="font-poppins text-center text-xs text-[#8A7A82]">Free · No card needed</p>
    </form>
  )
}
