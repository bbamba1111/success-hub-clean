"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface AuditWelcomePopupProps {
  onClose: () => void
  onStartAudit: () => void
}

export default function AuditWelcomePopup({ onClose, onStartAudit }: AuditWelcomePopupProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleStartAudit = () => {
    if (dontShowAgain) {
      localStorage.setItem("dontShowAuditWelcome", "true")
    }
    onStartAudit()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-[600px] max-h-[90vh] overflow-y-auto relative m-4 w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-8 flex flex-col items-center min-h-[600px] justify-between">
          <div className="flex flex-col items-center">
            <div className="mb-8">
              <Image
                src="/images/logo.png"
                alt="Make Time For More Logo"
                width={225}
                height={225}
                className="rounded-full"
              />
            </div>

            <h1
              className="text-5xl font-medium tracking-tight mb-4 text-[#E26C73] text-center"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}
            >
              Make Time For More™
            </h1>

            <h2
              className="text-3xl font-medium tracking-tight mb-8 text-[#333] text-center"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}
            >
              Work-Life Balance Audit
            </h2>

            <p className="text-lg text-center mb-8 max-w-[500px]">
              This is your personal 15-question Work-Life Balance Audit based on the 13 Core Life Value Areas we focus
              on inside the Make Time For More™ Work-Life Balance Experience.
            </p>
          </div>

          <div className="flex flex-col items-center w-full">
            <Button
              onClick={handleStartAudit}
              className="bg-[#5D9D61] hover:bg-[#4c8050] text-white text-xl py-6 px-8 rounded-md w-full max-w-md mb-8"
            >
              Take The FREE Audit Now!
            </Button>

            <p className="text-lg text-center mb-6">This is not about judgment — this is about clarity.</p>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="dontShowAgain"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="mr-2 h-5 w-5"
              />
              <label htmlFor="dontShowAgain" className="text-gray-600">
                Don't show this again
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
